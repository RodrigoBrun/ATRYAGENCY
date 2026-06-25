(() => {
  const STORAGE_KEY = "atry-playground-brief";

  function applyPlaygroundBrief() {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    let brief;

    try {
      brief = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      brief = null;
    }

    if (!brief) return;

    const message = form.querySelector('[name="message"]');
    const service = form.querySelector('[name="service"]');
    const status = document.querySelector("#form-status");

    const experimentNames = {
      "brand-builder": "Brand Builder",
      "type-lab": "Type Lab",
      "pattern-forge": "Pattern Forge",
      "logo-magnet": "Logo Magnet",
      "mood-generator": "Mood Generator",
      "brand-mixer": "Brand Mixer"
    };

    const experiment = experimentNames[brief.experiment] || "Playground";

    if (message && !message.value.trim()) {
      message.value = [
        `Estuve probando ${experiment} en el Playground.`,
        brief.humanNote ? `Lo que imaginé: ${brief.humanNote}` : "",
        brief.direction ? `Dirección generada: ${brief.direction}` : "",
        "",
        "Me gustaría conversar cómo llevar esta idea a una marca o proyecto real."
      ].filter(Boolean).join("\n");
    }

    if (service) {
      const desiredOption = [...service.options].find((option) =>
        /branding|producto digital|diseño y desarrollo web/i.test(option.textContent)
      );

      if (desiredOption) {
        service.value = desiredOption.value;
      }
    }

    if (status) {
      status.textContent =
        "Trajimos la idea que guardaste en el Playground. Podés editarla antes de enviarla.";
      status.classList.add("has-playground-brief");
    }

    form.classList.add("has-playground-brief");
    localStorage.removeItem(STORAGE_KEY);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPlaygroundBrief);
  } else {
    applyPlaygroundBrief();
  }
})();
