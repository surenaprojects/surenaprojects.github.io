// --- JavaScript for UI Interactivity, 3D Effects, Theming, and i18n ---

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

let currentLang = "en";
let currentRepos = null; // cached GitHub API response, re-rendered on language change
let projectsState = "idle"; // idle | loading | file-protocol | loaded | empty | error
let heroSceneHandle = null; // exposes a hook for the theme toggle to recolor the 3D scene

(function () {
  const initialize = () => {
    setupMobileMenu();
    initializeScrollReveal();
    setupBackToTopButton();
    updateCopyrightYear();
    smoothScrollForAnchorLinks();
    setupThemeToggle();
    setupLanguageSwitcher();
    initSiteScene();
    initHeroGlow();
    initTiltCards(document.querySelectorAll(".tilt-card"));
  };

  function setupMobileMenu() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (!mobileMenuButton || !mobileMenu) return;

    mobileMenuButton.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("show");
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initializeScrollReveal() {
    const elementsToReveal = document.querySelectorAll(".scroll-reveal");
    if (elementsToReveal.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    elementsToReveal.forEach((element) => observer.observe(element));
  }

  function setupBackToTopButton() {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function updateCopyrightYear() {
    const yearSpan = document.getElementById("copyright-year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  function smoothScrollForAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();

/* ==========================================================
   Theme mode (dark / auto / light)
   The effective <html data-theme="..."> is set as early as
   possible by an inline script in <head> to avoid a flash;
   this wires up the segmented control, persists the chosen
   mode, and — when in "auto" — keeps the effective theme in
   sync with the visitor's local clock (day => light, night
   => dark) for as long as the tab stays open.
========================================================== */
function setupThemeToggle() {
  const root = document.documentElement;
  const groups = [
    document.getElementById("theme-segmented"),
    document.getElementById("theme-segmented-mobile"),
  ].filter(Boolean);

  if (groups.length === 0) return;

  function autoTheme() {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? "light" : "dark";
  }

  function syncButtons(mode) {
    groups.forEach((group) => {
      group.querySelectorAll(".theme-seg-btn").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.mode === mode));
      });
    });
  }

  function applyEffectiveTheme(effective) {
    root.setAttribute("data-theme", effective);
    if (heroSceneHandle) heroSceneHandle.refreshColors();
  }

  function setMode(mode) {
    root.setAttribute("data-theme-mode", mode);
    try {
      localStorage.setItem("sp-theme-mode", mode);
    } catch (e) {}
    syncButtons(mode);
    applyEffectiveTheme(mode === "auto" ? autoTheme() : mode);
  }

  // Keep "auto" mode honest while the tab is left open across the
  // day/night boundary (checked on an interval and whenever the tab
  // regains focus/visibility, rather than firing constantly).
  function recheckAutoTheme() {
    if (root.getAttribute("data-theme-mode") !== "auto") return;
    applyEffectiveTheme(autoTheme());
  }
  setInterval(recheckAutoTheme, 5 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") recheckAutoTheme();
  });

  groups.forEach((group) => {
    group.querySelectorAll(".theme-seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.dataset.mode));
    });
  });

  // Reflect whatever the anti-FOUC inline script already resolved.
  syncButtons(root.getAttribute("data-theme-mode") || "auto");
}

/* ==========================================================
   Language switcher + translation application
========================================================== */
function setupLanguageSwitcher() {
  const root = document.documentElement;
  currentLang = root.getAttribute("lang") || "en";
  if (!translations[currentLang]) currentLang = "en";

  const switcher = document.getElementById("lang-switcher");
  const toggleBtn = document.getElementById("lang-toggle");
  const menu = document.getElementById("lang-menu");
  const label = document.getElementById("lang-toggle-label");
  const options = document.querySelectorAll(".lang-option");
  const mobileOptions = document.querySelectorAll(".lang-option-mobile");

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    root.setAttribute("lang", lang);
    try {
      localStorage.setItem("sp-lang", lang);
    } catch (e) {}

    if (label) label.textContent = lang.toUpperCase();
    options.forEach((opt) => {
      opt.setAttribute("aria-current", String(opt.dataset.lang === lang));
    });
    mobileOptions.forEach((opt) => {
      opt.setAttribute("aria-current", String(opt.dataset.lang === lang));
    });

    applyTranslations(lang);
    restartTypingAnimation(lang);
    renderProjectsState();
  }

  if (switcher && toggleBtn && menu) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = switcher.getAttribute("data-open") === "true";
      switcher.setAttribute("data-open", String(!isOpen));
      toggleBtn.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!switcher.contains(e.target)) {
        switcher.setAttribute("data-open", "false");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        switcher.setAttribute("data-open", "false");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      setLanguage(opt.dataset.lang);
      if (switcher) switcher.setAttribute("data-open", "false");
    });
  });

  mobileOptions.forEach((opt) => {
    opt.addEventListener("click", () => setLanguage(opt.dataset.lang));
  });

  // Apply the language already resolved by the anti-FOUC inline script
  setLanguage(currentLang);
}

