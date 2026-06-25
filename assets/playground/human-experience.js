import { showToast } from "./modules/utils.js";

const STORAGE_KEYS = {
  welcomed: "atry-playground-welcomed",
  intent: "atry-playground-intent",
  brief: "atry-playground-brief"
};

const recommendations = {
  brand: {
    module: "brand-builder",
    title: "Empecemos por darle dirección a tu marca.",
    description: "El Brand Builder es el mejor punto de partida para transformar una sensación en un sistema."
  },
  idea: {
    module: "mood-generator",
    title: "Vamos a convertir esa idea en una dirección.",
    description: "El Mood Generator te ayuda a ordenar lo que querés lograr antes de pensar en colores o efectos."
  },
  play: {
    module: "logo-magnet",
    title: "Perfecto. Tocá, mové y rompé cosas.",
    description: "Logo Magnet es el experimento más físico y directo para entrar jugando."
  }
};

const guideMessages = {
  default: [
    "No hay una respuesta correcta. Probá hasta que algo te haga sentir: «por acá»",
    "Una buena interacción no adorna: revela una idea.",
    "Guardamos lo técnico atrás. Vos concentrate en lo que te hace sentir."
  ],
  "brand-builder": [
    "No busques una marca perfecta. Buscá una dirección que se sienta propia.",
    "Mové el nivel de riesgo: ahí suele aparecer la personalidad.",
    "Cuando algo te haga clic, llevátelo al contacto. Lo conversamos como personas."
  ],
  "type-lab": [
    "Leé la frase en voz alta. ¿Suena como querés que suene tu marca?",
    "El espacio también comunica. Probá abrir y cerrar el tracking.",
    "Destacá una sola palabra. La jerarquía funciona mejor cuando elige."
  ],
  "pattern-forge": [
    "Los sistemas fuertes nacen de pocas reglas bien elegidas.",
    "Alejate un poco de la pantalla: el ritmo se entiende mejor.",
    "Probá menos elementos antes de agregar más."
  ],
  "logo-magnet": [
    "Acercá el cursor despacio. La reacción cambia mucho.",
    "Desarmar también es diseñar: ayuda a entender qué mantiene unido al sistema.",
    "Activá la estela para sentir el movimiento, no solo verlo."
  ],
  "mood-generator": [
    "Elegí primero el objetivo real. El estilo viene después.",
    "Una dirección útil debería ayudarte a decidir qué no hacer.",
    "Llevarlo a contacto guarda el punto de partida para conversar."
  ],
  "brand-mixer": [
    "No mires solo el color: observá cuánto cambia la energía de la pieza.",
    "Claridad no significa aburrimiento. Significa intención.",
    "Mezclá hasta que la composición parezca tener una personalidad."
  ]
};

let guideTimer = null;
let currentModule = "default";
let messageIndex = 0;

function vibrate(pattern = 18) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function burst(originElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = originElement?.getBoundingClientRect?.() || {
    left: innerWidth / 2,
    top: innerHeight / 2,
    width: 0,
    height: 0
  };

  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const colors = ["#00efff", "#00a5e2", "#4754e6", "#bcdaed", "#ffffff"];

  for (let index = 0; index < 16; index += 1) {
    const particle = document.createElement("span");
    particle.className = "pg-delight-particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--pg-x", `${(Math.random() - .5) * 220}px`);
    particle.style.setProperty("--pg-y", `${(Math.random() - .75) * 190}px`);
    particle.style.setProperty("--pg-r", `${Math.random() * 280 - 140}deg`);
    particle.style.background = colors[index % colors.length];

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }
}

function updateGuide(message) {
  const text = document.querySelector("#pg-human-guide-text");
  if (!text) return;

  text.classList.remove("pg-is-changing");
  requestAnimationFrame(() => {
    text.classList.add("pg-is-changing");
    text.textContent = message;
  });
}

function cycleGuide() {
  const messages = guideMessages[currentModule] || guideMessages.default;
  updateGuide(messages[messageIndex % messages.length]);
  messageIndex += 1;
}

export function setHumanGuideModule(moduleId) {
  currentModule = moduleId || "default";
  messageIndex = 0;
  cycleGuide();

  clearInterval(guideTimer);
  guideTimer = setInterval(cycleGuide, 9500);
}

function chooseIntent(intent) {
  const recommendation = recommendations[intent];
  if (!recommendation) return;

  localStorage.setItem(STORAGE_KEYS.intent, intent);
  localStorage.setItem(STORAGE_KEYS.welcomed, "true");

  document.querySelector("#pg-human-welcome")?.classList.remove("pg-is-open");
  document.body.classList.remove("pg-welcome-open");

  const title = document.querySelector("#pg-personal-title");
  const description = document.querySelector("#pg-personal-description");
  const recommendedCard = document.querySelector(
    `[data-experiment="${recommendation.module}"]`
  );

  if (title) title.textContent = recommendation.title;
  if (description) description.textContent = recommendation.description;

  document
    .querySelectorAll(".pg-experiment-card")
    .forEach((card) => card.classList.remove("pg-is-recommended"));

  recommendedCard?.classList.add("pg-is-recommended");
  recommendedCard?.scrollIntoView({ behavior: "smooth", block: "center" });

  showToast("Te marcamos un buen punto de partida. Después podés probar todo.");
  burst(recommendedCard);
  vibrate([18, 30, 18]);
}

