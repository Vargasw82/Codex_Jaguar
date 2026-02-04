const DEFAULT_CONTENT = {
  organizationName: "Mexico Salvando al Jaguar",
  organizationFullName: "Asociacion Nacional para la Conservacion del Jaguar",
  gofundmeUrl: "https://www.gofundme.com/f/placeholder-salvando-al-jaguar",
  assets: {
    logo: "assets/images/logo-oro.png",
    heroDesktop: "assets/images/hero-desktop.jpg",
    heroMobile: "assets/images/hero-mobile.jpg",
    heroVideo: "",
  },
  hero: {
    headline: "El jaguar representa a Mexico. Mexico debe protegerlo.",
    subheadline:
      "En 2026, el mundo vera al jaguar como nuestro simbolo. Hagamos que tenga un hogar al cual volver.",
    microcopy: "100% deducible de impuestos | Cualquier monto ayuda",
  },
  problem: {
    remainingJaguars: 5300,
    threatText: "Su habitat desaparece cada ano.",
    populationIncrease: "+30%",
    populationYears: "14 anos",
    solutionText: "La ciencia mexicana esta ganando, pero necesita tu apoyo para terminar.",
  },
  impactTiers: [
    { amount: 100, detail: "1 dia de monitoreo satelital" },
    { amount: 250, detail: "1 camara trampa instalada" },
    { amount: 500, detail: "1 semana de patrulla anti-caza" },
    { amount: 1000, detail: "1 mes de proteccion de habitat" },
  ],
  socialProof: {
    donors: 2347,
    raised: 847500,
    goal: 1000000,
    allies: ["TV Azteca", "ADN40", "UNAM", "Alianzas ESG"],
    testimonials: [
      {
        quote: "Mi hijo de 8 anos dono su domingo. El jaguar ahora es su animal favorito.",
        author: "Maria G., CDMX",
      },
      {
        quote: "Como empresa, era obvio. El jaguar es Mexico.",
        author: "Director de RSE, Empresa Aliada",
      },
      {
        quote: "Finalmente algo concreto que podemos hacer.",
        author: "Carlos R., Monterrey",
      },
    ],
  },
  transparency: {
    reportUrl: "legal/reporte.html",
    distribution: [
      { label: "Proteccion de habitat", percent: 40, color: "#63d586" },
      { label: "Monitoreo y tecnologia", percent: 25, color: "#5cb8ff" },
      { label: "Comunidades rurales", percent: 20, color: "#ead35a" },
      { label: "Investigacion cientifica", percent: 15, color: "#f59a48" },
    ],
    seals: [
      "Respaldado por la UNAM",
      "100% deducible de impuestos",
      "+20 anos de resultados comprobados",
    ],
  },
  finalCta: {
    headline: "El mundial es en 4 meses. El jaguar no puede esperar.",
  },
  contact: {
    email: "contacto@salvandoaljaguarmx.org",
    privacyUrl: "legal/privacidad.html",
    termsUrl: "legal/terminos.html",
    updatesUrl: "mailto:contacto@salvandoaljaguarmx.org?subject=Quiero%20recibir%20updates",
  },
};

