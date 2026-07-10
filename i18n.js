/* ==========================================================
   i18n dictionary — English / Chinese / Russian / Spanish
   Consumed by main.js. Keys ending in "Html" are injected via
   innerHTML (they contain inline <span>/<strong> highlighting);
   everything else is set via textContent for safety.
========================================================== */
const LANGS = {
  en: { label: "English", flag: "🇺🇸" },
  zh: { label: "中文", flag: "🇨🇳" },
  ru: { label: "Русский", flag: "🇷🇺" },
  es: { label: "Español", flag: "🇪🇸" },
};

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.contact": "Contact",

    "hero.greeting": "Hello! I'm",
    "hero.founder": "Founder of the",
    "hero.imA": "I'm a",
    "hero.viewProjects": "View Projects ✨",
    "hero.contactMe": "Contact Me 📞",
    "hero.roles": [
      "Python Developer.",
      "Flutter Developer.",
      "Web Developer.",
      "Linux Enthusiast.",
      "Open Source Learner.",
      "Creative Problem Solver.",
    ],

    "about.eyebrow": "about",
    "about.heading": "About Me 👋",
    "about.p1Html":
      'I am a highly curious individual with a strong passion for <span class="font-semibold text-red-400">Coding</span>, <span class="font-semibold text-yellow-400">Reading</span>, and <span class="font-semibold text-cyan-300">Bodybuilding</span>.',
    "about.p2Html":
      "In the world of technology, my main focus is on <strong>Python</strong>, <strong>Dart</strong>, and <strong>JavaScript</strong>. Besides software development, I am interested in <strong>Cryptocurrencies</strong> and <strong>Professional Logo Design</strong>, and I am always learning new concepts.",
    "about.p3Html":
      "Nowadays, I am enthusiastically working with the <strong>Linux</strong> operating system, and at the same time, I am trying to strengthen my <strong>English</strong> language skills. My goal is to build creative and high-quality solutions.",

    "skills.eyebrow": "skills",
    "skills.heading": "My Core Skills 🧠",
    "skills.python.desc": "Backend & Data Analysis",
    "skills.dart.desc": "Cross-platform Mobile Apps",
    "skills.js.desc": "Interactive Frontend Web",
    "skills.logo.title": "Logo Design",
    "skills.logo.desc": "Visual & Brand Identity",
    "skills.linux.desc": "Dev Environment & CLI",
    "skills.tailwind.desc": "Rapid & Responsive UI",
    "skills.crypto.title": "Cryptocurrency",
    "skills.crypto.desc": "Blockchain & Web3",
    "skills.problem.title": "Problem Solving",
    "skills.problem.desc": "Logical & Creative Solutions",

    "projects.eyebrow": "projects",
    "projects.heading": "Recent Projects 💻",
    "projects.fetching": "> fetching repositories...",
    "projects.none": "No public repositories found yet.",
    "projects.failed": "Failed to load GitHub projects.",
    "projects.fileProtocol":
      "GitHub's API can't be reached from a locally opened file. Once this site is hosted online, projects will load automatically — for now, see them here:",
    "projects.noDescription": "No description provided.",
    "projects.unknown": "Unknown",
    "projects.viewLink": "view_on_github() →",

    "contact.eyebrow": "contact",
    "contact.heading": "Get in Touch 📧",
    "contact.nameLabel": "Full Name",
    "contact.namePlaceholder": "E.g., John Doe",
    "contact.emailLabel": "Email Address",
    "contact.emailPlaceholder": "example@domain.com",
    "contact.messageLabel": "Your Message",
    "contact.messagePlaceholder":
      "Write your project description or question here...",
    "contact.send": "Send Message 📨",
    "contact.connect": "Or connect with me on:",

    "footer.rights": "Surena Projects. All Rights Reserved.",
  },

  zh: {
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.skills": "技能",
    "nav.projects": "项目",
    "nav.contact": "联系",

    "hero.greeting": "你好！我是",
    "hero.founder": "创始人 —",
    "hero.imA": "我是一名",
    "hero.viewProjects": "查看项目 ✨",
    "hero.contactMe": "联系我 📞",
    "hero.roles": [
      "Python 开发者。",
      "Flutter 开发者。",
      "网页开发者。",
      "Linux 爱好者。",
      "开源学习者。",
      "富有创造力的问题解决者。",
    ],

    "about.eyebrow": "关于",
    "about.heading": "关于我 👋",
    "about.p1Html":
      '我是一个极具好奇心的人，对<span class="font-semibold text-red-400">编程</span>、<span class="font-semibold text-yellow-400">阅读</span>和<span class="font-semibold text-cyan-300">健身</span>充满热情。',
    "about.p2Html":
      "在技术领域，我主要专注于 <strong>Python</strong>、<strong>Dart</strong> 和 <strong>JavaScript</strong>。除了软件开发，我对<strong>加密货币</strong>和<strong>专业标志设计</strong>也很感兴趣，并一直在学习新的知识。",
    "about.p3Html":
      "目前，我正热情地使用 <strong>Linux</strong> 操作系统，同时也在努力提升我的<strong>英语</strong>水平。我的目标是打造富有创意且高质量的解决方案。",

    "skills.eyebrow": "技能",
    "skills.heading": "核心技能 🧠",
    "skills.python.desc": "后端与数据分析",
    "skills.dart.desc": "跨平台移动应用",
    "skills.js.desc": "交互式前端网页",
    "skills.logo.title": "标志设计",
    "skills.logo.desc": "视觉与品牌形象",
    "skills.linux.desc": "开发环境与命令行",
    "skills.tailwind.desc": "快速响应式界面",
    "skills.crypto.title": "加密货币",
    "skills.crypto.desc": "区块链与 Web3",
    "skills.problem.title": "问题解决",
    "skills.problem.desc": "逻辑与创造性方案",

    "projects.eyebrow": "项目",
    "projects.heading": "近期项目 💻",
    "projects.fetching": "> 正在获取仓库...",
    "projects.none": "暂无公开仓库。",
    "projects.failed": "加载 GitHub 项目失败。",
    "projects.fileProtocol":
      "以本地文件方式打开时无法访问 GitHub API。网站上线后项目会自动加载 —— 现在可以在这里查看：",
    "projects.noDescription": "暂无描述。",
    "projects.unknown": "未知",
    "projects.viewLink": "view_on_github() →",

    "contact.eyebrow": "联系",
    "contact.heading": "取得联系 📧",
    "contact.nameLabel": "姓名",
    "contact.namePlaceholder": "例如：张三",
    "contact.emailLabel": "电子邮箱",
    "contact.emailPlaceholder": "example@domain.com",
    "contact.messageLabel": "留言内容",
    "contact.messagePlaceholder": "请在此描述您的项目或问题……",
    "contact.send": "发送消息 📨",
    "contact.connect": "或通过以下方式联系我：",

    "footer.rights": "Surena Projects。保留所有权利。",
  },

  ru: {
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.skills": "Навыки",
    "nav.projects": "Проекты",
    "nav.contact": "Контакты",

    "hero.greeting": "Привет! Я",
    "hero.founder": "Основатель",
    "hero.imA": "Я —",
    "hero.viewProjects": "Смотреть проекты ✨",
    "hero.contactMe": "Связаться со мной 📞",
    "hero.roles": [
      "Python-разработчик.",
      "Flutter-разработчик.",
      "Веб-разработчик.",
      "Энтузиаст Linux.",
      "Изучаю Open Source.",
      "Творческий специалист по решению задач.",
    ],

    "about.eyebrow": "обо мне",
    "about.heading": "Обо мне 👋",
    "about.p1Html":
      'Я очень любознательный человек с сильной страстью к <span class="font-semibold text-red-400">программированию</span>, <span class="font-semibold text-yellow-400">чтению</span> и <span class="font-semibold text-cyan-300">бодибилдингу</span>.',
    "about.p2Html":
      "В сфере технологий я в основном специализируюсь на <strong>Python</strong>, <strong>Dart</strong> и <strong>JavaScript</strong>. Помимо разработки ПО, меня интересуют <strong>криптовалюты</strong> и <strong>профессиональный дизайн логотипов</strong>, и я постоянно изучаю новые концепции.",
    "about.p3Html":
      "Сейчас я с увлечением работаю с операционной системой <strong>Linux</strong>, а также стараюсь улучшить свой <strong>английский</strong> язык. Моя цель — создавать креативные и качественные решения.",

    "skills.eyebrow": "навыки",
    "skills.heading": "Ключевые навыки 🧠",
    "skills.python.desc": "Бэкенд и анализ данных",
    "skills.dart.desc": "Кроссплатформенные приложения",
    "skills.js.desc": "Интерактивный фронтенд",
    "skills.logo.title": "Дизайн логотипов",
    "skills.logo.desc": "Визуальный стиль и бренд",
    "skills.linux.desc": "Среда разработки и CLI",
    "skills.tailwind.desc": "Быстрый адаптивный интерфейс",
    "skills.crypto.title": "Криптовалюта",
    "skills.crypto.desc": "Блокчейн и Web3",
    "skills.problem.title": "Решение задач",
    "skills.problem.desc": "Логические и творческие решения",

    "projects.eyebrow": "проекты",
    "projects.heading": "Последние проекты 💻",
    "projects.fetching": "> загрузка репозиториев...",
    "projects.none": "Публичные репозитории пока не найдены.",
    "projects.failed": "Не удалось загрузить проекты GitHub.",
    "projects.fileProtocol":
      "API GitHub недоступен при открытии файла локально. После публикации сайта проекты будут загружаться автоматически — а пока их можно посмотреть здесь:",
    "projects.noDescription": "Описание отсутствует.",
    "projects.unknown": "Неизвестно",
    "projects.viewLink": "view_on_github() →",

    "contact.eyebrow": "контакты",
    "contact.heading": "Связаться со мной 📧",
    "contact.nameLabel": "Полное имя",
    "contact.namePlaceholder": "Например, Иван Иванов",
    "contact.emailLabel": "Электронная почта",
    "contact.emailPlaceholder": "example@domain.com",
    "contact.messageLabel": "Ваше сообщение",
    "contact.messagePlaceholder": "Опишите здесь ваш проект или вопрос...",
    "contact.send": "Отправить сообщение 📨",
    "contact.connect": "Или свяжитесь со мной здесь:",

    "footer.rights": "Surena Projects. Все права защищены.",
  },

  es: {
    "nav.home": "Inicio",
    "nav.about": "Sobre mí",
    "nav.skills": "Habilidades",
    "nav.projects": "Proyectos",
    "nav.contact": "Contacto",

    "hero.greeting": "¡Hola! Soy",
    "hero.founder": "Fundador de",
    "hero.imA": "Soy",
    "hero.viewProjects": "Ver Proyectos ✨",
    "hero.contactMe": "Contáctame 📞",
    "hero.roles": [
      "Desarrollador Python.",
      "Desarrollador Flutter.",
      "Desarrollador Web.",
      "Entusiasta de Linux.",
      "Aprendiz de Código Abierto.",
      "Solucionador de Problemas Creativo.",
    ],

    "about.eyebrow": "sobre mí",
    "about.heading": "Sobre Mí 👋",
    "about.p1Html":
      'Soy una persona muy curiosa con una gran pasión por la <span class="font-semibold text-red-400">programación</span>, la <span class="font-semibold text-yellow-400">lectura</span> y el <span class="font-semibold text-cyan-300">culturismo</span>.',
    "about.p2Html":
      "En el mundo de la tecnología, mi enfoque principal está en <strong>Python</strong>, <strong>Dart</strong> y <strong>JavaScript</strong>. Además del desarrollo de software, me interesan las <strong>criptomonedas</strong> y el <strong>diseño profesional de logotipos</strong>, y siempre estoy aprendiendo nuevos conceptos.",
    "about.p3Html":
      "Actualmente trabajo con entusiasmo con el sistema operativo <strong>Linux</strong>, mientras también me esfuerzo por mejorar mi nivel de <strong>inglés</strong>. Mi objetivo es construir soluciones creativas y de alta calidad.",

    "skills.eyebrow": "habilidades",
    "skills.heading": "Habilidades Principales 🧠",
    "skills.python.desc": "Backend y análisis de datos",
    "skills.dart.desc": "Apps móviles multiplataforma",
    "skills.js.desc": "Frontend web interactivo",
    "skills.logo.title": "Diseño de Logotipos",
    "skills.logo.desc": "Identidad visual y de marca",
    "skills.linux.desc": "Entorno de desarrollo y CLI",
    "skills.tailwind.desc": "UI rápida y responsiva",
    "skills.crypto.title": "Criptomonedas",
    "skills.crypto.desc": "Blockchain y Web3",
    "skills.problem.title": "Resolución de Problemas",
    "skills.problem.desc": "Soluciones lógicas y creativas",

    "projects.eyebrow": "proyectos",
    "projects.heading": "Proyectos Recientes 💻",
    "projects.fetching": "> obteniendo repositorios...",
    "projects.none": "Aún no se encontraron repositorios públicos.",
    "projects.failed": "Error al cargar los proyectos de GitHub.",
    "projects.fileProtocol":
      "La API de GitHub no es accesible al abrir el archivo localmente. Una vez publicado el sitio, los proyectos se cargarán automáticamente. Por ahora, míralos aquí:",
    "projects.noDescription": "Sin descripción disponible.",
    "projects.unknown": "Desconocido",
    "projects.viewLink": "view_on_github() →",

    "contact.eyebrow": "contacto",
    "contact.heading": "Ponte en Contacto 📧",
    "contact.nameLabel": "Nombre Completo",
    "contact.namePlaceholder": "Ej., Juan Pérez",
    "contact.emailLabel": "Correo Electrónico",
    "contact.emailPlaceholder": "ejemplo@dominio.com",
    "contact.messageLabel": "Tu Mensaje",
    "contact.messagePlaceholder":
      "Escribe la descripción de tu proyecto o pregunta aquí...",
    "contact.send": "Enviar Mensaje 📨",
    "contact.connect": "O conéctate conmigo en:",

    "footer.rights": "Surena Projects. Todos los derechos reservados.",
  },
};
