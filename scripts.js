const fileInput = document.getElementById("fileInput");
const editor = document.getElementById("editor");
const previewFrame = document.getElementById("previewFrame");

// 옵션 요소들
const fontSize = document.getElementById("fontSize");
const fontFamily = document.getElementById("fontFamily");
const lineHeight = document.getElementById("lineHeight");
const bColor = document.getElementById("bColor");
const gapPadding = document.getElementById("gapPadding");
const wrapBg = document.getElementById("wrapBg");
const msgBg = document.getElementById("msgBg");
const buttonBg = document.getElementById("buttonBg");
const buttonPadding = document.getElementById("buttonPadding");
const removeHrBtn = document.getElementById("removeHr");
const downloadBtn = document.getElementById("downloadHtml");

let originalHtml = "";

// 파일 업로드 → 코드 로드
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file && file.name.endsWith(".html")) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      originalHtml = ev.target.result;
      editor.value = originalHtml;
      updatePreview();
    };
    reader.readAsText(file, "UTF-8");
  } else {
    alert("HTML 파일만 업로드 가능합니다!");
  }
});

// 에디터 변경 시 미리보기 업데이트
editor.addEventListener("input", updatePreview);

// 옵션 변경 시 적용
[fontSize, fontFamily, lineHeight, bColor, gapPadding, wrapBg, msgBg, buttonBg, buttonPadding].forEach(input => {
  input.addEventListener("input", applyBeautify);
});

// hr 삭제 버튼
removeHrBtn.addEventListener("click", () => {
  editor.value = editor.value.replace(/<hr[^>]*>/g, "");
  updatePreview();
});

// 다운로드 버튼
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([editor.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "beautified.html";
  a.click();
  URL.revokeObjectURL(url);
});

// Beautify 적용 함수
function applyBeautify() {
  let html = editor.value;

  // span, b
  html = html.replace(/span, b\s*{[^}]*}/, `span, b {
    font-size: ${fontSize.value}px;
    font-family: '${fontFamily.value}', sans-serif;
    line-height: ${lineHeight.value};
  }`);

  // b
  html = html.replace(/b\s*{[^}]*}/, `b {
    color: ${bColor.value};
    font-size: 9pt;
    font-weight: 200;
  }`);

  // gap
  html = html.replace(/\.gap\s*{[^}]*}/, `.gap {
    gap: 15px;
    display: flex;
    -webkit-box-pack: start;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    text-decoration: none;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
    padding: ${gapPadding.value};
  }`);

  // ccfolia_wrap
  html = html.replace(/\.ccfolia_wrap\s*{[^}]*}/, `.ccfolia_wrap {
    position: relative;
    padding: 10px !important;
    background-color: ${wrapBg.value};
    color: #fefefe;
  }`);

  // msg_container
  html = html.replace(/\.msg_container\s*{[^}]*}/, `.msg_container {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: ${msgBg.value};
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }`);

  // 버튼(span)
  html = html.replace(/span\s*style="[^"]*background:[^;]*;[^"]*padding:[^;]*;[^"]*"/g,
    (match) => match
      .replace(/background:[^;]*/g, `background: ${buttonBg.value}`)
      .replace(/padding:[^;]*/g, `padding: ${buttonPadding.value}`)
  );

  editor.value = html;
  updatePreview();
}

// 미리보기 업데이트
function updatePreview() {
  previewFrame.srcdoc = editor.value;
}
