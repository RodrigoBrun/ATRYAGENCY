import { copyShareUrl, downloadCanvas, showToast } from "./utils.js";

export const metadata = { id: "brand-builder", title: "Brand Builder" };
let listeners = [];
function on(el, evt, fn){ el.addEventListener(evt, fn); listeners.push(() => el.removeEventListener(evt, fn)); }

const presets = {
  digital: { colors:["#050505","#00efff","#4754e6"], claim:"Ideas claras. Movimiento real.", tone:"Directo, tecnológico y contundente." },
  premium: { colors:["#050505","#bcdaed","#f5f6f7"], claim:"Precisión que se siente.", tone:"Refinado, calmo y seguro." },
  human: { colors:["#073b4c","#00a5e2","#bcdaed"], claim:"Más cerca. Mejor conectado.", tone:"Cercano, simple y confiable." },
  bold: { colors:["#050505","#00efff","#00a5e2"], claim:"No vinimos a pasar desapercibidos.", tone:"Audaz, enérgico y memorable." }
};

export function mount(container, { initialState } = {}) {
  container.innerHTML = `
    <section class="pg-module" aria-label="Brand Builder">
      <aside class="pg-module__controls">
        <p class="section-index">00 / BRAND BUILDER</p>
        <h2>Construí una dirección en tiempo real.</h2>
        <label>Nombre de la marca<input id="pg-builder-name" type="text" value="NEXA"></label>
        <label>Rubro<input id="pg-builder-sector" type="text" value="Tecnología para negocios"></label>
        <label>Objetivo<select id="pg-builder-goal"><option>Ganar confianza</option><option>Vender más</option><option>Lanzar algo nuevo</option><option>Diferenciarse</option></select></label>
        <label>Personalidad<select id="pg-builder-style"><option value="digital">Digital</option><option value="premium">Premium</option><option value="human">Humana</option><option value="bold">Audaz</option></select></label>
        <label>Nivel de riesgo<input id="pg-builder-risk" type="range" min="0" max="100" value="65"></label>
        <div class="pg-preset-row"><button type="button" data-builder-preset="digital">Digital</button><button type="button" data-builder-preset="premium">Premium</button><button type="button" data-builder-preset="human">Humana</button><button type="button" data-builder-preset="bold">Audaz</button></div>
        <div class="pg-module__actions">
          <button class="pg-control-button pg-control-button--primary" id="pg-builder-random" type="button"><i class="ph ph-shuffle"></i> Sorprendeme</button>
          <button class="pg-control-button" id="pg-builder-share" type="button"><i class="ph ph-share-network"></i> Compartir</button>
          <button class="pg-control-button" id="pg-builder-download" type="button"><i class="ph ph-download-simple"></i> PNG</button>
        </div>
        <div class="pg-module__status">Una dirección automática sirve para abrir posibilidades. La estrategia real decide qué conservar y qué descartar.</div>
      </aside>
      <div class="pg-module__canvas"><div class="pg-builder-stage"><div class="pg-builder-board" id="pg-builder-board">
        <article class="pg-builder-hero" id="pg-builder-hero"><div class="pg-builder-logo-row"><span id="pg-builder-sector-output">Tecnología para negocios</span><span class="pg-builder-mark"><i class="ph ph-shapes"></i></span></div><div><h3 id="pg-builder-name-output">NEXA <span>MOVES</span></h3><p id="pg-builder-claim">Ideas claras. Movimiento real.</p><span class="pg-builder-cta">Descubrir más <i class="ph ph-arrow-right"></i></span></div></article>
        <div class="pg-builder-palette" id="pg-builder-palette"></div>
        <article class="pg-builder-card"><small>BRAND DIRECTION / 01</small><h4 id="pg-builder-tone">Directo, tecnológico y contundente.</h4><span id="pg-builder-goal-output">Objetivo: Ganar confianza</span></article>
        <section class="pg-builder-notes"><article><strong>Idea central</strong><p>Una identidad que convierte complejidad en claridad.</p></article><article><strong>Experiencia</strong><p id="pg-builder-experience">Hero dinámico, recorrido corto y CTA contundente.</p></article><article><strong>Siguiente paso</strong><p>Validar público, mensajes y canales antes de diseñar el sistema final.</p></article></section>
      </div></div></div>
    </section>`;

  const name = container.querySelector('#pg-builder-name');
  const sector = container.querySelector('#pg-builder-sector');
  const goal = container.querySelector('#pg-builder-goal');
  const style = container.querySelector('#pg-builder-style');
  const risk = container.querySelector('#pg-builder-risk');
  const hero = container.querySelector('#pg-builder-hero');
  const palette = container.querySelector('#pg-builder-palette');

  function getState(){ return {name:name.value, sector:sector.value, goal:goal.value, style:style.value, risk:risk.value}; }
  function applyState(s){ if(!s)return; Object.entries(s).forEach(([k,v])=>({name,sector,goal,style,risk}[k]||{}).value=v); paint(); }
  function paint(){
    const p = presets[style.value];
    const brand = (name.value.trim() || 'ATRY').toUpperCase();
    const riskValue = Number(risk.value);
    container.querySelector('#pg-builder-name-output').innerHTML = `${brand} <span>${riskValue > 70 ? 'BREAKS' : riskValue < 35 ? 'BUILDS' : 'MOVES'}</span>`;
    container.querySelector('#pg-builder-sector-output').textContent = sector.value || 'Marca en construcción';
    container.querySelector('#pg-builder-claim').textContent = p.claim;
    container.querySelector('#pg-builder-tone').textContent = p.tone;
    container.querySelector('#pg-builder-goal-output').textContent = `Objetivo: ${goal.value}`;
    container.querySelector('#pg-builder-experience').textContent = riskValue > 70 ? 'Composición asimétrica, interacción visible y una entrada difícil de ignorar.' : riskValue < 35 ? 'Jerarquía limpia, movimiento mínimo y confianza construida con precisión.' : 'Estructura clara, contraste fuerte y movimiento donde suma.';
    hero.style.background = `linear-gradient(${120+riskValue}deg, ${p.colors[0]}, ${p.colors[1]}, ${p.colors[2]})`;
    palette.innerHTML = p.colors.map(c=>`<span style="background:${c};color:${c==='#050505'?'#fff':'#050505'}">${c}</span>`).join('');
  }
  [name,sector,goal,style,risk].forEach(el=>on(el,'input',paint));
  container.querySelectorAll('[data-builder-preset]').forEach(btn=>on(btn,'click',()=>{style.value=btn.dataset.builderPreset;paint();}));
  on(container.querySelector('#pg-builder-random'),'click',()=>{ const names=['NEXA','PULSE','NORTH','ORBIT','FORMA']; name.value=names[Math.floor(Math.random()*names.length)]; style.value=Object.keys(presets)[Math.floor(Math.random()*4)]; risk.value=Math.floor(Math.random()*101); paint(); });
  on(container.querySelector('#pg-builder-share'),'click',()=>copyShareUrl(metadata.id,getState()));
  on(container.querySelector('#pg-builder-download'),'click',()=>{
    const canvas=document.createElement('canvas'); canvas.width=1600; canvas.height=1000; const ctx=canvas.getContext('2d'); const p=presets[style.value];
    const grad=ctx.createLinearGradient(0,0,1600,1000); p.colors.forEach((c,i)=>grad.addColorStop(i/(p.colors.length-1),c)); ctx.fillStyle=grad;ctx.fillRect(0,0,1600,1000);
    ctx.fillStyle='#fff';ctx.font='900 190px Arial';ctx.fillText((name.value||'ATRY').toUpperCase(),100,430);ctx.strokeStyle='#00efff';ctx.lineWidth=5;ctx.strokeText(Number(risk.value)>70?'BREAKS':'MOVES',100,620);ctx.font='32px Arial';ctx.fillText(p.claim,105,735);ctx.font='22px Arial';ctx.fillText(sector.value,105,120);downloadCanvas(canvas,'atry-brand-direction.png');showToast('Dirección exportada como PNG.');
  });
  applyState(initialState); paint();
}
export function destroy(){listeners.forEach(fn=>fn());listeners=[];}
