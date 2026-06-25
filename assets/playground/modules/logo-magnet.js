export const metadata = {
  id: "logo-magnet",
  title: "Logo Magnet"
};

let canvas;
let context;
let particles = [];
let animationFrame = null;
let resizeObserver = null;
let pointer = { x: -9999, y: -9999, active: false };
let listeners = [];
let strength = 95;
let spread = 55;
let mode = "repel";
let trails = false;

function on(element, event, handler, options) {
  element.addEventListener(event, handler, options);
  listeners.push(() => element.removeEventListener(event, handler, options));
}

function buildTextTargets(width, height, amount) {
  const buffer = document.createElement("canvas");
  const bufferContext = buffer.getContext("2d");

  buffer.width = Math.max(800, Math.floor(width));
  buffer.height = Math.max(500, Math.floor(height));

  const fontSize = Math.min(buffer.width * .24, buffer.height * .42);

  bufferContext.clearRect(0, 0, buffer.width, buffer.height);
  bufferContext.fillStyle = "#fff";
  bufferContext.textAlign = "center";
  bufferContext.textBaseline = "middle";
  bufferContext.font = `900 ${fontSize}px Arial, sans-serif`;
  bufferContext.fillText("ATRY", buffer.width / 2, buffer.height / 2);

  const image = bufferContext.getImageData(0, 0, buffer.width, buffer.height);
  const points = [];
  const step = Math.max(4, Math.floor(Math.sqrt((buffer.width * buffer.height) / amount)));

  for (let y = 0; y < buffer.height; y += step) {
    for (let x = 0; x < buffer.width; x += step) {
      const alpha = image.data[(y * buffer.width + x) * 4 + 3];

      if (alpha > 100) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

function createParticles() {
  const rect = canvas.getBoundingClientRect();
  const mobile = rect.width < 780;
  const targetAmount = mobile ? 550 : 1500;
  const targets = buildTextTargets(rect.width, rect.height, targetAmount);

  particles = targets.map((target, index) => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    vx: 0,
    vy: 0,
    tx: target.x,
    ty: target.y,
    size: index % 8 === 0 ? 2.2 : 1.25,
    hue: index % 3
  }));
}

function resizeCanvas() {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles();
}

function draw() {
  if (!canvas || !context) return;

  const rect = canvas.getBoundingClientRect();

  if (trails) { context.fillStyle = "rgba(5,5,5,.16)"; context.fillRect(0,0,rect.width,rect.height); } else { context.clearRect(0, 0, rect.width, rect.height); }

  particles.forEach((particle) => {
    let forceX = (particle.tx - particle.x) * .018;
    let forceY = (particle.ty - particle.y) * .018;

    if (pointer.active) {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distanceSquared = dx * dx + dy * dy;
      const radius = 180 + spread;

      if (distanceSquared < radius * radius && distanceSquared > 0) {
        const distance = Math.sqrt(distanceSquared);
        const force = (1 - distance / radius) * strength * .08;

        const direction = mode === "attract" ? -1 : 1;
        forceX += (dx / distance) * force * direction;
        forceY += (dy / distance) * force * direction;
      }
    }

    particle.vx = (particle.vx + forceX) * .88;
    particle.vy = (particle.vy + forceY) * .88;

    particle.x += particle.vx;
    particle.y += particle.vy;

    const colors = ["#00efff", "#00a5e2", "#4754e6"];

    context.beginPath();
    context.fillStyle = colors[particle.hue];
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  });

  animationFrame = requestAnimationFrame(draw);
}

function explode() {
  particles.forEach((particle) => {
    const angle = Math.random() * Math.PI * 2;
    const force = Math.random() * 30 + 12;

    particle.vx += Math.cos(angle) * force;
    particle.vy += Math.sin(angle) * force;
  });
}

export function mount(container) {
  container.innerHTML = `
    <section class="pg-module" aria-label="Logo Magnet">
      <aside class="pg-module__controls">
        <p class="section-index">03 / LOGO MAGNET</p>
        <h2>Separá las piezas. Siempre vuelven.</h2>

        <label>
          Fuerza del cursor
          <input id="pg-magnet-strength" type="range" min="20" max="180" value="95">
        </label>

        <label>Modo<select id="pg-magnet-mode"><option value="repel">Repulsión</option><option value="attract">Atracción</option></select></label><label><input id="pg-magnet-trails" type="checkbox"> Activar estela</label>

        <label>
          Radio de reacción
          <input id="pg-magnet-spread" type="range" min="10" max="160" value="55">
        </label>

        <div class="pg-module__actions">
          <button class="pg-control-button" type="button" id="pg-magnet-explode">
            Explotar
          </button>
          <button class="pg-control-button" type="button" id="pg-magnet-rebuild">
            Reconstruir
          </button>
        </div>
      </aside>

      <div class="pg-module__canvas">
        <div class="pg-magnet-stage">
          <canvas class="pg-magnet-canvas" id="pg-magnet-canvas"></canvas>
          <p class="pg-magnet-hint">
            Mové el cursor o el dedo. Tocá dos veces para explotar.
          </p>
        </div>
      </div>
    </section>
  `;

  canvas = container.querySelector("#pg-magnet-canvas");
  context = canvas.getContext("2d");

  const strengthInput = container.querySelector("#pg-magnet-strength");
  const spreadInput = container.querySelector("#pg-magnet-spread");
  const modeInput = container.querySelector("#pg-magnet-mode");
  const trailsInput = container.querySelector("#pg-magnet-trails");

  on(strengthInput, "input", () => {
    strength = Number(strengthInput.value);
  });

  on(spreadInput, "input", () => { spread = Number(spreadInput.value); });
  on(modeInput, "change", () => { mode = modeInput.value; });
  on(trailsInput, "change", () => { trails = trailsInput.checked; });

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    const point = event.touches?.[0] || event;

    pointer.x = point.clientX - rect.left;
    pointer.y = point.clientY - rect.top;
    pointer.active = true;
  }

  on(canvas, "pointermove", updatePointer);
  on(canvas, "pointerleave", () => {
    pointer.active = false;
  });
  on(canvas, "pointerdown", updatePointer);
  on(canvas, "pointerup", () => {
    pointer.active = false;
  });
  on(canvas, "dblclick", explode);

  on(container.querySelector("#pg-magnet-explode"), "click", explode);

  on(container.querySelector("#pg-magnet-rebuild"), "click", () => {
    particles.forEach((particle) => {
      particle.vx = 0;
      particle.vy = 0;
    });
  });

  resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvas);

  resizeCanvas();
  draw();
}

export function resize() {
  resizeCanvas();
}

export function destroy() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  resizeObserver?.disconnect();
  listeners.forEach((remove) => remove());

  listeners = [];
  particles = [];
  canvas = null;
  context = null;
  pointer.active = false;
}
