# ATRY Playground V2

Esta versión amplía el Playground sin modificar la lógica general del sitio.

## Qué archivos se mantienen intactos

- `script.js`
- `styles.css`

Son copias exactas de los archivos entregados. La nueva funcionalidad vive en archivos independientes.

## Archivos nuevos

```text
playground.html
assets/
└── playground/
    ├── playground.css
    ├── playground.js
    └── modules/
        ├── type-lab.js
        ├── pattern-forge.js
        ├── logo-magnet.js
        ├── mood-generator.js
        └── brand-mixer.js
```

## Experimentos incluidos

1. **Type Lab**
   - Texto editable
   - Tamaño
   - Tracking
   - Inclinación
   - Sólido, contorno y onda
   - Presets aleatorios

2. **Pattern Forge**
   - Densidad
   - Escala
   - Rotación
   - Separación
   - Contorno, relleno y modo mixto
   - Exportación SVG

3. **Logo Magnet**
   - Partículas Canvas
   - Reacción a mouse y tacto
   - Explosión y reconstrucción
   - Menos partículas en móvil
   - Limpieza de `requestAnimationFrame` al cerrar

4. **Mood Generator**
   - Objetivo
   - Personalidad
   - Prioridad estratégica
   - Dirección visual generada localmente

5. **Brand Mixer**
   - Recupera el experimento original
   - Funciona como módulo independiente
   - No altera `script.js`

## Cómo instalarlo

Copiar al proyecto:

- `playground.html`
- la carpeta `assets/playground/`

No es necesario reemplazar `script.js` ni `styles.css` si ya son los mismos archivos entregados.

## Cómo probarlo

Los módulos usan `import()`, por lo tanto hay que abrir el proyecto mediante un servidor local.

Ejemplos:

```bash
python -m http.server 8000
```

o usar Live Server en VS Code.

Abrir:

```text
http://localhost:8000/playground.html
```

No conviene abrir el HTML directamente con `file://`, porque los navegadores suelen bloquear módulos JavaScript locales.

## Seguridad de la arquitectura

Cada experimento exporta:

```js
mount(container)
destroy()
```

Cuando se cierra:

- se eliminan listeners;
- se cancela `requestAnimationFrame`;
- se desconectan observadores;
- se limpia el escenario;
- se devuelve el foco a la tarjeta que lo abrió.

## GitHub Pages

La estructura funciona con rutas relativas y no necesita backend ni paquetes npm.


## V3

- Phosphor Icons 2.1.2 vendorizado localmente (Regular y Bold).
- Brand Builder como experimento destacado.
- Navegación directa entre módulos.
- Apertura/cierre con View Transitions cuando el navegador lo soporta.
- Configuraciones compartibles mediante URL.
- Exportación PNG en Type Lab, Brand Builder y Pattern Forge.
- Mood Generator con servicios, movimiento y tono recomendados.
- Resultado del Mood Generator transferible al formulario mediante `localStorage`.
- Logo Magnet con atracción, repulsión y estelas.

Phosphor Icons se distribuye bajo licencia MIT. Ver `assets/playground/vendor/phosphor/LICENSE.txt`.
