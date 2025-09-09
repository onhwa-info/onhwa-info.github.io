document.addEventListener("DOMContentLoaded", function () {
  // 요소 선택
  const fileInput = document.getElementById("fileInput");
  const editor = document.getElementById("editor");
  const previewFrame = document.getElementById("previewFrame");
  const beautifyBtn = document.getElementById("beautifyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const spanBgColor = document.getElementById("spanBgColor"); // UI는 남기되 wrapBg와 연동/비활성화
  const spanColor = document.getElementById("spanColor");
  const spanPadding = document.getElementById("spanPadding");
  const spanFontSize = document.getElementById("spanFontSize"); // span, b 공통 폰트 크기
  const fontFamily = document.getElementById("fontFamily");
  const lineHeight = document.getElementById("lineHeight");
  const gapPadding = document.getElementById("gapPadding");
  const gapAlign = document.getElementById("gapAlign");
  const wrapBg = document.getElementById("wrapBg");
  const msgBg = document.getElementById("msgBg");

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
  // 기존 스타일 제거(교체) 유틸
  // ----------------------------
  function stripConflictingStyles(html) {
    // 1) 문서 내 스타일/외부 CSS 제거
    html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");

    // 2) 우리가 관리하는 요소들의 인라인 style 제거 (교체 개념)
    html = html.replace(/(<span\b[^>]*?)\s*style="[^"]*"/gi, "$1");
    html = html.replace(/(<b\b[^>]*?)\s*style="[^"]*"/gi, "$1");
    html = html.replace(/(<[^>]*class="[^"]*\bgap\b[^"]*"[^>]*?)\s*style="[^"]*"/gi, "$1");
    html = html.replace(/(<[^>]*class="[^"]*\bccfolia_wrap\b[^"]*"[^>]*?)\s*style="[^"]*"/gi, "$1");
    html = html.replace(/(<[^>]*class="[^"]*\bmsg_container\b[^"]*"[^>]*?)\s*style="[^"]*"/gi, "$1");

    return html;
  }

  // ----------------------------
  // 우리 스타일 생성 (문서 끝에 삽입)
  // ----------------------------
  function hexToRgba(hex, alpha) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildStyle() {
  const wrapColor = hexToRgba(wrapBg.value, wrapAlpha.value);
  const msgColor  = hexToRgba(msgBg.value, msgAlpha.value);
  const fs = `${spanFontSize.value}px`;
  const lh = `${lineHeight.value}`;

  return `
    <style>
      .ccfolia_wrap { background-color: ${wrapColor}; }
      .msg_container { background: ${msgColor}; }
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

// 옵션 변경 시 → preview + editor 같이 갱신
function updatePreview(syncEditor = false) {
  const sanitized = stripConflictingStyles(editor.value);
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

  // 옵션 변경 시 editor도 반영
  if (syncEditor) editor.value = sanitized;
}

// 이벤트 연결
[
  spanColor, spanPadding, spanFontSize, fontFamily, lineHeight, 
  gapPadding, gapAlign, wrapBg, wrapAlpha, msgBg, msgAlpha
].forEach(el => el && el.addEventListener("input", () => updatePreview(true)));

// editor 수정 시 preview만 갱신
editor.addEventListener("input", () => updatePreview(false));

// 동기화 버튼 → 강제 반영
document.getElementById("syncBtn").addEventListener("click", () => updatePreview(true));

  [spanColor, spanPadding, spanFontSize, fontFamily, lineHeight, gapPadding, gapAlign, msgBg]
  .forEach((el) => el && el.addEventListener("input", updatePreview));

// wrapBg는 color input → change 이벤트도 추가
if (wrapBg) {
  wrapBg.addEventListener("input", updatePreview);
  wrapBg.addEventListener("change", updatePreview);
}


  // ----------------------------
  // 뷰티파이 (기존과 동일, <hr> 제거)
  // ----------------------------
  beautifyBtn.addEventListener("click", () => {
    htmlContent = beautifyHTML(editor.value);
    editor.value = htmlContent;
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
    result = result.replace(/<hr[^>]*>/gi, "");
    return result.trim();
  }

  // ----------------------------
  // 다운로드: 미리보기와 동일하게 '교체된 결과'를 저장
  // ----------------------------
  downloadBtn.addEventListener("click", () => {
    const sanitized = stripConflictingStyles(editor.value);
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
