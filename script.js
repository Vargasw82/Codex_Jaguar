const FALLBACK_DATA = {
  organizationName: "Asociación Salvando al Jaguar",
  gofundmeUrl: "https://www.gofundme.com/f/placeholder-salvando-al-jaguar",
  hero: {
    title: "El jaguar no puede esperar.",
    subtitle:
      "Tu donativo impulsa monitoreo de fauna, defensa del hábitat y acciones con comunidades locales.",
  },
  stats: [
    { value: "[###]", label: "Hectáreas protegidas" },
    { value: "[###]", label: "Jaguares monitoreados" },
    { value: "[###]", label: "Comunidades aliadas" },
    { value: "[###]", label: "Años de trabajo continuo" },
  ],
  pillars: [
    {
      icon: "assets/icons/Rastreo.png",
      title: "Monitoreo y Rastreo",
      description: "Seguimiento en campo para entender rutas, amenazas y zonas prioritarias.",
    },
    {
      icon: "assets/icons/Arbol.png",
      title: "Protección de Hábitat",
      description: "Acciones directas para conservar corredores biológicos y ecosistemas clave.",
    },
    {
      icon: "assets/icons/Cultural.png",
      title: "Educación y Comunidad",
      description: "Programas de sensibilización y colaboración con comunidades locales.",
    },
  ],
  trust: {
    quote:
      "Cada donación sostiene trabajo de conservación verificable, con trazabilidad en cada etapa.",
    author: "Equipo Salvando al Jaguar",
    role: "Coordinación de Conservación",
  },
};

const ids = {
  orgHeader: document.getElementById("orgNameHeader"),
  orgFooter: document.getElementById("orgNameFooter"),
  orgFooterCopy: document.getElementById("orgNameFooterCopy"),
  heroTitle: document.getElementById("heroTitle"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  trustQuote: document.getElementById("trustQuote"),
  trustAuthor: document.getElementById("trustAuthor"),
  trustRole: document.getElementById("trustRole"),
  statsGrid: document.getElementById("statsGrid"),
  pillarsGrid: document.getElementById("pillarsGrid"),
  secureNote: document.getElementById("secureNote"),
  year: document.getElementById("year"),
  siteHeader: document.getElementById("siteHeader"),
};

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function loadSiteData() {
  try {
    const response = await fetch("content/site.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { ...FALLBACK_DATA, ...data };
  } catch {
    return FALLBACK_DATA;
  }
}

function applyOrganizationName(name) {
  if (!name) return;
  if (ids.orgHeader) ids.orgHeader.textContent = name;
  if (ids.orgFooter) ids.orgFooter.textContent = name;
  if (ids.orgFooterCopy) ids.orgFooterCopy.textContent = name;
}

function applyHero(hero = {}) {
  if (hero.title && ids.heroTitle) ids.heroTitle.textContent = hero.title;
  if (hero.subtitle && ids.heroSubtitle) ids.heroSubtitle.textContent = hero.subtitle;
}

function renderStats(stats = []) {
  if (!ids.statsGrid) return;
  ids.statsGrid.innerHTML = "";
  stats.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "stat-card";
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--delay", `${100 + index * 90}ms`);

    const value = document.createElement("p");
    value.className = "stat-value";
    value.textContent = item.value || "[###]";

    const label = document.createElement("p");
    label.className = "stat-label";
    label.textContent = item.label || "Métrica";

    card.append(value, label);
    ids.statsGrid.append(card);
  });
}

function renderPillars(pillars = []) {
  if (!ids.pillarsGrid) return;
  ids.pillarsGrid.innerHTML = "";
  pillars.forEach((pillar, index) => {
    const card = document.createElement("article");
    card.className = "pillar-card";
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--delay", `${100 + index * 110}ms`);

    const icon = document.createElement("img");
    icon.src = pillar.icon || "assets/icons/Arbol.png";
    icon.alt = `Icono de ${pillar.title || "pilar de conservación"}`;
    icon.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = pillar.title || "Pilar";

    const description = document.createElement("p");
    description.textContent = pillar.description || "";

    card.append(icon, title, description);
    ids.pillarsGrid.append(card);
  });
}

function applyTrust(trust = {}) {
  if (trust.quote && ids.trustQuote) ids.trustQuote.textContent = `“${trust.quote}”`;
  if (trust.author && ids.trustAuthor) ids.trustAuthor.textContent = trust.author;
  if (trust.role && ids.trustRole) ids.trustRole.textContent = trust.role;
}

function applyDonateLinks(url) {
  const safeUrl = isValidHttpUrl(url) ? url : FALLBACK_DATA.gofundmeUrl;
  document.querySelectorAll("[data-donate-link]").forEach((anchor) => {
    anchor.setAttribute("href", safeUrl);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
    anchor.setAttribute("aria-label", "Abrir página de donación en GoFundMe");
  });

  if (!ids.secureNote) return;
  try {
    const host = new URL(safeUrl).hostname.replace("www.", "");
    ids.secureNote.textContent = `Redirección segura a ${host}`;
  } catch {
    ids.secureNote.textContent = "Redirección segura a GoFundMe";
  }
}

function setupHeaderScroll() {
  if (!ids.siteHeader) return;
  const onScroll = () => {
    ids.siteHeader.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupRevealAnimations() {
  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

async function init() {
  const content = await loadSiteData();
  applyOrganizationName(content.organizationName);
  applyHero(content.hero);
  renderStats(content.stats);
  renderPillars(content.pillars);
  applyTrust(content.trust);
  applyDonateLinks(content.gofundmeUrl);
  setupHeaderScroll();
  setupRevealAnimations();

  if (ids.year) ids.year.textContent = String(new Date().getFullYear());
}

init();
