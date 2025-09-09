const fileInput = document.getElementById("fileInput");
const editor = document.getElementById("editor");
const previewFrame = document.getElementById("previewFrame");
const beautifyBtn = document.getElementById("beautifyBtn");
const downloadBtn = document.getElementById("downloadBtn");

// 스타일 컨트롤
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

// ----------------------------
// HTML 뷰티파이 함수
// ----------------------------
function beautifyHTML(code) {
  const tab = "  ";
  let result = "", indent=0;
  code.split(/>\s*</).forEach((element) => {
    if (element.match(/^\/\w/)) indent--;
    result += tab.repeat(indent) + "<" + element + ">\n";
    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("!")) indent++;
  });

  // 모든 <hr> 제거
  result = result.replace(/<hr[^>]*>/gi, '');
  return result.trim();
}

// ----------------------------
// 파일 업로드 → 에디터 + 미리보기
// ----------------------------
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    editor.value = event.target.result;
    updatePreview();
  };
  reader.readAsText(file);
});

// ----------------------------
// 에디터 입력 시 실시간 미리보기
// ----------------------------
editor.addEventListener("input", updatePreview);

// ----------------------------
// 스타일 변경 시 반영
// ----------------------------
[
  spanBgColor, spanColor, spanPadding, spanFontSize,
  bColor, fontFamily, lineHeight, gapPadding, gapAlign, wrapBg, msgBg
].forEach(el => el.addEventListener("input", updatePreview));

function updatePreview() {
  let html = editor.value;

  // 사용자 스타일 삽입
  const style = `
    <style>
      .ccfolia_wrap { background-color: ${wrapBg.value}; }
      .msg_container { background: ${msgBg.value}; }
      span { background: ${spanBgColor.value}; color: ${spanColor.value}; padding: ${spanPadding.value}px; font-size: ${spanFontSize.value}px; font-family: ${fontFamily.value}; line-height: ${lineHeight.value}; }
      b { color: ${bColor.value}; font-family: ${fontFamily.value}; line-height: ${lineHeight.value}; }
      span, b { font-family: ${fontFamily.value}; line-height: ${lineHeight.value}; }
      .gap { padding: ${gapPadding.value}px; align-items: ${gapAlign.value}; }
    </style>
  `;

  previewFrame.srcdoc = style + html;
}

// ----------------------------
// 뷰티파이 버튼
// ----------------------------
beautifyBtn.addEventListener("click", () => {
  editor.value = beautifyHTML(editor.value);
  updatePreview();
});

// ----------------------------
// 수정본 다운로드
// ----------------------------
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([editor.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "modified.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
