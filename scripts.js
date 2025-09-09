const fileInput = document.getElementById("fileInput");
const editor = document.getElementById("editor");
const previewFrame = document.getElementById("previewFrame");
const beautifyBtn = document.getElementById("beautifyBtn");
const downloadBtn = document.getElementById("downloadBtn");

// 📌 HTML 뷰티파이 함수 (간단 들여쓰기)
function beautifyHTML(code) {
  const tab = "  ";
  let result = "", indent=0;

  code.split(/>\s*</).forEach((element, i, arr) => {
    if (element.match(/^\/\w/)) indent--;
    result += tab.repeat(indent) + "<" + element + ">\n";
    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("!")) indent++;
  });

  return result.trim();
}

// 📌 업로드 → 에디터에 넣기 + 미리보기 갱신
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

// 📌 에디터 수정 → 실시간 미리보기
editor.addEventListener("input", updatePreview);

function updatePreview() {
  previewFrame.srcdoc = editor.value;
}

// 📌 뷰티파이 버튼
beautifyBtn.addEventListener("click", () => {
  editor.value = beautifyHTML(editor.value);
  updatePreview();
});

// 📌 수정본 다운로드
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