/**
 * Walks the DOM applying translated strings to every element
 * carrying data-i18n / data-i18n-html / data-i18n-placeholder.
 */
function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });
}

/* ==========================================================
   Typing animation in the hero section — language aware.
   Restartable so switching languages mid-sentence looks clean.
========================================================== */
let typingState = { timeoutId: null, generation: 0 };

function restartTypingAnimation(lang) {
  const typedTextSpan = document.getElementById("typed-text");
  if (!typedTextSpan) return;

  typingState.generation += 1;
  const myGeneration = typingState.generation;
  if (typingState.timeoutId) clearTimeout(typingState.timeoutId);
  typedTextSpan.textContent = "";

  const dict = translations[lang] || translations.en;
  const textArray = dict["hero.roles"] || translations.en["hero.roles"];

  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 1600;
  let textArrayIndex = 0;
  let charIndex = 0;

  function schedule(fn, delay) {
    typingState.timeoutId = setTimeout(() => {
      if (myGeneration !== typingState.generation) return; // a newer language took over
      fn();
    }, delay);
  }

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      schedule(type, typingDelay);
    } else {
      schedule(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1,
      );
      charIndex--;
      schedule(erase, erasingDelay);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      schedule(type, typingDelay + 900);
    }
  }

  if (textArray.length) schedule(type, 500);
}

/* ==========================================================
   Hero ambient glow — a soft radial highlight that follows the
   pointer, layered above the 3D scene for extra depth.
========================================================== */
function initHeroGlow() {
  const scene = document.querySelector(".hero-scene");
  const glow = document.getElementById("hero-glow");
  if (!scene || !glow || prefersReducedMotion || isTouchDevice) return;

  scene.addEventListener("mousemove", (e) => {
    const rect = scene.getBoundingClientRect();
    const gx = ((e.clientX - rect.left) / rect.width) * 100;
    const gy = ((e.clientY - rect.top) / rect.height) * 100;
    glow.style.setProperty("--gx", `${gx}%`);
    glow.style.setProperty("--gy", `${gy}%`);
  });
}

