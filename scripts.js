const fileInput = document.getElementById("fileInput");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const clearBtn = document.getElementById("clearBtn");
const beautifyBtn = document.getElementById("beautifyBtn");

// 파일 업로드 → textarea에 넣기
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

// textarea 수정 시 → 미리보기 갱신
editor.addEventListener("input", updatePreview);

// 미리보기 갱신
function updatePreview() {
  const rawText = editor.value;

  // 로그 강조 규칙 (예시)
  const formatted = rawText
    .replace(/\[ERROR\]/g, '<span style="color:red; font-weight:bold;">[ERROR]</span>')
    .replace(/\[WARN\]/g, '<span style="color:orange; font-weight:bold;">[WARN]</span>')
    .replace(/\[INFO\]/g, '<span style="color:blue;">[INFO]</span>');

  preview.innerHTML = formatted;
}

// 뷰티파이어 (간단 버전: JSON 로그 자동 정렬 + 공백 정리)
beautifyBtn.addEventListener("click", () => {
  let text = editor.value;

  // JSON 라인 찾기 → 예쁘게 들여쓰기
  const beautified = text.split("\n").map(line => {
    line = line.trim();

    // JSON 라인인 경우
    if (line.startsWith("{") && line.endsWith("}")) {
      try {
        const obj = JSON.parse(line);
        return JSON.stringify(obj, null, 2); // 들여쓰기 2칸
      } catch (e) {
        return line; // 파싱 실패 → 그대로 둠
      }
    }

    // 날짜 + 로그 패턴 정리 (예: "2025-09-09 12:00:00 [INFO] ..." → 잘 정렬)
    const match = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (.*)$/);
    if (match) {
      return `${match[1]}    ${match[2]}`;
    }

    return line;
  }).join("\n");

  editor.value = beautified;
  updatePreview();
});

// 지우기 버튼
clearBtn.addEventListener("click", () => {
  editor.value = "";
  preview.innerHTML = "";
  fileInput.value = "";
});
