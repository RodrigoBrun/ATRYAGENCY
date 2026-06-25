
(() => {
  const app = document.querySelector("[data-cafe-app]");
  if (!app) return;

  const questions = [
    {
      id: "context",
      title: "¿Con qué llegaste hoy?",
      prompt: "¿Qué describe mejor tu situación?",
      options: [
        { value:"new", label:"Estoy empezando algo nuevo", icon:"ph-rocket-launch" },
        { value:"existing", label:"Ya tengo una marca o negocio", icon:"ph-storefront" },
        { value:"problem", label:"Tengo un problema concreto", icon:"ph-warning-circle" },
        { value:"exploring", label:"Solo estoy explorando posibilidades", icon:"ph-compass" }
      ]
    },
    {
      id: "goal",
      title: "¿Qué debería cambiar?",
      prompt: "Imaginá que el proyecto sale bien. ¿Qué mejora primero?",
      options: [
        { value:"trust", label:"La gente entiende y confía más", icon:"ph-shield-check" },
        { value:"sales", label:"Vendo o recibo más consultas", icon:"ph-trend-up" },
        { value:"operations", label:"Pierdo menos tiempo en tareas manuales", icon:"ph-gear-six" },
        { value:"launch", label:"Puedo lanzar una idea con fuerza", icon:"ph-paper-plane-tilt" }
      ]
    },
    {
      id: "need",
      title: "¿Dónde sentís el mayor vacío?",
      prompt: "No tiene que ser técnico. Elegí lo que más se parece.",
      options: [
        { value:"identity", label:"La marca no se siente clara o propia", icon:"ph-fingerprint" },
        { value:"website", label:"La web no existe o no representa el negocio", icon:"ph-browser" },
        { value:"commerce", label:"Necesito vender, reservar o cobrar mejor", icon:"ph-shopping-cart-simple" },
        { value:"product", label:"Necesito una herramienta o sistema", icon:"ph-circles-three-plus" }
      ]
    },
    {
      id: "audience",
      title: "¿A quién necesitás convencer?",
      prompt: "Pensá en la persona que debería dar el siguiente paso.",
      options: [
        { value:"consumer", label:"Personas que compran o reservan", icon:"ph-user" },
        { value:"business", label:"Empresas o clientes profesionales", icon:"ph-buildings" },
        { value:"community", label:"Una comunidad o audiencia", icon:"ph-users-three" },
        { value:"internal", label:"Mi propio equipo", icon:"ph-identification-card" }
      ]
    },
    {
      id: "energy",
      title: "¿Cómo debería sentirse?",
      prompt: "No elijas lo más lindo. Elegí lo que mejor te represente.",
      options: [
        { value:"clear", label:"Clara y confiable", icon:"ph-check-circle" },
        { value:"bold", label:"Audaz y difícil de ignorar", icon:"ph-lightning" },
        { value:"warm", label:"Cercana y humana", icon:"ph-heart" },
        { value:"premium", label:"Refinada y precisa", icon:"ph-diamond" }
      ]
    },
    {
      id: "moment",
      title: "¿Qué tan urgente es?",
      prompt: "Esto ayuda a ordenar el alcance, no a presionarte.",
      options: [
        { value:"now", label:"Necesito empezar pronto", icon:"ph-timer" },
        { value:"month", label:"Quiero moverlo en el próximo mes", icon:"ph-calendar-check" },
        { value:"later", label:"Estoy preparando el terreno", icon:"ph-plant" },
        { value:"curious", label:"Todavía no tengo fecha", icon:"ph-binoculars" }
      ]
    }
  ];

  const state = {};
  let step = 0;

  const chat = document.querySelector("#cafe-chat");
  const options = document.querySelector("#cafe-options");
  const title = document.querySelector("#cafe-question-title");
  const progressLabel = document.querySelector("#cafe-progress-label");
  const progressBar = document.querySelector("#cafe-progress-bar");
  const back = document.querySelector("#cafe-back");
  const result = document.querySelector("#cafe-result");

  function addMessage(type, text) {
    const article = document.createElement("article");
    article.className = `cafe-message cafe-message--${type}`;
    article.innerHTML = `
      <span class="cafe-avatar">
        <i class="ph-bold ${type === "atry" ? "ph-coffee" : "ph-user"}"></i>
      </span>
      <div>
        <small>${type === "atry" ? "ATRY" : "VOS"}</small>
        <p>${text}</p>
      </div>
    `;
    chat.appendChild(article);
    chat.scrollTop = chat.scrollHeight;
  }

  function renderQuestion() {
    const question = questions[step];
    title.textContent = question.title;
    progressLabel.textContent = `${step + 1} de ${questions.length}`;
    progressBar.style.width = `${((step + 1) / questions.length) * 100}%`;
    back.disabled = step === 0;

    addMessage("atry", question.prompt);

    options.innerHTML = question.options.map(option => `
      <button type="button" data-value="${option.value}" data-label="${option.label}">
        <i class="ph ${option.icon}" aria-hidden="true"></i>
        <span>${option.label}</span>
      </button>
    `).join("");
  }

  function choose(button) {
    const question = questions[step];
    state[question.id] = button.dataset.value;
    addMessage("user", button.dataset.label);

    options.innerHTML = "";

    if (step < questions.length - 1) {
      step += 1;
      setTimeout(renderQuestion, 420);
    } else {
      setTimeout(showResult, 500);
    }
  }

  function calculateResult() {
    const needMap = {
      identity: {
        title: "Primero, una identidad que ordene todo lo demás.",
        priority: "Claridad de marca",
        priorityCopy: "Definir qué representa la marca, cómo habla y qué sistema visual puede sostenerla.",
        roadmap: "Branding + presencia digital",
        steps: [
          "Dirección estratégica y mensajes clave",
          "Identidad visual y sistema gráfico",
          "Aplicación inicial en web o lanzamiento"
        ]
      },
      website: {
        title: "Tu presencia digital tiene que alcanzar el nivel del negocio.",
        priority: "Una web clara y convincente",
        priorityCopy: "Ordenar la información, mostrar valor rápido y facilitar que la persona dé el siguiente paso.",
        roadmap: "Arquitectura + UX/UI + desarrollo",
        steps: [
          "Objetivos, públicos y recorrido",
          "Diseño responsive con identidad propia",
          "Desarrollo, publicación y medición"
        ]
      },
      commerce: {
        title: "El próximo paso debería ser fácil de entender y de completar.",
        priority: "Conversión y operación",
        priorityCopy: "Reducir fricción para comprar, reservar o consultar, sin sumar trabajo manual innecesario.",
        roadmap: "Experiencia comercial + automatización",
        steps: [
          "Definición del flujo de compra o reserva",
          "Interfaz, pagos y panel de gestión",
          "Confirmaciones, seguimiento y mejoras"
        ]
      },
      product: {
        title: "La idea necesita transformarse en una herramienta usable.",
        priority: "Producto digital",
        priorityCopy: "Convertir procesos y necesidades reales en una primera versión clara, útil y medible.",
        roadmap: "MVP + sistema escalable",
        steps: [
          "Problema, usuarios y alcance inicial",
          "Prototipo y validación del recorrido",
          "Desarrollo modular e iteración"
        ]
      }
    };

    const base = needMap[state.need] || needMap.website;

    if (state.goal === "operations") {
      base.priorityCopy += " La automatización debería evaluarse desde el comienzo.";
    }
    if (state.energy === "warm") {
      base.title = "Una experiencia más cercana, simple y fácil de confiar.";
    }
    if (state.energy === "bold") {
      base.title = "Una dirección clara, con suficiente carácter para no pasar desapercibida.";
    }

    return base;
  }

  function showResult() {
    const recommendation = calculateResult();
    app.hidden = true;
    result.hidden = false;

    document.querySelector("#cafe-result-title").textContent = recommendation.title;
    document.querySelector("#cafe-result-intro").textContent =
      "Por lo que contaste, no parece que necesites sumar cosas aisladas. Necesitás ordenar una prioridad y construir desde ahí.";
    document.querySelector("#cafe-result-priority").textContent = recommendation.priority;
    document.querySelector("#cafe-result-priority-copy").textContent = recommendation.priorityCopy;
    document.querySelector("#cafe-result-roadmap").textContent = recommendation.roadmap;
    document.querySelector("#cafe-result-steps").innerHTML =
      recommendation.steps.map(step => `<li>${step}</li>`).join("");

    const brief = {
      source: "cafe",
      answers: state,
      direction: recommendation.title,
      priority: recommendation.priority,
      roadmap: recommendation.roadmap,
      steps: recommendation.steps
    };

    localStorage.setItem("atry-cafe-brief", JSON.stringify(brief));
    result.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  function reset() {
    Object.keys(state).forEach(key => delete state[key]);
    step = 0;
    chat.innerHTML = `
      <article class="cafe-message cafe-message--atry">
        <span class="cafe-avatar"><i class="ph-bold ph-coffee"></i></span>
        <div><small>ATRY</small><p>Volvamos a empezar. Contame con qué llegaste hoy.</p></div>
      </article>`;
    result.hidden = true;
    app.hidden = false;
    renderQuestion();
    app.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  options.addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (button) choose(button);
  });

  back.addEventListener("click", () => {
    if (step === 0) return;
    step -= 1;
    delete state[questions[step].id];
    addMessage("atry", "Volvemos una pregunta. Está perfecto cambiar de idea.");
    renderQuestion();
  });

  document.querySelector("#cafe-restart").addEventListener("click", reset);
  document.querySelectorAll("[data-start-cafe]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelector("#charla").scrollIntoView({behavior:"smooth"});
    });
  });

  document.querySelector("#cafe-save-contact").addEventListener("click", () => {
    const brief = JSON.parse(localStorage.getItem("atry-cafe-brief") || "{}");
    localStorage.setItem("atry-playground-brief", JSON.stringify({
      experiment: "cafe",
      humanNote: `Recomendación: ${brief.direction || ""}. Prioridad: ${brief.priority || ""}. Camino: ${brief.roadmap || ""}.`,
      direction: brief.direction || ""
    }));
    window.location.href = "index.html#contacto";
  });

  document.querySelector("#cafe-copy-result").addEventListener("click", async () => {
    const brief = JSON.parse(localStorage.getItem("atry-cafe-brief") || "{}");
    const text = [
      "ATRY — Recomendación inicial",
      brief.direction,
      `Prioridad: ${brief.priority}`,
      `Camino: ${brief.roadmap}`,
      ...(brief.steps || []).map((step, i) => `${i + 1}. ${step}`)
    ].filter(Boolean).join("\n");

    await navigator.clipboard.writeText(text);
    alert("Recomendación copiada.");
  });

  document.querySelector("#cafe-download-result").addEventListener("click", () => {
    const brief = JSON.parse(localStorage.getItem("atry-cafe-brief") || "{}");
    const text = [
      "ATRY — Recomendación inicial",
      "",
      brief.direction || "",
      "",
      `Prioridad: ${brief.priority || ""}`,
      `Camino recomendado: ${brief.roadmap || ""}`,
      "",
      "Pasos:",
      ...(brief.steps || []).map((step, i) => `${i + 1}. ${step}`),
      "",
      "Este resumen es un punto de partida y no sustituye una propuesta."
    ].join("\n");

    const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recomendacion-atry.txt";
    link.click();
    URL.revokeObjectURL(url);
  });

  renderQuestion();
})();
