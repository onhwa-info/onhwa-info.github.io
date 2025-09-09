const fileInput = document.getElementById("fileInput");
const editor = document.getElementById("editor");
const previewFrame = document.getElementById("previewFrame");
const beautifyBtn = document.getElementById("beautifyBtn");
const downloadBtn = document.getElementById("downloadBtn");

// ----------------------------
// HTML 뷰티파이 함수 (들여쓰기 정리)
// ----------------------------
function beautifyHTML(code) {
  const tab = "  ";
  let result = "", indent=0;

  // 단순히 태그 기준으로 들여쓰기
  code.split(/>\s*</).forEach((element) => {
    if (element.match(/^\/\w/)) indent--;
    result += tab.repeat(indent) + "<" + element + ">\n";
    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("!")) indent++;
  });

  return result.trim();
}

// ----------------------------
// 파일 업로드 → textarea에 표시 + 미리보기 갱신
// ----------------------------
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    editor.value = e.target.result;
    updatePreview();
  };
  reader.readAsText(file);
});

// ----------------------------
// textarea 입력 시 실시간 미리보기
// ----------------------------
editor.addEventListener("input", updatePreview);

function updatePreview() {
  previewFrame.srcdoc = editor.value;
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
