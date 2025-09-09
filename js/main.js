document.addEventListener("DOMContentLoaded", function () {
  // 요소 선택
  const fileInput = document.getElementById("fileInput");
  const editor = document.getElementById("editor");
  const previewFrame = document.getElementById("previewFrame");
  const downloadBtn = document.getElementById("downloadBtn");
  const syncBtn = document.getElementById("syncBtn");

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
  const msgAlpha = document.getElementById("msgAlpha");

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
  function stripStyles(html) {
    // <style>과 <link rel="stylesheet">만 제거
    html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");
    return html;
  }

  // ----------------------------
  // HEX + 알파 → RGBA 변환
  // ----------------------------
  function hexToRgba(hex, alpha) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ----------------------------
  // 스타일 생성
  // ----------------------------
  function buildStyle() {
    const fs = `${spanFontSize.value}px`;
    const lh = `${lineHeight.value}`;
    const msgColor = hexToRgba(msgBg.value, msgAlpha.value);

    return `
      <style>
        .ccfolia_wrap { background-color: ${wrapBg.value}; }
        .msg_container { background: ${msgColor}; }
        span {
          background: ${wrapBg.value};
          color: ${spanColor.value};
          padding: ${spanPadding.value}px;
          font-size: ${fs};
          font-family: ${fontFamily.value};
          line-height: ${lh};
        }
        b {
          color: ${bColor.value};
          font-size: ${fs};
          font-family: ${fontFamily.value};
          line-height: ${lh};
        }
        .gap {
          padding: ${gapPadding.value}px;
          align-items: ${gapAlign.value};
          display: flex;
        }
        hr { display: none; }
      </style>
    `;
  }

  // ----------------------------
  // 미리보기 업데이트
  // ----------------------------
  function updatePreview() {
    const sanitized = stripStyles(editor.value);
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

  // ----------------------------
  // 에디터 입력 → 미리보기 반영
  // ----------------------------
  editor.addEventListener("input", () => {
    htmlContent = editor.value;
    updatePreview();
  });

  // ----------------------------
  // 옵션 변경 → 미리보기 반영
  // ----------------------------
  [
    spanColor,
    spanPadding,
    spanFontSize,
    bColor,
    fontFamily,
    lineHeight,
    gapPadding,
    gapAlign,
    wrapBg,
    msgBg,
    msgAlpha,
  ].forEach((el) => el && el.addEventListener("input", updatePreview));

  // ----------------------------
  // 수동 동기화 버튼
  // ----------------------------
  syncBtn.addEventListener("click", updatePreview);

  // ----------------------------
  // 다운로드
  // ----------------------------
  downloadBtn.addEventListener("click", () => {
    const sanitized = stripStyles(editor.value);
    const out = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">${buildStyle()}</head>
<body>
${sanitized}
</body>
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
