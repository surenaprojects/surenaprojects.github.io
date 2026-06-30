// --- JavaScript for UI Interactivity, Animations, and Performance ---

// Using an IIFE (Immediately Invoked Function Expression) to avoid polluting the global scope
(function () {
  /**
   * Handles all initializations after the DOM is fully loaded.
   */
  const initialize = () => {
    setupMobileMenu();
    initializeScrollReveal();
    initializeTypingAnimation();
    setupBackToTopButton();
    updateCopyrightYear();
    smoothScrollForAnchorLinks();
  };

  /**
   * Sets up the mobile menu toggle functionality.
   */
  function setupMobileMenu() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (!mobileMenuButton || !mobileMenu) return;

    // Toggle menu on button click
    mobileMenuButton.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("show");
    });

    // Close menu when a link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /**
   * Initializes the scroll reveal animation effect for elements
   * using the Intersection Observer API for optimal performance.
   */
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
      {
        threshold: 0.1,
      },
    );

    elementsToReveal.forEach((element) => {
      observer.observe(element);
    });
  }

  /**
   * NEW: Initializes the typing animation in the hero section.
   */
  function initializeTypingAnimation() {
    const typedTextSpan = document.getElementById("typed-text");
    if (!typedTextSpan) return;

    const textArray = [
      "Python Developer.",
      "Flutter Specialist.",
      "Multi-Disciplinary Developer.",
      "Creative Problem Solver.",
    ];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent +=
          textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(
          0,
          charIndex - 1,
        );
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }

    // Start typing right after load
    if (textArray.length) setTimeout(type, newTextDelay + 250);
  }

  /**
   * NEW: Sets up the "Back to Top" button functionality.
   */
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
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /**
   * NEW: Automatically updates the copyright year in the footer.
   */
  function updateCopyrightYear() {
    const yearSpan = document.getElementById("copyright-year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  /**
   * NEW: Provides a consistent smooth scroll for all anchor links.
   */
  function smoothScrollForAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener("DOMContentLoaded", initialize);
})();
/* ==========================================================
   GitHub Projects Loader
========================================================== */

async function loadGithubProjects() {
  const container = document.getElementById("projects-container");

  if (!container) return;

  container.innerHTML = `
        <div class="col-span-full text-center text-gray-400">
            Loading projects...
        </div>
    `;

  try {
    const response = await fetch(
      "https://api.github.com/users/SurenaProjects/repos?sort=updated&per_page=6",
    );

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await response.json();

    const projects = repos.filter((repo) => !repo.fork).slice(0, 6);

    container.innerHTML = "";

    projects.forEach((repo, index) => {
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

      const card = document.createElement("div");

      card.className = `scroll-reveal bg-gray-800/80 backdrop-blur-sm
                 rounded-2xl overflow-hidden shadow-2xl
                 transition duration-500
                 hover:shadow-${color}-400/50
                 transform hover:-translate-y-1`;

      card.innerHTML = `
                <div class="p-6">

                    <span class="text-4xl block mb-4">
                        ${icon}
                    </span>

                    <h3 class="text-2xl font-semibold text-${color}-400 mb-2">
                        ${repo.name}
                    </h3>

                    <p class="text-gray-400 mb-4 text-sm">
                        ${repo.description || "No description provided."}
                    </p>

                    <div class="flex flex-wrap gap-2 mb-4">

                        <span class="bg-${color}-900 text-${color}-300
                                     text-xs font-medium px-3 py-1 rounded-full">

                            ${repo.language || "Unknown"}

                        </span>

                    </div>

                    <a href="${repo.html_url}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="mt-4 inline-block text-sm
                              text-${color}-400 hover:underline">

                        View on GitHub →

                    </a>

                </div>
            `;

      container.appendChild(card);
    });

    revealNewProjectCards();
  } catch (error) {
    console.error(error);

    container.innerHTML = `
            <div class="col-span-full text-center text-red-400">
                Failed to load GitHub projects.
            </div>
        `;
  }
}

/* ==========================================================
   Reveal newly created cards
========================================================== */

function revealNewProjectCards() {
  const cards = document.querySelectorAll("#projects-container .scroll-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  cards.forEach((card) => observer.observe(card));
}

/* ==========================================================
   Start loading projects
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  loadGithubProjects();
});
