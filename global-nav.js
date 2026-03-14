/**
 * Tokyo Career Studio — Global Navigation Bar
 * 모든 페이지 최상단에 자동 삽입되는 글로벌 네비바
 */
(function () {
  const BASE = 'https://job-selection.vercel.app';

  const NAV_ITEMS = [
    { label: '직종 라이브러리', file: 'map-lv1.html',        icon: '🗺️' },
    { label: '업계 리포트',     file: 'industry-index.html', icon: '📋' },
    { label: '진단 테스트',     file: 'career-test.html',    icon: '🧭' },
  ];

  // 현재 파일명 감지
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  // ── 스타일 주입 ──────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #tcs-global-nav {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: rgba(8, 8, 14, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-family: 'Noto Sans KR', 'Noto Sans JP', sans-serif;
    }
    #tcs-global-nav .gnav-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 24px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    #tcs-global-nav .gnav-logo {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #555568;
      text-decoration: none;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    #tcs-global-nav .gnav-logo:hover { color: #b8b8cc; }
    #tcs-global-nav .gnav-logo span { color: #76768a; }
    #tcs-global-nav .gnav-links {
      display: flex;
      align-items: center;
      gap: 2px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    #tcs-global-nav .gnav-links::-webkit-scrollbar { display: none; }
    #tcs-global-nav .gnav-link {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      color: #555568;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.18s;
      border: 1px solid transparent;
    }
    #tcs-global-nav .gnav-link:hover {
      color: #b8b8cc;
      background: rgba(255,255,255,0.04);
    }
    #tcs-global-nav .gnav-link.active {
      color: #e8e8ed;
      background: rgba(255,255,255,0.07);
      border-color: rgba(255,255,255,0.1);
    }
    #tcs-global-nav .gnav-link .gnav-icon {
      font-size: 13px;
      line-height: 1;
    }
    /* 업계 리포트 개별 페이지 — 업계 리포트 탭 활성화 */
    #tcs-global-nav .gnav-link.active-parent {
      color: #8888a0;
      background: rgba(255,255,255,0.03);
    }

    /* 본문 상단 여백 제거 방지용 — 네비바 높이만큼 보정 */
    body { padding-top: 0 !important; }

    @media (max-width: 480px) {
      #tcs-global-nav .gnav-inner { padding: 0 14px; }
      #tcs-global-nav .gnav-link { padding: 5px 9px; font-size: 11px; }
      #tcs-global-nav .gnav-logo { font-size: 10px; }
    }
  `;
  document.head.appendChild(style);

  // ── 네비바 DOM 생성 ────────────────────────────────
  const nav = document.createElement('nav');
  nav.id = 'tcs-global-nav';

  const inner = document.createElement('div');
  inner.className = 'gnav-inner';

  // 로고
  const logo = document.createElement('a');
  logo.className = 'gnav-logo';
  logo.href = BASE + '/industry-index.html';
  logo.innerHTML = 'Tokyo <span>Career Studio</span>';
  inner.appendChild(logo);

  // 링크들
  const links = document.createElement('div');
  links.className = 'gnav-links';

  NAV_ITEMS.forEach(item => {
    const a = document.createElement('a');
    a.className = 'gnav-link';
    a.href = item.file;
    a.innerHTML = `<span class="gnav-icon">${item.icon}</span>${item.label}`;

    // 현재 페이지 활성화
    if (currentFile === item.file) {
      a.classList.add('active');
    }
    // 업계 리포트 개별 페이지일 때 "업계 리포트" 탭 부모 활성화
    else if (item.file === 'industry-index.html' && currentFile.endsWith('-report.html')) {
      a.classList.add('active-parent');
    }
    // 직종 카드 페이지일 때 "직종 라이브러리" 탭 부모 활성화
    else if (item.file === 'map-lv1.html' && !currentFile.endsWith('-report.html') && currentFile !== 'career-test.html' && currentFile !== 'industry-index.html' && currentFile !== 'map-lv1.html') {
      a.classList.add('active-parent');
    }

    links.appendChild(a);
  });

  inner.appendChild(links);
  nav.appendChild(inner);

  // ── body 최상단에 삽입 ─────────────────────────────
  document.body.insertBefore(nav, document.body.firstChild);

})();
