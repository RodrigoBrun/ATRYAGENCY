import { readSharedState, showToast } from "./modules/utils.js";
import { onExperimentMounted, setHumanGuideModule } from "./human-experience.js";

const stageShell = document.querySelector("#laboratorio");
const stage = document.querySelector("#pg-experiment-stage");
const loading = document.querySelector("#pg-stage-loading");
const errorBox = document.querySelector("#pg-stage-error");
const closeButton = document.querySelector("#pg-close-experiment");
const fullscreenButton = document.querySelector("#pg-toggle-fullscreen");
const stageKicker = document.querySelector("#pg-stage-kicker");
const moduleNav = document.querySelector("#pg-module-nav");

let activeModule = null;
let activeTrigger = null;
let activeId = null;

const modules = [
  { id: "brand-builder", label: "Builder", loader: () => import("./modules/brand-builder.js") },
  { id: "type-lab", label: "Type", loader: () => import("./modules/type-lab.js") },
  { id: "pattern-forge", label: "Pattern", loader: () => import("./modules/pattern-forge.js") },
  { id: "logo-magnet", label: "Magnet", loader: () => import("./modules/logo-magnet.js") },
  { id: "mood-generator", label: "Mood", loader: () => import("./modules/mood-generator.js") },
  { id: "brand-mixer", label: "Mixer", loader: () => import("./modules/brand-mixer.js") }
];

const moduleLoaders = Object.fromEntries(modules.map((item) => [item.id, item.loader]));

function renderModuleNav() {
  moduleNav.innerHTML = modules.map((item) => `
    <button
      type="button"
      data-module-jump="${item.id}"
      aria-current="${item.id === activeId}"
    >${item.label}</button>
  `).join("");
}

function resetStageState() {
  errorBox.hidden = true;
  loading.hidden = false;
  stage.innerHTML = "";
  stage.appendChild(loading);
}

async function performTransition(callback) {
  if (document.startViewTransition) {
    await document.startViewTransition(callback).finished;
  } else {
    await callback();
  }
}

async function openExperiment(experimentId, trigger = null, initialState = null) {
  const loadModule = moduleLoaders[experimentId];
  if (!loadModule) return;

  if (activeModule?.destroy) {
    await activeModule.destroy();
  }

  activeTrigger = trigger || activeTrigger;
  activeId = experimentId;
  resetStageState();
  renderModuleNav();

  await performTransition(() => {
    stageShell.hidden = false;
    document.body.classList.add("pg-experiment-open");
  });

  stageShell.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const module = await loadModule();
    if (!module.mount) throw new Error("El módulo no exporta mount().");

    activeModule = module;
    stageKicker.textContent = module.metadata?.title
      ? `ATRY EXPERIMENT / ${module.metadata.title.toUpperCase()}`
      : "ATRY EXPERIMENT";

    loading.hidden = true;
    await module.mount(stage, { initialState });
    onExperimentMounted(experimentId);
    stage.focus({ preventScroll: true });
  } catch (error) {
    console.error("No se pudo abrir el experimento:", error);
    loading.hidden = true;
    errorBox.hidden = false;
  }
}

async function closeExperiment({ restoreFocus = true } = {}) {
  if (activeModule?.destroy) {
    try { await activeModule.destroy(); }
    catch (error) { console.warn("Desmontaje incompleto:", error); }
  }

  activeModule = null;
  activeId = null;
  setHumanGuideModule("default");
  stage.innerHTML = "";

  await performTransition(() => {
    stageShell.hidden = true;
    stageShell.classList.remove("pg-is-fullscreen");
    document.body.classList.remove("pg-experiment-open");
  });

  fullscreenButton.querySelector("span").textContent = "Pantalla completa";
  if (restoreFocus && activeTrigger) activeTrigger.focus();
}

document.querySelectorAll("[data-experiment]").forEach((button) => {
  button.addEventListener("click", () => openExperiment(button.dataset.experiment, button));
});

moduleNav?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-module-jump]");
  if (!button || button.dataset.moduleJump === activeId) return;
  openExperiment(button.dataset.moduleJump);
});

closeButton?.addEventListener("click", async () => {
  await closeExperiment();
  document.querySelector("#experimentos")?.scrollIntoView({ behavior: "smooth" });
});

fullscreenButton?.addEventListener("click", () => {
  const isFullscreen = stageShell.classList.toggle("pg-is-fullscreen");
  fullscreenButton.querySelector("span").textContent = isFullscreen
    ? "Salir de pantalla completa"
    : "Pantalla completa";
  activeModule?.resize?.();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || stageShell.hidden) return;
  if (stageShell.classList.contains("pg-is-fullscreen")) {
    stageShell.classList.remove("pg-is-fullscreen");
    fullscreenButton.querySelector("span").textContent = "Pantalla completa";
    activeModule?.resize?.();
  } else {
    closeExperiment();
  }
});

window.addEventListener("beforeunload", () => activeModule?.destroy?.());

const shared = readSharedState();
if (shared.experiment && moduleLoaders[shared.experiment]) {
  setTimeout(() => {
    openExperiment(shared.experiment, null, shared.state);
    showToast("Abrimos la configuración compartida.");
  }, 350);
}
