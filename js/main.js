document.addEventListener("DOMContentLoaded", function() {
  // 요소 선택
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
  // 실시간 미리보기
  // ----------------------------
  function updatePreview() {
  const style = `
    <style>
      /* 배경색 연동 */
      .ccfolia_wrap { background-color: ${wrapBg.value} !important; }
      .msg_container { background: ${msgBg.value} !important; }

      /* span: 배경은 wrapBg와 동일하게, 글자색은 spanColor, 글꼴 크기는 통합 */
      span {
        background: ${wrapBg.value} !important;
        color: ${spanColor.value} !important;
        padding: ${spanPadding.value}px !important;
        font-size: ${spanFontSize.value}px !important;
        font-family: ${fontFamily.value} !important;
        line-height: ${lineHeight.value} !important;
      }

      /* b: 글꼴 크기를 span과 통합 */
      b {
        font-size: ${spanFontSize.value}px !important;
        font-family: ${fontFamily.value} !important;
        line-height: ${lineHeight.value} !important;
      }

      /* 공통 적용 */
      span, b {
        font-family: ${fontFamily.value} !important;
        line-height: ${lineHeight.value} !important;
      }

      .gap {
        padding: ${gapPadding.value}px !important;
        align-items: ${gapAlign.value} !important;
        display: flex !important;
      }

      hr { display: none !important; }
    </style>
  `;
  previewFrame.srcdoc = "<!DOCTYPE html><html><head>" + style + "</head><body>" + editor.value + "</body></html>";
}


  editor.addEventListener("input", () => {
    htmlContent = editor.value;
    updatePreview();
  });

  [spanBgColor, spanColor, spanPadding, spanFontSize,
   bColor, fontFamily, lineHeight, gapPadding, gapAlign, wrapBg, msgBg
  ].forEach(el => el.addEventListener("input", updatePreview));

  // ----------------------------
  // 뷰티파이
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
    result = result.replace(/<hr[^>]*>/gi, '');
    return result.trim();
  }

  // ----------------------------
  // 다운로드
  // ----------------------------
  downloadBtn.addEventListener("click", () => {
    const blob = new Blob([editor.value], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modified.html";
    a.click();
    URL.revokeObjectURL(url);
  });
});
