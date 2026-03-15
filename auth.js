(function () {
  const KEY = 'tcs_auth';
  if (localStorage.getItem(KEY) === 'ok') return;
  const file = location.pathname.split('/').pop() || 'industry-index.html';
  if (file === 'index.html' || file === '') return; // index는 통과
  localStorage.setItem('tcs_redirect', file);
  location.replace('/index.html');
})();
