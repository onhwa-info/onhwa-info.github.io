const iframe = document.getElementById('preview');
const fileInput = document.getElementById('fileInput');

// 샘플 파일 기본 로드
fetch("sample_log.html")
  .then(res => res.text())
  .then(html => {
    iframe.srcdoc = html;
  });

// 파일 업로드 → 미리보기 로드
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    iframe.srcdoc = e.target.result;  // iframe에 업로드한 html 반영
  };
  reader.readAsText(file);
});

// HR 삭제 기능
function removeHR() {
  const doc = iframe.contentDocument;
  if (!doc) return;
  doc.querySelectorAll("hr").forEach(el => el.remove());
}

// 스타일 변경 적용
function applyChanges() {
  const doc = iframe.contentDocument;
  if (!doc) return;

  // 판정 span 스타일
  doc.querySelectorAll('span[style*="background"]').forEach(span => {
    span.style.background = document.getElementById('spanBg').value;
    span.style.padding = document.getElementById('spanPadding').value + "px";
  });

  // 전역 폰트
  doc.querySelectorAll("span, b").forEach(el => {
    el.style.fontSize = document.getElementById('fontSize').value + "px";
    el.style.fontFamily = document.getElementById('fontFamily').value;
    el.style.lineHeight = document.getElementById('lineHeight').value;
  });

  // gap 수정
  doc.querySelectorAll(".gap").forEach(el => {
    el.style.padding = document.getElementById('gapPadding').value + "px";
    el.style.alignItems = "center";
  });

  // b 태그 색상
  doc.querySelectorAll("b").forEach(el => {
    el.style.color = document.getElementById('bColor').value;
  });

  // ccfolia_wrap 배경색
  const wrap = doc.querySelector(".ccfolia_wrap");
  if (wrap) wrap.style.backgroundColor = document.getElementById('wrapBg').value;
}
