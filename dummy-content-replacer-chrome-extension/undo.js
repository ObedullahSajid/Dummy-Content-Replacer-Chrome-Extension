if (window.__originalTextMap) {
  window.__originalTextMap.forEach((text, el) => {
    el.textContent = text;
    el.removeAttribute("data-dummy-replaced");
  });
  window.__originalTextMap.clear();
}