const ids = {
  topbar: document.getElementById("topbar"),
  brandLogo: document.getElementById("brandLogo"),
  footerLogo: document.getElementById("footerLogo"),
  orgNameHeader: document.getElementById("orgNameHeader"),
  orgNameFooter: document.getElementById("orgNameFooter"),
  heroImage: document.getElementById("heroImage"),
  heroPicture: document.getElementById("heroPicture"),
  heroVideo: document.getElementById("heroVideo"),
  heroHeadline: document.getElementById("heroHeadline"),
  heroSubheadline: document.getElementById("heroSubheadline"),
  heroMicrocopy: document.getElementById("heroMicrocopy"),
  remainingJaguars: document.getElementById("remainingJaguars"),
  problemText: document.getElementById("problemText"),
  populationIncrease: document.getElementById("populationIncrease"),
  populationYears: document.getElementById("populationYears"),
  solutionText: document.getElementById("solutionText"),
  impactGrid: document.getElementById("impactGrid"),
  counterDonors: document.getElementById("counterDonors"),
  counterRaised: document.getElementById("counterRaised"),
  fundraisingGoal: document.getElementById("fundraisingGoal"),
  fundraisingFill: document.getElementById("fundraisingFill"),
  allyGrid: document.getElementById("allyGrid"),
  testimonialQuote: document.getElementById("testimonialQuote"),
  testimonialAuthor: document.getElementById("testimonialAuthor"),
  budgetChart: document.getElementById("budgetChart"),
  trustSeals: document.getElementById("trustSeals"),
  reportLink: document.getElementById("reportLink"),
  finalHeadline: document.getElementById("finalHeadline"),
  contactEmail: document.getElementById("contactEmail"),
  privacyLink: document.getElementById("privacyLink"),
  termsLink: document.getElementById("termsLink"),
  shareButton: document.getElementById("shareButton"),
  updatesButton: document.getElementById("updatesButton"),
};

const scrollMarks = [25, 50, 75, 100];
const sentScrollMarks = new Set();
let revealObserver;
let testimonialTimer;
let socialAnimated = false;

function formatNumber(value) {
  return new Intl.NumberFormat("es-MX").format(Number(value) || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function deepMerge(target, source) {
  if (!source || typeof source !== "object") return target;
  const merged = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = merged[key];
    const sourceValue = source[key];

    if (Array.isArray(sourceValue)) {
      merged[key] = [...sourceValue];
      continue;
    }

    if (
      targetValue &&
      sourceValue &&
      typeof targetValue === "object" &&
      typeof sourceValue === "object"
    ) {
      merged[key] = deepMerge(targetValue, sourceValue);
      continue;
    }

    merged[key] = sourceValue;
  }

  return merged;
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function track(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ts: Date.now(),
    ...payload,
  });
}

