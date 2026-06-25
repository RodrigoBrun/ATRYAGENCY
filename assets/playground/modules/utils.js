export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, filename);
  }, "image/png", 1);
}

export function showToast(message) {
  const toast = document.querySelector("#pg-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

export function encodeState(state) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

export function decodeState(value) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(value))));
  } catch {
    return null;
  }
}

export async function copyShareUrl(experimentId, state) {
  const url = new URL(window.location.href);
  url.hash = `experiment=${experimentId}&state=${encodeURIComponent(encodeState(state))}`;
  await navigator.clipboard.writeText(url.toString());
  showToast("Enlace copiado. La configuración viaja incluida.");
}

export function readSharedState() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return {
    experiment: params.get("experiment"),
    state: params.get("state") ? decodeState(decodeURIComponent(params.get("state"))) : null
  };
}
