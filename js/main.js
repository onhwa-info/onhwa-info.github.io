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

  let htmlContent = "";

  // HTML 파일 읽기
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

  // 기존 스타일 제거 + inline style 제거
  function sanitizeHTML(html) {
    html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");
    html = html.replace(/\s*style="[^"]*"/gi, "");
    return html;
  }

  // 스타일 빌드
  function buildStyle() {
    return `
      <style>
        .ccfolia_wrap { background-color: ${wrapBg.value}; }
        .msg_container { background: ${msgBg.value}; }
        span { 
          background: ${wrapBg.value}; 
          color: ${spanColor.value}; 
          padding: ${spanPadding.value}px; 
        }
        span, b { 
          font-size: ${spanFontSize.value}px; 
          font-family: ${fontFamily.value}; 
          line-height: ${lineHeight.value}; 
        }
        b { color: ${bColor.value}; font-weight: bold; }
        .gap { 
          padding: ${gapPadding.value}px; 
          align-items: ${gapAlign.value}; 
          display: flex; 
        }
        .gap p {
          margin: ${pMargin.value}px 0;
          padding-left: ${pPaddingLeft.value}px;
        }
        hr { display: none !important; }
      </style>
    `;
  }

  // 미리보기 업데이트
  function updatePreview() {
    const sanitized = sanitizeHTML(editor.value);
    const style = buildStyle();
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
${style}
</head>
<body>
${sanitized}
</body>
</html>`;
    previewFrame.srcdoc = html;
  }

  editor.addEventListener("input", updatePreview);
  [spanBgColor, spanColor, spanPadding, spanFontSize,
   bColor, fontFamily, lineHeight, gapPadding, gapAlign, wrapBg, msgBg, pMargin, pPaddingLeft
  ].forEach(el => el.addEventListener("input", updatePreview));

  // 뷰티파이
  beautifyBtn.addEventListener("click", () => {
    editor.value = beautifyHTML(editor.value);
    updatePreview();
  });

  function beautifyHTML(code) {
    const tab = "  ";
    let result = "", indent = 0;
    code.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) indent--;
      result += tab.repeat(indent) + "<" + element + ">\n";
      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("!")) indent++;
    });
    return result.replace(/<hr[^>]*>/gi, '').trim();
  }

  // 다운로드
  downloadBtn.addEventListener("click", () => {
    const sanitized = sanitizeHTML(editor.value);
    const out = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">${buildStyle()}</head>
<body>${sanitized}</body>
</html>`;
    const blob = new Blob([out], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modified.html";
    a.click();
    URL.revokeObjectURL(url);
  });

  // 초기 렌더
  updatePreview();
});
