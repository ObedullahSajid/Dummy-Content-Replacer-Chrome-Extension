document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("textType");
  const customText = document.getElementById("customText");

  chrome.storage.local.get(["textType", "customText"], data => {
    if (data.textType) select.value = data.textType;
    if (data.customText) customText.value = data.customText;
    toggleTextarea();
  });

  select.addEventListener("change", toggleTextarea);

  document.getElementById("save").addEventListener("click", () => {
    chrome.storage.local.set({
      textType: select.value,
      customText: customText.value
    }, () => {
      alert("Settings saved!");
    });
  });

  document.getElementById("replace").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Clear previous dummy state to avoid conflicts
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.__originalTextMap = undefined;
        document.querySelectorAll("[data-dummy-replaced]").forEach(el => {
          el.removeAttribute("data-dummy-replaced");
        });
      }
    });

    // Now run the replacement script with fresh settings
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  });

  document.getElementById("undo").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["undo.js"]
    });
  });

  function toggleTextarea() {
    customText.style.display = (select.value === "custom") ? "block" : "none";
  }
});