async function loadContent() {
  try {
    const response = await fetch("content/site.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const userContent = await response.json();
    return deepMerge(DEFAULT_CONTENT, userContent);
  } catch {
    return DEFAULT_CONTENT;
  }
}

function applyBrand(content) {
  const logo = content.assets?.logo || DEFAULT_CONTENT.assets.logo;
  if (ids.brandLogo) ids.brandLogo.src = logo;
  if (ids.footerLogo) ids.footerLogo.src = logo;

  if (ids.orgNameHeader) ids.orgNameHeader.textContent = content.organizationName;
  if (ids.orgNameFooter) ids.orgNameFooter.textContent = content.organizationFullName;
}

function applyHero(content) {
  if (ids.heroHeadline) ids.heroHeadline.textContent = content.hero.headline;
  if (ids.heroSubheadline) ids.heroSubheadline.textContent = content.hero.subheadline;
  if (ids.heroMicrocopy) ids.heroMicrocopy.textContent = content.hero.microcopy;

  if (ids.heroImage) ids.heroImage.src = content.assets.heroDesktop || DEFAULT_CONTENT.assets.heroDesktop;
  const source = ids.heroPicture?.querySelector("source");
  if (source) {
    source.srcset = content.assets.heroMobile || DEFAULT_CONTENT.assets.heroMobile;
  }

  const videoSrc = content.assets.heroVideo;
  if (videoSrc && ids.heroVideo && ids.heroPicture) {
    ids.heroVideo.src = videoSrc;
    ids.heroVideo.hidden = false;
    ids.heroPicture.hidden = true;
  }
}

function applyProblem(content) {
  if (ids.remainingJaguars) ids.remainingJaguars.textContent = formatNumber(content.problem.remainingJaguars);
  if (ids.problemText) ids.problemText.textContent = content.problem.threatText;
  if (ids.populationIncrease) ids.populationIncrease.textContent = content.problem.populationIncrease;
  if (ids.populationYears) ids.populationYears.textContent = content.problem.populationYears;
  if (ids.solutionText) ids.solutionText.textContent = content.problem.solutionText;
}

function renderImpactCards(content) {
  if (!ids.impactGrid) return;
  ids.impactGrid.innerHTML = "";

  content.impactTiers.forEach((tier) => {
    const card = document.createElement("article");
    card.className = "impact-card";
    card.setAttribute("data-reveal", "");

    const amount = document.createElement("p");
    amount.className = "amount";
    amount.textContent = formatCurrency(tier.amount);

    const detail = document.createElement("p");
    detail.className = "impact-detail";
    detail.textContent = tier.detail;

    const cta = document.createElement("a");
    cta.className = "btn btn-donate";
    cta.setAttribute("data-donate-link", "");
    cta.setAttribute("data-cta-context", `tier_${tier.amount}`);
    cta.href = "#";
    cta.textContent = "DONAR";

    card.append(amount, detail, cta);
    ids.impactGrid.append(card);
  });
}

function renderSocial(content) {
  if (ids.counterDonors) ids.counterDonors.dataset.target = String(content.socialProof.donors);
  if (ids.counterRaised) ids.counterRaised.dataset.target = String(content.socialProof.raised);
  if (ids.fundraisingGoal) ids.fundraisingGoal.textContent = formatCurrency(content.socialProof.goal);

  if (ids.allyGrid) {
    ids.allyGrid.innerHTML = "";
    content.socialProof.allies.forEach((ally) => {
      const chip = document.createElement("div");
      chip.className = "ally-chip";
      chip.textContent = ally;
      ids.allyGrid.append(chip);
    });
  }

  startTestimonialRotation(content.socialProof.testimonials);
}

function renderTransparency(content) {
  if (ids.budgetChart) {
    ids.budgetChart.innerHTML = "";
    content.transparency.distribution.forEach((item) => {
      const row = document.createElement("article");
      row.className = "budget-row";
      row.setAttribute("data-reveal", "");

      const label = document.createElement("div");
      label.className = "budget-label";
      const name = document.createElement("span");
      name.textContent = item.label;
      const value = document.createElement("span");
      value.textContent = `${item.percent}%`;
      label.append(name, value);

      const meter = document.createElement("div");
      meter.className = "budget-meter";
      const fill = document.createElement("span");
      fill.style.background = item.color;
      fill.style.width = "0%";
      fill.dataset.target = String(item.percent);
      meter.append(fill);

      row.append(label, meter);
      ids.budgetChart.append(row);
    });
  }

  if (ids.reportLink) ids.reportLink.href = content.transparency.reportUrl;

  if (ids.trustSeals) {
    ids.trustSeals.innerHTML = "";
    content.transparency.seals.forEach((seal) => {
      const li = document.createElement("li");
      li.textContent = `✓ ${seal}`;
      ids.trustSeals.append(li);
    });
  }
}

function applyFinal(content) {
  if (ids.finalHeadline) ids.finalHeadline.textContent = content.finalCta.headline;

  if (ids.contactEmail) {
    ids.contactEmail.href = `mailto:${content.contact.email}`;
    ids.contactEmail.textContent = content.contact.email;
  }
  if (ids.privacyLink) ids.privacyLink.href = content.contact.privacyUrl;
  if (ids.termsLink) ids.termsLink.href = content.contact.termsUrl;

  if (ids.updatesButton) {
    ids.updatesButton.addEventListener("click", () => {
      track("updates_click");
      const target = content.contact.updatesUrl || `mailto:${content.contact.email}`;
      if (target.startsWith("mailto:")) {
        window.location.href = target;
      } else {
        window.open(target, "_blank", "noopener,noreferrer");
      }
    });
  }

  if (ids.shareButton) {
    ids.shareButton.addEventListener("click", async () => {
      const shareData = {
        title: document.title,
        text: "Dona para proteger al jaguar en Mexico.",
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          track("share_click", { mode: "native" });
          return;
        }

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copiado para compartir.");
          track("share_click", { mode: "clipboard" });
          return;
        }

        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`, "_blank");
        track("share_click", { mode: "fallback" });
      } catch {
        track("share_click", { mode: "error" });
      }
    });
  }
}

function applyDonateLinks(content) {
  const safeUrl = isValidHttpUrl(content.gofundmeUrl)
    ? content.gofundmeUrl
    : DEFAULT_CONTENT.gofundmeUrl;

  document.querySelectorAll("[data-donate-link]").forEach((node) => {
    node.setAttribute("href", safeUrl);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
    node.setAttribute("aria-label", "Abrir pagina de donacion en GoFundMe");
    node.addEventListener("click", () => {
      track("cta_click", { context: node.dataset.ctaContext || "unknown" });
      track("donation_start", { destination: "gofundme" });
    });
  });
}

function setupTopbarScroll() {
  if (!ids.topbar) return;
  const onScroll = () => {
    ids.topbar.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  observeReveals();
}

function observeReveals() {
  if (!revealObserver) return;
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (!el.classList.contains("visible")) {
      revealObserver.observe(el);
    }
  });
}

function animateCounter(node, target, isCurrency = false) {
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const value = Math.round(target * progress);
    node.textContent = isCurrency ? formatCurrency(value) : formatNumber(value);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function animateSocialCounters(content) {
  if (socialAnimated) return;
  socialAnimated = true;

  const raised = Number(content.socialProof.raised) || 0;
  const goal = Math.max(1, Number(content.socialProof.goal) || 1);
  const percent = Math.min(100, (raised / goal) * 100);

  if (ids.counterDonors) animateCounter(ids.counterDonors, Number(content.socialProof.donors) || 0, false);
  if (ids.counterRaised) animateCounter(ids.counterRaised, raised, true);
  if (ids.fundraisingFill) ids.fundraisingFill.style.width = `${percent}%`;
}

function setupSocialObserver(content) {
  const section = document.getElementById("prueba-social");
  if (!section || !("IntersectionObserver" in window)) {
    animateSocialCounters(content);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateSocialCounters(content);
        observer.disconnect();
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
}

function startTestimonialRotation(testimonials) {
  if (!ids.testimonialQuote || !ids.testimonialAuthor || !Array.isArray(testimonials) || testimonials.length === 0) {
    return;
  }

  if (testimonialTimer) {
    clearInterval(testimonialTimer);
  }

  let index = 0;
  const paint = () => {
    const item = testimonials[index % testimonials.length];
    ids.testimonialQuote.textContent = `"${item.quote}"`;
    ids.testimonialAuthor.textContent = item.author;
    index += 1;
  };

  paint();
  if (testimonials.length > 1) {
    testimonialTimer = setInterval(paint, 6500);
  }
}

function setupScrollTracking() {
  const computeDepth = () => {
    const doc = document.documentElement;
    const track = Math.max(1, doc.scrollHeight - window.innerHeight);
    return Math.round((window.scrollY / track) * 100);
  };

  const onScroll = () => {
    const depth = computeDepth();
    scrollMarks.forEach((mark) => {
      if (depth >= mark && !sentScrollMarks.has(mark)) {
        sentScrollMarks.add(mark);
        track("scroll_depth", { percent: mark });
      }
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function trackPageView() {
  track("page_view", {
    path: `${window.location.pathname}${window.location.search}`,
    title: document.title,
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("donation") === "complete") {
    track("donation_complete", { source: "query_param" });
  }
}

async function init() {
  const content = await loadContent();

  applyBrand(content);
  applyHero(content);
  applyProblem(content);
  renderImpactCards(content);
  renderSocial(content);
  renderTransparency(content);
  applyFinal(content);
  applyDonateLinks(content);
  setupTopbarScroll();
  setupRevealObserver();
  observeReveals();
  setupSocialObserver(content);
  setupScrollTracking();
  trackPageView();
}

init();
