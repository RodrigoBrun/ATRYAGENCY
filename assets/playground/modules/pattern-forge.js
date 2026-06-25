import { copyShareUrl, downloadCanvas, showToast } from "./utils.js";

export const metadata = {
  id: "pattern-forge",
  title: "Pattern Forge"
};

let listeners = [];

function on(element, event, handler) {
  element.addEventListener(event, handler);
  listeners.push(() => element.removeEventListener(event, handler));
}

function downloadSvg(svg) {
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const blob = new Blob(
    [new XMLSerializer().serializeToString(clone)],
    { type: "image/svg+xml;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "atry-pattern.svg";
  link.click();

  URL.revokeObjectURL(url);
}

export function mount(container) {
  container.innerHTML = `
    <section class="pg-module" aria-label="Pattern Forge">
      <aside class="pg-module__controls">
        <p class="section-index">02 / PATTERN FORGE</p>
        <h2>Construí ritmo con una sola forma.</h2>

        <label>
          Densidad
          <input id="pg-pattern-density" type="range" min="3" max="14" value="7">
        </label>

        <label>
          Escala
          <input id="pg-pattern-scale" type="range" min="30" max="120" value="70">
        </label>

        <label>
          Rotación
          <input id="pg-pattern-rotate" type="range" min="-45" max="45" value="0">
        </label>

        <label>
          Separación
          <input id="pg-pattern-gap" type="range" min="0" max="70" value="22">
        </label>

        <label>
          Estilo
          <select id="pg-pattern-style">
            <option value="outline">Contorno</option>
            <option value="fill">Relleno</option>
            <option value="mixed">Mixto</option>
          </select>
        </label>

        <label>
          Fondo
          <select id="pg-pattern-bg">
            <option value="#f5f6f7">Claro</option>
            <option value="#050505">Negro</option>
            <option value="#4754e6">Violeta</option>
            <option value="#00a5e2">Azul</option>
          </select>
        </label>

        <div class="pg-module__actions">
          <button class="pg-control-button" type="button" id="pg-pattern-random">
            Aleatorizar
          </button>
          <button class="pg-control-button" type="button" id="pg-pattern-download"><i class="ph ph-file-svg"></i> SVG</button><button class="pg-control-button" type="button" id="pg-pattern-png"><i class="ph ph-image"></i> PNG</button><button class="pg-control-button" type="button" id="pg-pattern-share"><i class="ph ph-share-network"></i> Compartir</button>
        </div>
      </aside>

      <div class="pg-module__canvas">
        <div class="pg-pattern-stage">
          <svg
            class="pg-pattern-svg"
            id="pg-pattern-svg"
            viewBox="0 0 1200 900"
            role="img"
            aria-label="Patrón generativo ATRY"
          >
            <rect width="1200" height="900" id="pg-pattern-background"></rect>
            <g id="pg-pattern-group"></g>
          </svg>
        </div>
      </div>
    </section>
  `;

  const density = container.querySelector("#pg-pattern-density");
  const scale = container.querySelector("#pg-pattern-scale");
  const rotate = container.querySelector("#pg-pattern-rotate");
  const gap = container.querySelector("#pg-pattern-gap");
  const style = container.querySelector("#pg-pattern-style");
  const background = container.querySelector("#pg-pattern-bg");
  const svg = container.querySelector("#pg-pattern-svg");
  const group = container.querySelector("#pg-pattern-group");
  const backgroundRect = container.querySelector("#pg-pattern-background");

  function symbolMarkup(x, y, size, index) {
    const currentStyle = style.value;
    const isFill = currentStyle === "fill"
      || (currentStyle === "mixed" && index % 2 === 0);

    const fill = isFill ? "#00efff" : "none";
    const stroke = isFill ? "none" : "#00a5e2";
    const strokeWidth = Math.max(3, size * .045);

    return `
      <g transform="translate(${x} ${y}) rotate(${rotate.value})">
        <path
          d="
            M 0 ${size * .18}
            C ${size * .28} ${-size * .08},
              ${size * .72} ${-size * .08},
              ${size} ${size * .18}
            L ${size * .72} ${size * .5}
            L ${size} ${size * .82}
            C ${size * .72} ${size * 1.08},
              ${size * .28} ${size * 1.08},
              0 ${size * .82}
            L ${size * .28} ${size * .5}
            Z
          "
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
          stroke-linejoin="round"
        />
      </g>
    `;
  }

  function paint() {
    const columns = Number(density.value);
    const size = Number(scale.value);
    const spacing = size + Number(gap.value);
    const rows = Math.ceil(900 / spacing) + 2;

    backgroundRect.setAttribute("fill", background.value);

    let markup = "";
    let index = 0;

    for (let row = -1; row < rows; row += 1) {
      for (let column = -1; column < columns + 2; column += 1) {
        const offset = row % 2 === 0 ? 0 : spacing / 2;
        const x = column * spacing + offset;
        const y = row * spacing;

        markup += symbolMarkup(x, y, size, index);
        index += 1;
      }
    }

    group.innerHTML = markup;
  }

  [density, scale, rotate, gap, style, background].forEach((control) => {
    on(control, "input", paint);
  });

  on(container.querySelector("#pg-pattern-random"), "click", () => {
    density.value = Math.floor(Math.random() * 8) + 5;
    scale.value = Math.floor(Math.random() * 70) + 40;
    rotate.value = Math.floor(Math.random() * 80) - 40;
    gap.value = Math.floor(Math.random() * 55) + 5;
    style.value = ["outline", "fill", "mixed"][Math.floor(Math.random() * 3)];

    const backgrounds = ["#f5f6f7", "#050505", "#4754e6", "#00a5e2"];
    background.value = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    paint();
  });

  on(container.querySelector("#pg-pattern-download"), "click", () => {
    downloadSvg(svg);
  });


  on(container.querySelector("#pg-pattern-png"), "click", () => {
    const serialized = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 900; canvas.getContext("2d").drawImage(image,0,0); downloadCanvas(canvas,"atry-pattern.png"); URL.revokeObjectURL(url); showToast("Patrón exportado como PNG."); };
    image.src = url;
  });

  on(container.querySelector("#pg-pattern-share"), "click", () => copyShareUrl(metadata.id, { density:density.value, scale:scale.value, rotate:rotate.value, gap:gap.value, style:style.value, background:background.value }));

  paint();
}

export function destroy() {
  listeners.forEach((remove) => remove());
  listeners = [];
}