function openWelcome() {
  const welcome = document.querySelector("#pg-human-welcome");
  if (!welcome) return;

  welcome.classList.add("pg-is-open");
  document.body.classList.add("pg-welcome-open");
  welcome.querySelector("button")?.focus();
}

function closeWelcome() {
  document.querySelector("#pg-human-welcome")?.classList.remove("pg-is-open");
  document.body.classList.remove("pg-welcome-open");
  localStorage.setItem(STORAGE_KEYS.welcomed, "true");
}

function openGuide() {
  document.querySelector("#pg-human-guide")?.classList.toggle("pg-is-open");
  vibrate(12);
}

function saveHumanBrief(moduleId, note) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.brief) || "{}");

  const brief = {
    ...existing,
    experiment: moduleId,
    humanNote: note,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.brief, JSON.stringify(brief));
}

function attachOutcomePanel(moduleId) {
  const stage = document.querySelector("#pg-experiment-stage");
  const moduleCanvas = stage?.querySelector(".pg-module__canvas");

  if (!moduleCanvas || moduleCanvas.querySelector(".pg-human-outcome")) return;

  const panel = document.createElement("aside");
  panel.className = "pg-human-outcome";
  panel.innerHTML = `
    <button
      class="pg-human-outcome__toggle"
      type="button"
      aria-expanded="false"
    >
      <span>
        <small>¿ALGO TE HIZO CLIC?</small>
        <strong>Contanos qué imaginaste</strong>
      </span>
      <i class="ph ph-chat-circle-dots" aria-hidden="true"></i>
    </button>

    <div class="pg-human-outcome__content">
      <p>
        No hace falta que esté ordenado. Escribí la sensación, la idea o el
        detalle que te gustaría llevar a una marca real.
      </p>

      <textarea
        rows="3"
        placeholder="Ejemplo: me gustó cómo el movimiento hizo que la marca se sintiera más viva…"
      ></textarea>

      <div>
        <button type="button" data-human-save>
          <i class="ph ph-bookmark-simple"></i>
          Guardar esta intuición
        </button>

        <button type="button" data-human-contact>
          <i class="ph ph-paper-plane-tilt"></i>
          Conversarlo con ATRY
        </button>
      </div>
    </div>
  `;

  moduleCanvas.appendChild(panel);

  const toggle = panel.querySelector(".pg-human-outcome__toggle");
  const textarea = panel.querySelector("textarea");

  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("pg-is-open");
    toggle.setAttribute("aria-expanded", String(open));

    if (open) {
      textarea.focus();
      updateGuide("Escribilo como te salga. Después nosotros ayudamos a darle forma.");
      vibrate(12);
    }
  });

  panel.querySelector("[data-human-save]").addEventListener("click", (event) => {
    const note = textarea.value.trim();

    if (!note) {
      textarea.focus();
      showToast("Escribí aunque sea una frase corta. La idea no tiene que estar terminada.");
      return;
    }

    saveHumanBrief(moduleId, note);
    showToast("Guardamos tu intuición en este dispositivo.");
    burst(event.currentTarget);
    vibrate([16, 25, 16]);
  });

  panel.querySelector("[data-human-contact]").addEventListener("click", (event) => {
    const note = textarea.value.trim();

    saveHumanBrief(
      moduleId,
      note || "Me interesó este experimento y quiero conversar cómo aplicarlo."
    );

    burst(event.currentTarget);
    vibrate([20, 30, 20]);

    setTimeout(() => {
      window.location.href = "index.html#contacto";
    }, 260);
  });
}

export function onExperimentMounted(moduleId) {
  setHumanGuideModule(moduleId);
  attachOutcomePanel(moduleId);

  const stage = document.querySelector("#pg-experiment-stage");

  stage?.querySelectorAll(
    ".pg-control-button--primary, [id*='random'], [id*='generate'], [id*='explode']"
  ).forEach((button) => {
    button.addEventListener("click", () => {
      burst(button);
      vibrate(15);
    });
  });
}

function initializePersonalMessage() {
  const savedIntent = localStorage.getItem(STORAGE_KEYS.intent);
  const recommendation = recommendations[savedIntent];

  if (!recommendation) return;

  const title = document.querySelector("#pg-personal-title");
  const description = document.querySelector("#pg-personal-description");
  const card = document.querySelector(
    `[data-experiment="${recommendation.module}"]`
  );

  if (title) title.textContent = recommendation.title;
  if (description) description.textContent = recommendation.description;
  card?.classList.add("pg-is-recommended");
}

function initializeHumanExperience() {
  document.querySelectorAll("[data-human-intent]").forEach((button) => {
    button.addEventListener("click", () => chooseIntent(button.dataset.humanIntent));
  });

  document
    .querySelector("[data-close-human-welcome]")
    ?.addEventListener("click", closeWelcome);

  document
    .querySelector("#pg-open-human-welcome")
    ?.addEventListener("click", openWelcome);

  document
    .querySelector("#pg-human-guide-toggle")
    ?.addEventListener("click", openGuide);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeWelcome();
      document.querySelector("#pg-human-guide")?.classList.remove("pg-is-open");
    }
  });

  initializePersonalMessage();
  setHumanGuideModule("default");

  if (!localStorage.getItem(STORAGE_KEYS.welcomed)) {
    setTimeout(openWelcome, 700);
  }
}

initializeHumanExperience();
