document.addEventListener("DOMContentLoaded", function () {
  // 요소 선택
  const fileInput = document.getElementById("fileInput");
  const editor = document.getElementById("editor");
  const previewFrame = document.getElementById("previewFrame");
  const downloadBtn = document.getElementById("downloadBtn");
  const syncBtn = document.getElementById("syncBtn");

  const spanColor = document.getElementById("spanColor");
  const spanPadding = document.getElementById("spanPadding");
  const fontSize = document.getElementById("fontSize");
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
  // 기존 스타일 제거(교체용)
  // ----------------------------
  function stripStyles(html) {
    // <style>, <link rel="stylesheet"> 제거
    html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");

    // 특정 태그의 인라인 스타일 제거 (span 제외)
    html = html.replace(/(<b\b[^>]*?)\s*style="[^"]*"/gi, "$1");
    html = html.replace(/(<[^>]*class="[^"]*\bgap\b[^"]*"[^>]*?)\s*style="[^"]*"/gi, "$1");
    html = html.replace(/(<[^>]*class="[^"]*\bccfolia_wrap\b[^"]*"[^>]*?)\s*style="[^"]*"/gi, "$1");
    html = html.replace(/(<[^>]*class="[^"]*\bmsg_container\b[^"]*"[^>]*?)\s*style="[^"]*"/gi, "$1");

    return html;
  }

  // ----------------------------
  // HEX → RGBA 변환
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
    const wrapColor = wrapBg.value; // 투명도 없는 wrap 배경
    const msgColor = hexToRgba(msgBg.value, msgAlpha.value);
    const fs = `${fontSize.value}px`;
    const lh = `${lineHeight.value}`;

    return `
      <style>
        .ccfolia_wrap {
          background-color: ${wrapColor};
        }
        .msg_container {
          background: ${msgColor};
        }
        span {
          background: ${wrapColor};
          color: ${spanColor.value};
          padding: ${spanPadding.value}px;
          font-size: ${fs};
          font-family: ${fontFamily.value};
          line-height: ${lh};
        }
        b {
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
  // 미리보기 갱신
  // ----------------------------
  function updatePreview(syncEditor = false) {
    const sanitized = stripStyles(editor.value);
    const style = buildStyle();

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
${sanitized}
${style}
</body>
</html>`;

    previewFrame.srcdoc = html;

    if (syncEditor) {
      editor.value = `${sanitized}\n${style}`;
    }
  }

  // ----------------------------
  // 이벤트 연결
  // ----------------------------
  [
    spanColor, spanPadding, fontSize, fontFamily, lineHeight,
    gapPadding, gapAlign, wrapBg, msgBg, msgAlpha
  ].forEach(el => el && el.addEventListener("input", () => updatePreview(true)));

  editor.addEventListener("input", () => updatePreview(false));
  syncBtn.addEventListener("click", () => updatePreview(true));

  // ----------------------------
  // 다운로드
  // ----------------------------
  downloadBtn.addEventListener("click", () => {
    const sanitized = stripStyles(editor.value);
    const out = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
${sanitized}
${buildStyle()}
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
