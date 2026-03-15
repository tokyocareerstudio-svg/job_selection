/**
 * Tokyo Career Studio — Global Navigation Bar v4
 * 인증: sessionStorage 1회 → 탭 내 전 페이지 자유 이동
 */
(function () {

  const SESSION_KEY = 'tcs_auth';
  const PASSWORD    = 'tcs2025';
  const isAuthed    = () => sessionStorage.getItem(SESSION_KEY) === 'ok';

  const NAV_ITEMS = [
    { label: '진단 테스트',     file: 'career-test.html',    icon: '🧭', free: true  },
    { label: '업계 리포트',     file: 'industry-index.html', icon: '📋', free: false },
    { label: '직종 라이브러리', file: 'map-lv1.html',        icon: '🗺️', free: false },
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

    /* ── 모달 ── */
    #tcs-modal-overlay {
      display: none; position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,0,0,0.72); backdrop-filter: blur(6px);
      align-items: center; justify-content: center; padding: 24px;
    }
    #tcs-modal-overlay.open { display: flex; }
    #tcs-modal {
      background: #141419; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px; padding: 36px 32px 28px;
      width: 100%; max-width: 400px; text-align: center;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      animation: modal-in 0.22s ease;
    }
    @keyframes modal-in {
      from { opacity:0; transform: scale(0.94) translateY(8px); }
      to   { opacity:1; transform: scale(1) translateY(0); }
    }
    #tcs-modal .m-icon  { font-size: 32px; margin-bottom: 14px; }
    #tcs-modal .m-title { font-size: 17px; font-weight: 800; color: #e8e8ed; margin-bottom: 8px; }
    #tcs-modal .m-desc  { font-size: 12px; color: #8888a0; line-height: 1.7; margin-bottom: 20px; }
    #tcs-modal .m-input {
      width: 100%; padding: 12px 16px; background: #0a0a0f;
      border: 1px solid #2a2a35; border-radius: 10px;
      color: #e8e8ed; font-size: 15px; font-family: inherit;
      text-align: center; letter-spacing: 3px; outline: none;
      transition: border-color 0.2s; margin-bottom: 8px;
    }
    #tcs-modal .m-input:focus { border-color: rgba(162,155,254,0.5); }
    #tcs-modal .m-input.shake { animation: shake 0.4s ease; }
    @keyframes shake {
      0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}   60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
    }
    #tcs-modal .m-error {
      font-size: 11px; color: #e17055; margin-bottom: 14px;
      min-height: 16px; opacity: 0; transition: opacity 0.2s;
    }
    #tcs-modal .m-error.show { opacity: 1; }
    #tcs-modal .m-btn {
      width: 100%; padding: 12px; background: #a29bfe; color: #fff;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 700;
      font-family: inherit; cursor: pointer; transition: all 0.2s; margin-bottom: 10px;
    }
    #tcs-modal .m-btn:hover { background: #b8b3ff; }
    #tcs-modal .m-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 480px) {
      #tcs-gnav .gn-inner { padding: 0 14px; }
      #tcs-gnav .gn-link  { padding: 5px 9px; font-size: 11px; }
      #tcs-gnav .gn-logo  { font-size: 10px; }
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
      !['career-test.html','industry-index.html','map-lv1.html','index.html'].includes(currentFile)) {
      btn.classList.add('active-parent');
    }

    btn.addEventListener('click', () => {
      if (item.free || isAuthed()) location.href = item.file;
      else openModal(item.file);
    });
    links.appendChild(btn);
  });

  inner.appendChild(links);
  nav.appendChild(inner);
  document.body.insertBefore(nav, document.body.firstChild);

  // ── 모달 DOM ────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'tcs-modal-overlay';
  overlay.innerHTML = `
    <div id="tcs-modal">
      <div class="m-icon">🔐</div>
      <div class="m-title">수강생 전용 라이브러리</div>
      <div class="m-desc">Tokyo Career Studio 수강생 전용 콘텐츠입니다.<br>받으신 비밀번호를 입력해 주세요.</div>
      <input class="m-input" id="tcs-m-input" type="password" placeholder="비밀번호 입력">
      <div class="m-error" id="tcs-m-error">비밀번호가 올바르지 않습니다</div>
      <button class="m-btn" id="tcs-m-btn">입장하기</button>
    </div>`;
  document.body.appendChild(overlay);

  let pendingDest = '';

  function openModal(dest) {
    pendingDest = dest;
    const input = document.getElementById('tcs-m-input');
    input.value = '';
    input.classList.remove('shake');
    document.getElementById('tcs-m-error').classList.remove('show');
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 120);
  }

  // 전역 노출 (nav.js 사이드바에서 호출)
  window._tcsOpenModal = openModal;

  function tryEnter() {
    const input = document.getElementById('tcs-m-input');
    const btn   = document.getElementById('tcs-m-btn');
    if (input.value.trim() === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'ok');
      btn.textContent = '✓ 입장 중...';
      btn.disabled = true;
      overlay.classList.remove('open');
      location.href = pendingDest || currentFile;
    } else {
      document.getElementById('tcs-m-error').classList.add('show');
      input.classList.add('shake');
      input.select();
      setTimeout(() => input.classList.remove('shake'), 500);
    }
  }

  document.getElementById('tcs-m-btn').addEventListener('click', tryEnter);
  document.getElementById('tcs-m-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryEnter();
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  // ── 섹션 탭바 ────────────────────────────────────────
  const isSectionPage =
    /(-report|-overview|-eg\d|-se\d|-gi\d|-kk\d|-scm\d|-sv\d|-sk\d|-cr\d|-con\d)/.test(currentFile) ||
    /^(sales|se|tech|kikaku|logistics|service|sekou|creative|consul)-/.test(currentFile);

  if (isSectionPage) {
    window.addEventListener('DOMContentLoaded', () => {
      const sections = [];
      for (let i = 1; i <= 9; i++) {
        const el = document.getElementById('s' + i);
        if (!el) break;
        const titleEl = el.querySelector('.section-title');
        sections.push({ id: 's' + i, label: titleEl ? titleEl.textContent.trim() : 'S' + i });
      }
      if (sections.length < 2) return;

      const tabCss = document.createElement('style');
      tabCss.textContent = `
        #tcs-section-tabs { position:sticky; top:48px; z-index:9998; background:rgba(8,8,14,0.92); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.05); font-family:'Noto Sans KR',sans-serif; }
        #tcs-section-tabs .stabs-inner { max-width:1100px; margin:0 auto; padding:0 24px; display:flex; gap:2px; overflow-x:auto; scrollbar-width:none; height:40px; align-items:center; }
        #tcs-section-tabs .stabs-inner::-webkit-scrollbar { display:none; }
        #tcs-section-tabs .stab { flex-shrink:0; padding:5px 12px; border-radius:6px; font-size:11px; font-weight:500; color:#44445a; cursor:pointer; border:none; background:none; font-family:inherit; transition:all 0.18s; white-space:nowrap; }
        #tcs-section-tabs .stab:hover { color:#b8b8cc; background:rgba(255,255,255,0.04); }
        #tcs-section-tabs .stab.active { color:#e8e8ed; background:rgba(255,255,255,0.07); }
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
          window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 96, behavior: 'smooth' });
        });
        tabInner.appendChild(btn);
      });

      tabBar.appendChild(tabInner);
      const gnav = document.getElementById('tcs-gnav');
      if (gnav?.nextSibling) gnav.parentNode.insertBefore(tabBar, gnav.nextSibling);
      else document.body.insertBefore(tabBar, document.body.children[1]);

      function updateActiveTab() {
        let current = sections[0].id;
        sections.forEach(sec => {
          const el = document.getElementById(sec.id);
          if (el && el.getBoundingClientRect().top <= 96) current = sec.id;
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
