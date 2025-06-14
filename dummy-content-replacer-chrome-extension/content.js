(() => {
  chrome.storage.local.get(["textType", "customText"], (data) => {
    let dummyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    switch (data.textType) {
      case "custom":
        dummyText = data.customText || dummyText;
        break;
      case "arabic":
        dummyText = "هذا نص عربي وهمي لاستخدامه في التصاميم.";
        break;
      case "hindi":
        dummyText = "यह एक डमी टेक्स्ट है जो डिज़ाइन के लिए उपयोग किया जाता है।";
        break;
      case "chinese":
        dummyText = "这是用于设计的虚拟文本。";
        break;
    }

    const tagsToReplace = [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "span", "li", "a", "strong", "em", "b", "i", "td", "th", "caption", "label"
    ];

    const containerTags = ["div", "section", "article", "aside", "main", "header", "footer", "nav"];

    window.__originalTextMap = window.__originalTextMap || new Map();

    function shouldReplaceText(el) {
      const children = Array.from(el.childNodes);
      const textNodes = children.filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
      const otherNodes = children.filter(node => node.nodeType !== Node.TEXT_NODE);
      return textNodes.length > 0 && otherNodes.length === 0;
    }

    function generateDummyText(length) {
      let base = dummyText;
      while (base.length < length) {
        base += " " + dummyText;
      }
      return base.substring(0, length);
    }

    function replaceTextNode(node) {
      const original = node.textContent;
      if (original.trim().length === 0) return;

      const span = document.createElement("span");
      span.textContent = generateDummyText(original.length);
      span.setAttribute("data-dummy-replaced", "true");
      span.setAttribute("data-original-text", original);

      window.__originalTextMap.set(span, original);
      node.parentNode.replaceChild(span, node);
    }

    tagsToReplace.forEach(tag => {
      document.querySelectorAll(tag).forEach(el => {
        if (el.hasAttribute("data-dummy-replaced")) return;

        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
          const original = el.textContent;
          if (original.trim().length > 0) {
            window.__originalTextMap.set(el, original);
            el.textContent = generateDummyText(original.length);
            el.setAttribute("data-dummy-replaced", "true");
          }
        } else {
          el.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
              replaceTextNode(child);
            }
          });
          el.setAttribute("data-dummy-replaced", "true");
        }
      });
    });

    containerTags.forEach(tag => {
      document.querySelectorAll(tag).forEach(el => {
        if (el.hasAttribute("data-dummy-replaced")) return;

        if (shouldReplaceText(el)) {
          const original = el.textContent;
          if (original.trim().length > 0) {
            window.__originalTextMap.set(el, original);
            el.textContent = generateDummyText(original.length);
            el.setAttribute("data-dummy-replaced", "true");
          }
        }
      });
    });
  });
})();
