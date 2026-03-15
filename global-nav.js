/**
 * Tokyo Career Studio — Global Navigation Bar v3
 * 인증은 auth.js(localStorage)로 일원화
 * 이 파일은 순수 네비게이션만 담당
 */
(function () {

  const NAV_ITEMS = [
    { label: '진단 테스트',     file: 'career-test.html',    icon: '🧭' },
    { label: '업계 리포트',     file: 'industry-index.html', icon: '📋' },
    { label: '직종 라이브러리', file: 'map-lv1.html',        icon: '🗺️' },
  ];

  const currentFile = location.pathname.split('/').pop() || 'index.html';

  // ── 스타일 ──────────────────────────────────────────
  const css = document.createElement('style');
  css.textContent = `
    #tcs-gnav {
      position: sticky; top: 0; z-index: 9999;
      background: rgba(8,8,14,0.94);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-family: 'Noto Sans KR','Noto Sans JP',sans-serif;
    }
    #tcs-gnav .gn-inner {
      max-width: 1100px; margin: 0 auto; padding: 0 24px;
      height: 48px; display: flex; align-items: center;
      justify-content: space-between; gap: 8px;
    }
    #tcs-gnav .gn-logo {
      font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
      color: #555568; text-decoration: none; text-transform: uppercase;
      white-space: nowrap; flex-shrink: 0; transition: color 0.2s;
    }
    #tcs-gnav .gn-logo:hover { color: #b8b8cc; }
    #tcs-gnav .gn-logo span { color: #76768a; }
    #tcs-gnav .gn-links {
      display: flex; align-items: center; gap: 2px;
      overflow-x: auto; scrollbar-width: none;
    }
    #tcs-gnav .gn-links::-webkit-scrollbar { display: none; }
    #tcs-gnav .gn-link {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px;
      font-size: 12px; font-weight: 500; color: #555568;
      text-decoration: none; white-space: nowrap;
      transition: all 0.18s; border: 1px solid transparent;
      cursor: pointer; background: none; font-family: inherit;
    }
    #tcs-gnav .gn-link:hover { color: #b8b8cc; background: rgba(255,255,255,0.04); }
    #tcs-gnav .gn-link.active { color: #e8e8ed; background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.1); }
    #tcs-gnav .gn-link.active-parent { color: #8888a0; background: rgba(255,255,255,0.03); }

    @media (max-width: 480px) {
      #tcs-gnav .gn-inner  { padding: 0 14px; }
      #tcs-gnav .gn-link   { padding: 5px 9px; font-size: 11px; }
      #tcs-gnav .gn-logo   { font-size: 10px; }
    }
  `;
  document.head.appendChild(css);

  // ── 네비바 DOM ─────────────────────────────────────
  const nav = document.createElement('nav');
  nav.id = 'tcs-gnav';
  const inner = document.createElement('div');
  inner.className = 'gn-inner';

  const logo = document.createElement('a');
  logo.className = 'gn-logo';
  logo.href = 'index.html';
  logo.innerHTML = 'Tokyo <span>Career Studio</span>';
  inner.appendChild(logo);

  const links = document.createElement('div');
  links.className = 'gn-links';

  NAV_ITEMS.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'gn-link';
    btn.innerHTML = `<span>${item.icon}</span>${item.label}`;

    if (currentFile === item.file) {
      btn.classList.add('active');
    } else if (item.file === 'industry-index.html' && currentFile.endsWith('-report.html')) {
      btn.classList.add('active-parent');
    } else if (item.file === 'map-lv1.html' &&
      !currentFile.endsWith('-report.html') &&
      currentFile !== 'career-test.html' &&
      currentFile !== 'industry-index.html' &&
      currentFile !== 'map-lv1.html' &&
      currentFile !== 'index.html') {
      btn.classList.add('active-parent');
    }

    btn.addEventListener('click', () => { location.href = item.file; });
    links.appendChild(btn);
  });

  inner.appendChild(links);
  nav.appendChild(inner);
  document.body.insertBefore(nav, document.body.firstChild);

  // ── 섹션 탭바 자동 생성 ──────────────────────────────
  const isSectionPage =
    /(-report|-overview|-eg\d|-se\d|-gi\d|-kk\d|-scm\d|-sv\d|-sk\d|-cr\d|-con\d)/.test(currentFile) ||
    currentFile.match(/^(sales|se|tech|kikaku|logistics|service|sekou|creative|consul)-/);

  if (isSectionPage) {
    window.addEventListener('DOMContentLoaded', () => {
      const sections = [];
      for (let i = 1; i <= 9; i++) {
        const el = document.getElementById('s' + i);
        if (!el) break;
        const titleEl = el.querySelector('.section-title');
        const label = titleEl ? titleEl.textContent.trim() : 'S' + i;
        sections.push({ id: 's' + i, label });
      }
      if (sections.length < 2) return;

      const tabCss = document.createElement('style');
      tabCss.textContent = `
        #tcs-section-tabs {
          position: sticky; top: 48px; z-index: 9998;
          background: rgba(8,8,14,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-family: 'Noto Sans KR','Noto Sans JP',sans-serif;
        }
        #tcs-section-tabs .stabs-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
          display: flex; gap: 2px; overflow-x: auto;
          scrollbar-width: none; height: 40px; align-items: center;
        }
        #tcs-section-tabs .stabs-inner::-webkit-scrollbar { display: none; }
        #tcs-section-tabs .stab {
          flex-shrink: 0; padding: 5px 12px; border-radius: 6px;
          font-size: 11px; font-weight: 500; color: #44445a;
          cursor: pointer; border: none; background: none;
          font-family: inherit; transition: all 0.18s; white-space: nowrap;
        }
        #tcs-section-tabs .stab:hover { color: #b8b8cc; background: rgba(255,255,255,0.04); }
        #tcs-section-tabs .stab.active { color: #e8e8ed; background: rgba(255,255,255,0.07); }
      `;
      document.head.appendChild(tabCss);

      const tabBar = document.createElement('div');
      tabBar.id = 'tcs-section-tabs';
      const tabInner = document.createElement('div');
      tabInner.className = 'stabs-inner';

      sections.forEach(sec => {
        const btn = document.createElement('button');
        btn.className = 'stab';
        btn.textContent = sec.label;
        btn.dataset.secId = sec.id;
        btn.addEventListener('click', () => {
          const el = document.getElementById(sec.id);
          if (!el) return;
          const offset = 48 + 40 + 8;
          window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
        });
        tabInner.appendChild(btn);
      });

      tabBar.appendChild(tabInner);
      const gnav = document.getElementById('tcs-gnav');
      if (gnav && gnav.nextSibling) gnav.parentNode.insertBefore(tabBar, gnav.nextSibling);
      else document.body.insertBefore(tabBar, document.body.children[1]);

      function updateActiveTab() {
        const offset = 48 + 40 + 40;
        let current = sections[0].id;
        sections.forEach(sec => {
          const el = document.getElementById(sec.id);
          if (el && el.getBoundingClientRect().top <= offset) current = sec.id;
        });
        tabInner.querySelectorAll('.stab').forEach(btn => {
          const active = btn.dataset.secId === current;
          btn.classList.toggle('active', active);
          if (active) btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });
      }

      window.addEventListener('scroll', updateActiveTab, { passive: true });
      updateActiveTab();
    });
  }

})();
