(function () {
  const KEY = 'tcs_auth';
  if (localStorage.getItem(KEY) === 'ok') return; // 인증됨 → 통과

  // 현재 파일명만 저장 (절대경로 X)
  const file = location.pathname.split('/').pop() || 'industry-index.html';
  localStorage.setItem('tcs_redirect', file);

  // index.html 기준 상대경로로 이동
  const depth = location.pathname.split('/').length - 2;
  const back  = depth > 0 ? '../'.repeat(depth) : '';
  location.replace(back + 'index.html');
})();
