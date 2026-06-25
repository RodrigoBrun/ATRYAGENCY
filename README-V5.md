# ATRY V5 — Conversión + Nos tomamos un café?

## Decisión de producto

El Playground conserva su nombre y función: demostrar experimentación creativa.

Se agregó una sección/página separada llamada **Nos tomamos un café?** porque
cumple otra tarea: conocer al potencial cliente, recomendar un camino y preparar
un brief antes del contacto humano.

## Incluye

- `cafe.html`: conversación guiada de 6 pasos.
- Recomendación automática según necesidad.
- Guardado del brief en `localStorage`.
- Traspaso directo al formulario de contacto.
- Descarga y copia del resumen.
- Teaser del café en la Home.
- FAQ interactiva.
- Formulario de contacto más conversacional.
- Preferencia de respuesta: email, WhatsApp o videollamada.
- Casos de estudio enriquecidos dentro del modal.
- Intro breve durante la primera visita de cada sesión.
- Página `404.html`.
- `manifest.webmanifest`.
- `robots.txt`.
- `sitemap.xml`.
- Metadatos Open Graph y canonical.
- Hooks de analítica preparados.
- Sección de testimonios preparada, pero oculta hasta cargar testimonios reales.

## Configuración pendiente

Editar:

```js
// assets/site-config.js
window.ATRY_CONFIG = {
  whatsappNumber: "",
  contactEmail: "",
  analyticsEnabled: false
};
```

El WhatsApp se mantiene oculto mientras no exista un número real.

## Testimonios

No se inventaron testimonios. Para publicarlos, editar:

```js
// assets/testimonials.js
window.ATRY_TESTIMONIALS = [
  {
    quote: "Texto aprobado por el cliente.",
    name: "Nombre real",
    role: "Empresa"
  }
];
```

## Dominio

Los metadatos, sitemap y robots usan provisionalmente:

```text
https://atry.agency/
```

Cambiarlo por el dominio definitivo cuando esté comprado.

## Instalación

Copiar el contenido del ZIP en la raíz del proyecto y permitir el reemplazo de
los archivos existentes.
