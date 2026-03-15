/**
 * Tokyo Career Studio — Auth Gate
 * 콘텐츠 페이지 최상단에서 호출
 * localStorage에 인증 기록 없으면 index.html로 리디렉트
 */
(function () {
  const KEY = 'tcs_auth';
  if (localStorage.getItem(KEY) !== 'ok') {
    // 현재 URL을 저장해뒀다가 인증 후 돌아오도록
    localStorage.setItem('tcs_redirect', location.pathname + location.search);
    location.replace('index.html');
  }
})();