/* ==========================================================
   Site-wide 3D scene — "programming environment" constellation
   A mouse-reactive network of nodes and signal lines, plus a
   scattering of floating code-glyph sprites ({}, </>, 01, =>,
   $, def...), rendered on a fixed full-page canvas so it keeps
   drifting behind every section, not just the hero. Falls back
   to the static gradient layers if WebGL / three.js is
   unavailable.
========================================================== */
function initSiteScene() {
  const canvas = document.getElementById("site-canvas");
  if (!canvas) return;

  if (prefersReducedMotion || typeof THREE === "undefined") {
    canvas.style.display = "none";
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
  } catch (e) {
    canvas.style.display = "none";
    return;
  }

  const scene = new THREE.Scene();
  const container = canvas.parentElement;
  let width = container.clientWidth;
  let height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
  camera.position.set(0, 0, 18);

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Node field (lighter density than before: this now sits behind
  // readable text for the whole page, not just the hero) ---
  const NODE_COUNT = isTouchDevice ? 60 : 130;
  const spread = { x: 24, y: 14, z: 10 };
  const positions = new Float32Array(NODE_COUNT * 3);
  const speeds = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread.x * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z * 2;
    speeds.push(0.05 + Math.random() * 0.1);
  }

  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x00d9c0,
    size: 0.085,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);

  // --- Connecting lines between nearby nodes ---
  const maxLineDistance = 4.2;
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x7c6fe8,
    transparent: true,
    opacity: 0.16,
  });
  const linePositions = new Float32Array(NODE_COUNT * NODE_COUNT * 6);
  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);

  const group = new THREE.Group();
  group.add(nodePoints);
  group.add(lineMesh);
  scene.add(group);

  // --- Floating code-glyph sprites: the "programming environment" motif ---
  const GLYPHS = ["{ }", "</>", "( )", "01", "=>", "$_", "def", "#!/", "01", "if()"];
  const glyphSprites = makeGlyphSprites(GLYPHS, isTouchDevice ? 16 : 30, spread);
  glyphSprites.forEach((s) => group.add(s.sprite));

  // --- Pointer interaction (parallax) ---
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener("mousemove", (e) => {
    pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateLines() {
    let vertexCount = 0;
    const posAttr = nodeGeometry.attributes.position.array;

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = posAttr[i * 3] - posAttr[j * 3];
        const dy = posAttr[i * 3 + 1] - posAttr[j * 3 + 1];
        const dz = posAttr[i * 3 + 2] - posAttr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxLineDistance) {
          linePositions[vertexCount++] = posAttr[i * 3];
          linePositions[vertexCount++] = posAttr[i * 3 + 1];
          linePositions[vertexCount++] = posAttr[i * 3 + 2];
          linePositions[vertexCount++] = posAttr[j * 3];
          linePositions[vertexCount++] = posAttr[j * 3 + 1];
          linePositions[vertexCount++] = posAttr[j * 3 + 2];
        }
      }
    }

    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions.subarray(0, vertexCount), 3),
    );
    lineGeometry.attributes.position.needsUpdate = true;
  }

  let lineUpdateCounter = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    const posAttr = nodeGeometry.attributes.position.array;
    for (let i = 0; i < NODE_COUNT; i++) {
      posAttr[i * 3 + 1] += Math.sin(elapsed * speeds[i] + i) * 0.0025;
      posAttr[i * 3] += Math.cos(elapsed * speeds[i] + i) * 0.0018;
    }
    nodeGeometry.attributes.position.needsUpdate = true;

    lineUpdateCounter++;
    if (lineUpdateCounter % 6 === 0) updateLines();

    // Drift & gently pulse the code glyphs
    glyphSprites.forEach((s) => {
      s.sprite.position.y += Math.sin(elapsed * s.speed + s.offset) * 0.0018;
      s.sprite.position.x += Math.cos(elapsed * s.speed * 0.8 + s.offset) * 0.0012;
      s.sprite.material.opacity =
        0.22 + 0.16 * Math.sin(elapsed * 0.6 + s.offset);
    });

    pointer.x += (pointer.targetX - pointer.x) * 0.04;
    pointer.y += (pointer.targetY - pointer.y) * 0.04;
    group.rotation.y = pointer.x * 0.25;
    group.rotation.x = -pointer.y * 0.15;
    camera.position.x = pointer.x * 1.2;
    camera.position.y = -pointer.y * 0.8;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  updateLines();
  animate();

  function handleResize() {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", handleResize);

  // Let the theme toggle recolor the node/line network to match the
  // active palette (cyan/violet read differently on light vs dark).
  heroSceneHandle = {
    refreshColors() {
      const styles = getComputedStyle(document.documentElement);
      const cyan = styles.getPropertyValue("--circuit-cyan").trim();
      const violet = styles.getPropertyValue("--signal-violet").trim();
      if (cyan) nodeMaterial.color.set(cyan);
      if (violet) lineMaterial.color.set(violet);
    },
  };
  heroSceneHandle.refreshColors();
}

/**
 * Builds a set of THREE.Sprite objects rendered from canvas-drawn
 * code glyphs (monospace text), scattered through the given spread.
 */
function makeGlyphSprites(glyphs, count, spread) {
  const sprites = [];
  const colors = ["#00d9c0", "#7c6fe8", "#ffb454"];

  for (let i = 0; i < count; i++) {
    const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const texture = makeGlyphTexture(glyph, color);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    const scale = 1.1 + Math.random() * 0.9;
    sprite.scale.set(scale * 1.8, scale, 1);
    sprite.position.set(
      (Math.random() - 0.5) * spread.x * 2,
      (Math.random() - 0.5) * spread.y * 2,
      (Math.random() - 0.5) * spread.z * 1.6,
    );

    sprites.push({
      sprite,
      speed: 0.1 + Math.random() * 0.15,
      offset: Math.random() * Math.PI * 2,
    });
  }

  return sprites;
}

function makeGlyphTexture(text, color) {
  const canvasEl = document.createElement("canvas");
  const size = 128;
  canvasEl.width = size * 2;
  canvasEl.height = size;
  const ctx = canvasEl.getContext("2d");
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.font = "600 44px 'JetBrains Mono', monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvasEl.width / 2, canvasEl.height / 2);

  const texture = new THREE.CanvasTexture(canvasEl);
  texture.needsUpdate = true;
  return texture;
}

/* ==========================================================
   3D Tilt Cards
========================================================== */
function initTiltCards(elements) {
  if (prefersReducedMotion || isTouchDevice) return;

  elements.forEach((card) => {
    const maxTilt = 8; // degrees

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width;
      const py = y / rect.height;

      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  });
}

/* ==========================================================
   GitHub Projects Loader
========================================================== */

