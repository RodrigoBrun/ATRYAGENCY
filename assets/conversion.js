
(() => {
  function initIntro() {
    if (sessionStorage.getItem("atry-intro-seen")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intro = document.createElement("div");
    intro.className = "site-intro";
    intro.innerHTML = `
      <div class="site-intro__mark">
        <span></span><span></span>
        <strong>ATRY</strong>
      </div>
    `;
    document.body.appendChild(intro);
    document.body.classList.add("site-intro-active");

    setTimeout(() => intro.classList.add("is-leaving"), 720);
    setTimeout(() => {
      intro.remove();
      document.body.classList.remove("site-intro-active");
    }, 1200);

    sessionStorage.setItem("atry-intro-seen", "true");
  }

  function initFaq() {
    document.querySelectorAll("[data-faq] article").forEach(article => {
      const button = article.querySelector("button");
      const content = article.querySelector("div");
      if (!button || !content) return;

      button.addEventListener("click", () => {
        const open = article.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initContactMethods() {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    const phone = form.querySelector(".contact-phone");
    form.querySelectorAll('[name="reply_method"]').forEach(input => {
      input.addEventListener("change", () => {
        const wantsWhatsApp =
          form.querySelector('[name="reply_method"]:checked')?.value === "whatsapp";
        if (phone) phone.hidden = !wantsWhatsApp;
        phone?.querySelector("input")?.toggleAttribute("required", wantsWhatsApp);
      });
    });
  }

  function initWhatsApp() {
    const number = window.ATRY_CONFIG?.whatsappNumber?.replace(/\D/g, "");
    document.querySelectorAll("[data-whatsapp]").forEach(link => {
      if (!number) {
        link.hidden = true;
        return;
      }
      const message = encodeURIComponent(
        link.dataset.message ||
        "Hola, estuve viendo la web de ATRY y me gustaría conversar sobre un proyecto."
      );
      link.href = `https://wa.me/${number}?text=${message}`;
    });
  }

  function initAnalyticsHooks() {
    document.addEventListener("click", event => {
      const target = event.target.closest("[data-track], .pill-button, .project-open");
      if (!target) return;

      const detail = {
        event: target.dataset.track || "interaction",
        label: target.textContent.trim().replace(/\s+/g, " ").slice(0, 120),
        path: location.pathname
      };

      window.dispatchEvent(new CustomEvent("atry:track", {detail}));

      if (window.ATRY_CONFIG?.analyticsEnabled) {
        console.info("[ATRY analytics hook]", detail);
      }
    });
  }

  function initCaseStudyEnhancement() {
    // Dynamic modal content from script.js gets enriched after opening.
    const modal = document.querySelector("#project-modal");
    if (!modal) return;

    const observer = new MutationObserver(() => {
      const content = document.querySelector("#modal-content");
      if (!content || content.querySelector(".case-study-flow") || !content.querySelector("h2")) return;

      const title = content.querySelector("h2")?.textContent || "Proyecto";
      const flow = document.createElement("section");
      flow.className = "case-study-flow";
      flow.innerHTML = `
        <article>
          <small>EL PUNTO DE PARTIDA</small>
          <h3>Un problema concreto, no una plantilla.</h3>
          <p>Cada proyecto se organiza alrededor del negocio, sus públicos y el siguiente paso que necesita facilitar.</p>
        </article>
        <article>
          <small>LA DECISIÓN</small>
          <h3>Claridad antes que ruido.</h3>
          <p>La estructura, la identidad y la tecnología se eligen según lo que ${title} necesita comunicar y hacer.</p>
        </article>
        <article>
          <small>EL RESULTADO</small>
          <h3>Un sistema que puede seguir creciendo.</h3>
          <p>La solución queda preparada para evolucionar sin rehacer todo cada vez que aparece una nueva necesidad.</p>
        </article>
      `;
      const tags = content.querySelector(".modal-tags");
      tags?.insertAdjacentElement("afterend", flow);
    });

    observer.observe(modal, {subtree:true, childList:true});
  }

  function renderTestimonialsIfAvailable() {
    const entries = window.ATRY_TESTIMONIALS || [];
    const container = document.querySelector("[data-testimonials]");
    if (!container || !entries.length) return;
    container.hidden = false;
    container.querySelector(".testimonial-track").innerHTML = entries.map(item => `
      <blockquote>
        <p>“${item.quote}”</p>
        <footer>
          <strong>${item.name}</strong>
          <span>${item.role || ""}</span>
        </footer>
      </blockquote>
    `).join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initIntro();
      initFaq();
      initContactMethods();
      initWhatsApp();
      initAnalyticsHooks();
      initCaseStudyEnhancement();
      renderTestimonialsIfAvailable();
    });
  } else {
    initIntro();
    initFaq();
    initContactMethods();
    initWhatsApp();
    initAnalyticsHooks();
    initCaseStudyEnhancement();
    renderTestimonialsIfAvailable();
  }
})();
