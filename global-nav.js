/**
 * Tokyo Career Studio — Global Navigation Bar v2
 * - 탭 순서: 진단 테스트 → 업계 리포트 → 직종 라이브러리
 * - 목록 페이지(industry-index, map-lv1)는 자유 열람
 * - 개별 리포트·직종 카드 클릭 시 비밀번호 모달 (미인증)
 * - 인증 후 sessionStorage 저장 → 세션 동안 자동 통과
 */
(function () {

  const SESSION_KEY = 'tcs_auth';
  const PASSWORD    = 'tcs2025';

  const NAV_ITEMS = [
    { label: '진단 테스트',     file: 'career-test.html',    icon: '🧭', free: true  },
    { label: '업계 리포트',     file: 'industry-index.html', icon: '📋', free: true  },
    { label: '직종 라이브러리', file: 'map-lv1.html',        icon: '🗺️', free: true  },
  ];

  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const isAuthed    = () => sessionStorage.getItem(SESSION_KEY) === 'ok';

  // 직접 URL 접근 차단 대상 (개별 콘텐츠 파일)
  const DIRECT_BLOCK = [
    /-report\.html$/,
    /^(sales|se|tech|kikaku|logistics|service|sekou|creative|consul)-(eg|se|gi|kk|scm|sv|sk|cr|con)\d/,
    /^(sales|se|tech|kikaku|logistics|service|sekou|creative|consul)-overview\.html$/,
  ];
  const isBlockedPage = DIRECT_BLOCK.some(p => p.test(currentFile));

  // ── 스타일 ─────────────────────────────────────────
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
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(6px);
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
    #tcs-modal .m-title { font-size: 17px; font-weight: 800; color: #e8e8ed; margin-bottom: 8px; letter-spacing: -0.3px; }
    #tcs-modal .m-desc  { font-size: 12px; color: #8888a0; line-height: 1.7; margin-bottom: 20px; }
    #tcs-modal .m-dest  {
      display: inline-block; font-size: 11px; font-weight: 600;
      color: #a29bfe; background: rgba(162,155,254,0.08);
      border: 1px solid rgba(162,155,254,0.2);
      padding: 4px 14px; border-radius: 20px; margin-bottom: 20px;
    }
    #tcs-modal .m-input {
      width: 100%; padding: 12px 16px; background: #0a0a0f;
      border: 1px solid #2a2a35; border-radius: 10px;
      color: #e8e8ed; font-size: 15px; font-family: inherit;
      text-align: center; letter-spacing: 3px; outline: none;
      transition: border-color 0.2s; margin-bottom: 8px;
    }
    #tcs-modal .m-input:focus  { border-color: rgba(162,155,254,0.5); }
    #tcs-modal .m-input.shake  { animation: shake 0.4s ease; }
    @keyframes shake {
      0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}   60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
    #tcs-modal .m-error {
      font-size: 11px; color: #e17055; margin-bottom: 14px;
      min-height: 16px; opacity: 0; transition: opacity 0.2s;
    }
    #tcs-modal .m-error.show { opacity: 1; }
    #tcs-modal .m-btn {
      width: 100%; padding: 12px; background: #a29bfe; color: #fff;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 700;
      font-family: inherit; cursor: pointer;
      transition: background 0.2s, opacity 0.2s; margin-bottom: 10px;
    }
    #tcs-modal .m-btn:hover    { background: #b8b3ff; }
    #tcs-modal .m-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #tcs-modal .m-cancel {
      font-size: 12px; color: #555568; cursor: pointer;
      background: none; border: none; font-family: inherit;
      padding: 4px 8px; transition: color 0.2s;
    }
    #tcs-modal .m-cancel:hover { color: #8888a0; }

    @media (max-width: 480px) {
      #tcs-gnav .gn-inner  { padding: 0 14px; }
      #tcs-gnav .gn-link   { padding: 5px 9px; font-size: 11px; }
      #tcs-gnav .gn-logo   { font-size: 10px; }
      #tcs-modal           { padding: 28px 20px 24px; }
    }
  `;
  document.head.appendChild(css);

  // ── 네비바 DOM ──────────────────────────────────────
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
    } else if (item.file === 'map-lv1.html' && isBlockedPage && !currentFile.endsWith('-report.html')) {
      btn.classList.add('active-parent');
    }

    btn.addEventListener('click', () => { location.href = item.file; });
    links.appendChild(btn);
  });

  inner.appendChild(links);
  nav.appendChild(inner);
  document.body.insertBefore(nav, document.body.firstChild);

  // ── 모달 DOM ───────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'tcs-modal-overlay';
  overlay.innerHTML = `
    <div id="tcs-modal">
      <div class="m-icon">🔐</div>
      <div class="m-title">수강생 전용 컨텐츠</div>
      <div class="m-desc">Tokyo Career Studio 수강생 전용 라이브러리입니다.<br>받으신 비밀번호를 입력해 주세요.</div>
      <div class="m-dest" id="tcs-m-dest"></div>
      <input class="m-input" id="tcs-m-input" type="password" placeholder="비밀번호 입력">
      <div class="m-error" id="tcs-m-error">비밀번호가 올바르지 않습니다</div>
      <button class="m-btn" id="tcs-m-btn">입장하기</button>
      <button class="m-cancel" id="tcs-m-cancel">닫기</button>
    </div>
  `;
  document.body.appendChild(overlay);

  let pendingDest = '';

  function openModal(dest, label) {
    pendingDest = dest;
    document.getElementById('tcs-m-dest').textContent = label;
    const input = document.getElementById('tcs-m-input');
    const err   = document.getElementById('tcs-m-error');
    input.value = '';
    input.classList.remove('shake');
    err.classList.remove('show');
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 120);
  }

  function tryEnter() {
    const input = document.getElementById('tcs-m-input');
    const err   = document.getElementById('tcs-m-error');
    const btn   = document.getElementById('tcs-m-btn');
    if (input.value.trim() === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'ok');
      btn.textContent = '✓ 인증됨';
      btn.disabled = true;
      setTimeout(() => {
        overlay.classList.remove('open');
        if (pendingDest) location.href = pendingDest;
        else location.reload();
      }, 300);
    } else {
      err.classList.add('show');
      input.classList.add('shake');
      input.select();
      setTimeout(() => input.classList.remove('shake'), 500);
    }
  }

  function closeModal() { overlay.classList.remove('open'); }

  document.getElementById('tcs-m-btn').addEventListener('click', tryEnter);
  document.getElementById('tcs-m-cancel').addEventListener('click', closeModal);
  document.getElementById('tcs-m-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryEnter();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // ── industry-index: 카드 클릭 인터셉트 ────────────
  // 카드 클릭 → 미인증이면 모달, 인증이면 그대로 이동
  if (currentFile === 'industry-index.html') {
    document.addEventListener('click', e => {
      if (isAuthed()) return;
      const card = e.target.closest('a.report-card');
      if (!card) return;
      e.preventDefault();
      const title = card.querySelector('.card-title')?.textContent.trim() || '업계 리포트';
      openModal(card.href, title + ' 리포트');
    });
  }

  // ── map-lv1: 직종 카드 링크 클릭 인터셉트 ─────────
  if (currentFile === 'map-lv1.html') {
    document.addEventListener('click', e => {
      if (isAuthed()) return;
      const link = e.target.closest('a.branch-item-link, a.overview-badge');
      if (!link) return;
      e.preventDefault();
      const label = link.querySelector('h4, .branch-name')?.textContent.trim()
                 || link.textContent.trim().slice(0, 20)
                 || '직종 카드';
      openModal(link.href, label);
    });
  }

  // ── 직접 URL 접근 방어 (개별 파일 직접 열기) ───────
  if (isBlockedPage && !isAuthed()) {
    document.addEventListener('DOMContentLoaded', () => {
      const label = document.title.split('|')[0].trim() || '컨텐츠';
      openModal('', label);
      // 닫기 버튼 → 인덱스로 이동
      document.getElementById('tcs-m-cancel').addEventListener('click', () => {
        const isReport = currentFile.endsWith('-report.html');
        location.href = isReport ? 'industry-index.html' : 'map-lv1.html';
      }, { once: true });
    });
  }



  // 대상 페이지 판별 — 섹션이 있는 리포트·직종 카드 파일
  const isSectionPage =
    /(-report|-overview|-eg\d|-se\d|-gi\d|-kk\d|-scm\d|-sv\d|-sk\d|-cr\d|-con\d)/.test(currentFile) ||
    currentFile.match(/^(sales|se|tech|kikaku|logistics|service|sekou|creative|consul)-/);

  if (!isSectionPage) return;

  // DOM 로드 후 섹션 수집
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

    // ── 탭바 CSS ──
    const css = document.createElement('style');
    css.textContent = `
      #tcs-section-tabs {
        position: sticky;
        top: 48px; /* global-nav 높이 */
        z-index: 9998;
        background: rgba(8,8,14,0.92);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255,255,255,0.05);
        font-family: 'Noto Sans KR','Noto Sans JP',sans-serif;
      }
      #tcs-section-tabs .stabs-inner {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        gap: 2px;
        overflow-x: auto;
        scrollbar-width: none;
        height: 40px;
        align-items: center;
      }
      #tcs-section-tabs .stabs-inner::-webkit-scrollbar { display: none; }
      #tcs-section-tabs .stab {
        flex-shrink: 0;
        padding: 5px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 500;
        color: #44445a;
        cursor: pointer;
        border: none;
        background: none;
        font-family: inherit;
        transition: all 0.18s;
        white-space: nowrap;
      }
      #tcs-section-tabs .stab:hover { color: #b8b8cc; background: rgba(255,255,255,0.04); }
      #tcs-section-tabs .stab.active { color: #e8e8ed; background: rgba(255,255,255,0.07); }
    `;
    document.head.appendChild(css);

    // ── 탭바 DOM ──
    const tabBar = document.createElement('div');
    tabBar.id = 'tcs-section-tabs';
    const inner = document.createElement('div');
    inner.className = 'stabs-inner';

    sections.forEach(sec => {
      const btn = document.createElement('button');
      btn.className = 'stab';
      btn.textContent = sec.label;
      btn.dataset.secId = sec.id;
      btn.addEventListener('click', () => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        const gnav  = document.getElementById('tcs-gnav');
        const stabs = document.getElementById('tcs-section-tabs');
        const offset = (gnav?.offsetHeight || 48) + (stabs?.offsetHeight || 40) + 8;
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - offset,
          behavior: 'smooth'
        });
      });
      inner.appendChild(btn);
    });

    tabBar.appendChild(inner);

    // global-nav 바로 뒤에 삽입
    const gnav = document.getElementById('tcs-gnav');
    if (gnav && gnav.nextSibling) {
      gnav.parentNode.insertBefore(tabBar, gnav.nextSibling);
    } else {
      document.body.insertBefore(tabBar, document.body.children[1]);
    }

    // ── 스크롤 시 현재 섹션 활성화 ──
    function updateActivetab() {
      const offset = 48 + 40 + 40;
      let current = sections[0].id;
      sections.forEach(sec => {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top <= offset) current = sec.id;
      });
      inner.querySelectorAll('.stab').forEach(btn => {
        const active = btn.dataset.secId === current;
        btn.classList.toggle('active', active);
        // 활성 탭 자동 스크롤 (탭바 내)
        if (active) {
          btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        }
      });
    }

    window.addEventListener('scroll', updateActivetab, { passive: true });
    updateActivetab();
  });


})();