async function loadGithubProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  projectsState = "loading";
  renderProjectsState();

  // GitHub's API rejects requests from a page opened directly as a local
  // file (Origin: null gets no CORS allowance), so give a clear, honest
  // message instead of a silent failure in that specific case.
  if (location.protocol === "file:") {
    projectsState = "file-protocol";
    renderProjectsState();
    return;
  }

  try {
    const response = await fetch(
      "https://api.github.com/users/SurenaProjects/repos?sort=updated&per_page=6",
    );
    if (response.status === 403) throw new Error("rate-limited");
    if (!response.ok) throw new Error("GitHub API error");

    const repos = await response.json();
    currentRepos = repos.filter((repo) => !repo.fork).slice(0, 6);
    projectsState = currentRepos.length ? "loaded" : "empty";
    renderProjectsState();
  } catch (error) {
    console.error(error);
    projectsState = "error";
    renderProjectsState();
  }
}

/**
 * Renders whatever the current project-section state is (loading,
 * loaded, empty, error, or blocked-by-file-protocol) using the active
 * language. Called both after fetching and whenever the language
 * changes, so a still-showing loading/error message is never stuck
 * in the wrong language.
 */
function renderProjectsState() {
  const container = document.getElementById("projects-container");
  if (!container) return;
  const dict = translations[currentLang] || translations.en;
  const profileUrl = "https://github.com/SurenaProjects";

  if (projectsState === "loading") {
    container.innerHTML = `
      <div class="col-span-full text-center text-gray-400 font-mono">
          ${dict["projects.fetching"]}
      </div>
    `;
    return;
  }

  if (projectsState === "file-protocol") {
    container.innerHTML = `
      <div class="col-span-full text-center text-gray-400 font-mono text-sm leading-relaxed">
          ${dict["projects.fileProtocol"]}<br />
          <a href="${profileUrl}" target="_blank" rel="noopener noreferrer"
             class="text-cyan-300 hover:underline">${profileUrl}</a>
      </div>
    `;
    return;
  }

  if (projectsState === "error") {
    container.innerHTML = `
      <div class="col-span-full text-center text-red-400 font-mono text-sm leading-relaxed">
          ${dict["projects.failed"]}<br />
          <a href="${profileUrl}" target="_blank" rel="noopener noreferrer"
             class="text-cyan-300 hover:underline">${profileUrl}</a>
      </div>
    `;
    return;
  }

  if (projectsState === "empty") {
    container.innerHTML = `
      <div class="col-span-full text-center text-gray-400 font-mono">
          ${dict["projects.none"]}
      </div>
    `;
    return;
  }

  renderProjectCards(currentRepos);
}

/**
 * Renders (or re-renders, on language change) the project cards
 * from the cached repo list — no re-fetch needed.
 */
function renderProjectCards(projects) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  const dict = translations[currentLang] || translations.en;
  container.innerHTML = "";

  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center text-gray-400 font-mono">
          ${dict["projects.none"]}
      </div>
    `;
    return;
  }

  const newCards = [];

  projects.forEach((repo) => {
    const languageColors = {
      Python: "blue",
      JavaScript: "yellow",
      Dart: "cyan",
      HTML: "orange",
      CSS: "orange",
      TypeScript: "indigo",
    };
    const color = languageColors[repo.language] || "green";

    const icons = {
      Python: "🐍",
      JavaScript: "🕹️",
      Dart: "📱",
      HTML: "🌐",
      CSS: "🎨",
    };
    const icon = icons[repo.language] || "🚀";

    const wrapper = document.createElement("div");
    wrapper.className = "tilt-wrap scroll-reveal visible";

    const card = document.createElement("div");
    card.className = `tilt-card project-card p-6 hover:shadow-${color}-400/50`;

    card.innerHTML = `
              <span class="text-4xl block mb-4">${icon}</span>

              <h3 class="text-2xl font-semibold text-${color}-400 mb-2 font-display">
                  ${repo.name}
              </h3>

              <p class="text-gray-400 mb-4 text-sm">
                  ${repo.description || dict["projects.noDescription"]}
              </p>

              <div class="flex flex-wrap gap-2 mb-4">
                  <span class="bg-${color}-900 text-${color}-300 font-mono
                               text-xs font-medium px-3 py-1 rounded-full">
                      ${repo.language || dict["projects.unknown"]}
                  </span>
              </div>

              <a href="${repo.html_url}"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="mt-4 inline-block text-sm font-mono
                        text-${color}-400 hover:underline">
                  ${dict["projects.viewLink"]}
              </a>
          `;

    wrapper.appendChild(card);
    container.appendChild(wrapper);
    newCards.push(card);
  });

  initTiltCards(newCards);
}

document.addEventListener("DOMContentLoaded", () => {
  loadGithubProjects();
});
