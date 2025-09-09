document.addEventListener("DOMContentLoaded", function() {
  // 요소 선택
  const fileInput = document.getElementById("fileInput");
  const editor = document.getElementById("editor");
  const previewFrame = document.getElementById("previewFrame");
  const downloadBtn = document.getElementById("downloadBtn");
  const syncBtn = document.getElementById("syncBtn");

  const wrapBg = document.getElementById("wrapBg");
  const msgBg = document.getElementById("msgBg");
  const spanColor = document.getElementById("spanColor");
  const spanPadding = document.getElementById("spanPadding");
  const spanFontSize = document.getElementById("spanFontSize");
  const bColor = document.getElementById("bColor");
  const fontFamily = document.getElementById("fontFamily");
  const lineHeight = document.getElementById("lineHeight");
  const gapPadding = document.getElementById("gapPadding");
  const gapAlign = document.getElementById("gapAlign");
  const pMargin = document.getElementById("pMargin");
  const pPaddingLeft = document.getElementById("pPaddingLeft");

  let htmlContent = "";

  // ----------------------------
  // HTML 파일 읽기
  // ----------------------------
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      htmlContent = event.target.result;
      editor.value = htmlContent;
      updatePreview();
    };
    reader.readAsText(file);
  });

  // ----------------------------
  // 기존 스타일 제거
  // ----------------------------
  function sanitizeHTML(html) {
    html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");
    html = html.replace(/(<(span|b|p|div|hr)\b[^>]*?)\s*style="[^"]*"/gi, "$1");
    return html;
  }

  // ----------------------------
  // 스타일 빌드
  // ----------------------------
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

  // ----------------------------
  // 미리보기 업데이트
  // ----------------------------
  function updatePreview() {
    const sanitized = sanitizeHTML(editor.value);
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">${buildStyle()}</head>
<body>${sanitized}</body></html>`;
    previewFrame.srcdoc = html;
  }

  // ----------------------------
  // 이벤트 바인딩
  // ----------------------------
  editor.addEventListener("input", updatePreview);

  [
    wrapBg, msgBg, spanColor, spanPadding, spanFontSize,
    bColor, fontFamily, lineHeight, gapPadding, gapAlign,
    pMargin, pPaddingLeft
  ].forEach(el => el.addEventListener("input", updatePreview));

  // ----------------------------
  // 다운로드
  // ----------------------------
  downloadBtn.addEventListener("click", () => {
    const out = `<!DOCTYPE html><html><head><meta charset="UTF-8">${buildStyle()}</head><body>${sanitizeHTML(editor.value)}</body></html>`;
    const blob = new Blob([out], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "modified.html";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // ----------------------------
  // 동기화 버튼
  // ----------------------------
  syncBtn.addEventListener("click", () => {
    htmlContent = editor.value;
    updatePreview();
  });

  // 초기 렌더링
  updatePreview();
});
