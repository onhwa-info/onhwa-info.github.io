document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById("fileInput");
  const editor = document.getElementById("editor");
  const previewFrame = document.getElementById("previewFrame");
  const beautifyBtn = document.getElementById("beautifyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const spanBgColor = document.getElementById("spanBgColor");
  const spanColor = document.getElementById("spanColor");
  const spanPadding = document.getElementById("spanPadding");
  const spanFontSize = document.getElementById("spanFontSize");
  const bColor = document.getElementById("bColor");
  const fontFamily = document.getElementById("fontFamily");
  const lineHeight = document.getElementById("lineHeight");
  const gapPadding = document.getElementById("gapPadding");
  const gapAlign = document.getElementById("gapAlign");
  const wrapBg = document.getElementById("wrapBg");
  const msgBg = document.getElementById("msgBg");
  const pMargin = document.getElementById("pMargin");
  const pPaddingLeft = document.getElementById("pPaddingLeft");

  // 초기 예시 HTML
  let htmlContent = `<div class="ccfolia_wrap">
  <div class="gap">
    <div class="msg_container">
      <img src="https://storage.ccfolia-cdn.net/users/6lkdFB6DuUgRmrt5m7fltq3Xlm32/files/cfbb3aa5ca288c56cd4c4a3357f95bb1b4d81575b551a5ed25e315aed2a4a0c2" alt="돌로레스 월터" style="width:40px;height:40px;border-radius:5px;object-fit:cover;">
    </div>
    <p>
      <span></span> <span style="color: rgb(33, 150, 243); font-weight: bold;">돌로레스 월터</span><b> - 2025/09/09</b><span> <br> </span><span> 아아</span>
    </p>
  </div>
</div>`;
  editor.value = htmlContent;

  function sanitizeHTML(html) {
    html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");
    // span, b, p 스타일은 제거, img inline은 유지
    html = html.replace(/(<(span|b|p|div|hr)\b[^>]*?)\s*style="[^"]*"/gi, "$1");
    return html;
  }

  function buildStyle() {
    return `
      <style>
        .ccfolia_wrap { background-color: ${wrapBg.value}; padding: 10px; }
        .msg_container { background: ${msgBg.value}; width: 40px; height: 40px; flex-shrink: 0; border-radius: 5px; display: flex; align-items: center; justify-content: center; }
        .msg_container img { width: 40px; height: 40px; object-fit: cover; border-radius: 5px; }
        span { background: ${wrapBg.value}; color: ${spanColor.value}; padding: ${spanPadding.value}px; }
        span, b { font-size: ${spanFontSize.value}px; font-family: ${fontFamily.value}; line-height: ${lineHeight.value}; }
        b { color: ${bColor.value}; font-weight: bold; }
        .gap { padding: ${gapPadding.value}px; align-items: ${gapAlign.value}; display: flex; gap: 10px; }
        .gap p { margin: ${pMargin.value}px 0; padding-left: ${pPaddingLeft.value}px; }
        hr { display: none !important; }
      </style>`;
  }

  function updatePreview() {
    const sanitized = sanitizeHTML(editor.value);
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">${buildStyle()}</head>
<body>${sanitized}</body></html>`;
    previewFrame.srcdoc = html;
  }

  editor.addEventListener("input", updatePreview);
  [spanBgColor, spanColor, spanPadding, spanFontSize, bColor, fontFamily, lineHeight,
   gapPadding, gapAlign, wrapBg, msgBg, pMargin, pPaddingLeft].forEach(el => el.addEventListener("input", updatePreview));

  beautifyBtn.addEventListener("click", () => {
    editor.value = editor.value.replace(/>\s*</g, '>\n<');
    updatePreview();
  });

  downloadBtn.addEventListener("click", () => {
    const out = `<!DOCTYPE html><html><head><meta charset="UTF-8">${buildStyle()}</head><body>${sanitizeHTML(editor.value)}</body></html>`;
    const blob = new Blob([out], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "modified.html";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  updatePreview();
});
