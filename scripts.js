const iframe = document.getElementById('preview');
const fileInput = document.getElementById('fileInput');

// 파일 업로드 → 미리보기 로드
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    iframe.srcdoc = e.target.result;
  };
  reader.readAsText(file);
});

// 샘플 파일 기본 로드
fetch("sample_log.html")
  .then(res => res.text())
  .then(html => { iframe.srcdoc = html; });

function removeHR() {
  const doc = iframe.contentDocument;
  doc.querySelectorAll("hr").forEach(el => el.remove());
}

function applyChanges() {
  const doc = iframe.contentDocument;

  // 판정 span 스타일
  const spanStyle = doc.querySelector('span[style*="background"]');
  if (spanStyle) {
    spanStyle.style.background = document.getElementById('spanBg').value;
    spanStyle.style.padding = document.getElementById('spanPadding').value + "px";
  }

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
