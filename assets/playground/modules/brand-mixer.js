export const metadata = {
  id: "brand-mixer",
  title: "Brand Mixer"
};

let listeners = [];

function on(element, event, handler) {
  element.addEventListener(event, handler);
  listeners.push(() => element.removeEventListener(event, handler));
}

export function mount(container) {
  container.innerHTML = `
    <section class="pg-module" aria-label="Brand Mixer">
      <aside class="pg-module__controls">
        <p class="section-index">05 / BRAND MIXER</p>
        <h2>Mezclá dirección, claridad y movimiento.</h2>

        <label>
          Personalidad
          <input id="pg-mixer-energy" type="range" min="0" max="100" value="65">
        </label>

        <label>
          Claridad
          <input id="pg-mixer-clarity" type="range" min="0" max="100" value="75">
        </label>

        <label>
          Movimiento
          <input id="pg-mixer-motion" type="range" min="0" max="100" value="55">
        </label>

        <div class="pg-module__actions">
          <button class="pg-control-button" type="button" id="pg-mixer-random">
            Mezclar dirección
          </button>
        </div>
      </aside>

      <div class="pg-module__canvas">
        <div class="pg-mixer-stage">
          <article class="pg-mixer-poster" id="pg-mixer-poster">
            <img src="assets/LOGOTIPO-BLANCO.png" alt="">
            <h3>YOUR NEXT<br><strong>BIG MOVE</strong></h3>
            <p id="pg-mixer-caption">Audaz · Clara · Dinámica</p>
          </article>
        </div>
      </div>
    </section>
  `;

  const energy = container.querySelector("#pg-mixer-energy");
  const clarity = container.querySelector("#pg-mixer-clarity");
  const motion = container.querySelector("#pg-mixer-motion");
  const poster = container.querySelector("#pg-mixer-poster");
  const caption = container.querySelector("#pg-mixer-caption");

  function paint() {
    const e = Number(energy.value);
    const c = Number(clarity.value);
    const m = Number(motion.value);

    poster.style.background = `linear-gradient(
      ${120 + m}deg,
      hsl(${190 + e / 4} 85% ${8 + c / 12}%),
      hsl(${205 + m / 5} 85% ${38 + e / 8}%),
      hsl(${240 + c / 5} 70% 55%)
    )`;

    poster.style.transform = `
      rotateX(${(m - 50) / 18}deg)
      rotateY(${(e - 50) / 20}deg)
      scale(${.94 + c / 1600})
    `;

    caption.textContent = [
      e > 66 ? "Audaz" : e < 34 ? "Serena" : "Equilibrada",
      c > 66 ? "Clara" : c < 34 ? "Exploratoria" : "Flexible",
      m > 66 ? "Dinámica" : m < 34 ? "Precisa" : "Rítmica"
    ].join(" · ");
  }

  [energy, clarity, motion].forEach((input) => {
    on(input, "input", paint);
  });

  on(container.querySelector("#pg-mixer-random"), "click", () => {
    energy.value = Math.floor(Math.random() * 101);
    clarity.value = Math.floor(Math.random() * 101);
    motion.value = Math.floor(Math.random() * 101);
    paint();
  });

  paint();
}

export function destroy() {
  listeners.forEach((remove) => remove());
  listeners = [];
}
