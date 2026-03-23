/**
 * Tokyo Career Studio — 적성검사 대책 Navigation v1
 * SPI / 玉手箱 / TG-WEB 시험별 사이드바 네비게이션
 */
(function () {

  const currentFile = location.pathname.split('/').pop() || 'index.html';

  // ── 시험별 TOC ──
  const EXAMS = [
    {
      id: 'spi',
      label: 'SPI',
      icon: '📝',
      index: 'spi-index.html',
      children: [
        { label: 'SPI 전체 가이드', file: 'spi-index.html', isBold: true },
        { label: '🎯 미니 모의고사', file: 'quiz-spi.html' },
        { label: '📝 풀 모의고사 (35문)', file: 'spi-fullquiz.html' },
        { label: '── 언어', isHeader: true },
        { label: '언어 개요', file: 'spi-gengo-index.html' },
        { label: '① 어구의 의미', file: 'spi-gengo-goku.html' },
        { label: '② 두 단어 관계', file: 'spi-gengo-nigo.html' },
        { label: '③ 어구의 용법', file: 'spi-gengo-youhou.html' },
        { label: '④ 숙어의 구성', file: 'spi-gengo-jukugo.html' },
        { label: '⑤ 문장 배열', file: 'spi-gengo-narabikae.html' },
        { label: '⑥ 장문 독해', file: 'spi-gengo-dokkai.html' },
        { label: '── 비언어 (수리)', isHeader: true },
        { label: '비언어 개요', file: 'spi-higengo-index.html' },
        { label: '① 추론', file: 'spi-higengo-suiron.html' },
        { label: '② 확률', file: 'spi-higengo-kakuritsu.html' },
        { label: '③ 손익산', file: 'spi-higengo-soneki.html' },
        { label: '④ 속도산', file: 'spi-higengo-sokudo.html' },
        { label: '⑤ 집합', file: 'spi-higengo-shugo.html' },
        { label: '⑥ 정수', file: 'spi-higengo-seisu.html' },
        { label: '── 성격검사', isHeader: true },
        { label: '🧠 SPI 성격검사', file: 'spi-seikaku.html' },
        { label: '── 영어 (ENG)', isHeader: true },
        { label: '🇬🇧 영어검사 대책', file: 'spi-english.html' },
      ]
    },
    {
      id: 'tamatebako',
      label: '玉手箱',
      icon: '📦',
      index: 'tama-index.html',
      children: [
        { label: '玉手箱 전체 가이드', file: 'tama-index.html', isBold: true },
        { label: '🎯 미니 모의고사', file: 'quiz-tama.html' },
        { label: '📝 풀 모의고사 (30문)', file: 'tama-fullquiz.html' },
        { label: '── 언어 (言語)', isHeader: true },
        { label: '언어 개요', file: 'tama-gengo-index.html' },
        { label: '① GAB형 논리적독해', file: 'tama-gengo-gab.html' },
        { label: '② IMAGES형 취지판정', file: 'tama-gengo-images.html' },
        { label: '③ 취지파악', file: 'tama-gengo-shushi.html' },
        { label: '── 계수 (計数)', isHeader: true },
        { label: '계수 개요', file: 'tama-keisu-index.html' },
        { label: '① 사칙역산', file: 'tama-keisu-shisoku.html' },
        { label: '② 도표읽기', file: 'tama-keisu-zuhyo.html' },
        { label: '③ 표빈칸추측', file: 'tama-keisu-kuukan.html' },
        { label: '── 성격검사', isHeader: true },
        { label: '🧠 玉手箱 OPQ', file: 'tama-seikaku.html' },
      ]
    },
    {
      id: 'tgweb',
      label: 'TG-WEB',
      icon: '🌐',
      index: 'tgweb-index.html',
      children: [
        { label: 'TG-WEB 전체 가이드', file: 'tgweb-index.html', isBold: true },
        { label: '🎯 미니 모의고사', file: 'quiz-tgweb.html' },
        { label: '📝 풀 모의고사 (25문)', file: 'tgweb-fullquiz.html' },
        { label: '── 언어 (言語)', isHeader: true },
        { label: '언어 개요', file: 'tgweb-gengo-index.html' },
        { label: '① 종래형 (공란·나열·장문)', file: 'tgweb-gengo-juurai.html' },
        { label: '② 신형 (동의어·속담)', file: 'tgweb-gengo-shingata.html' },
        { label: '── 계수 (計数)', isHeader: true },
        { label: '계수 개요', file: 'tgweb-keisu-index.html' },
        { label: '① 종래형 (도형·추론·암호)', file: 'tgweb-keisu-juurai.html' },
        { label: '② 신형 (사칙역산·도표)', file: 'tgweb-keisu-shingata.html' },
        { label: '── 성격검사', isHeader: true },
        { label: '🧠 TG-WEB 성격검사', file: 'tgweb-seikaku.html' },
      ]
    },
  ];

  // 현재 파일이 어느 시험에 속하는지 판별
  function getActiveExam() {
    for (const exam of EXAMS) {
      for (const c of exam.children) {
        if (c.file && c.file === currentFile) return exam.id;
      }
    }
    return 'spi'; // default
  }

  const activeExamId = getActiveExam();

  // ── 폰트 로드 ──
  if (!document.querySelector('link[data-tcs-font]')) {
    const pc1 = document.createElement('link'); pc1.rel='preconnect'; pc1.href='https://fonts.googleapis.com'; pc1.dataset.tcsFont='1'; document.head.appendChild(pc1);
    const pc2 = document.createElement('link'); pc2.rel='preconnect'; pc2.href='https://fonts.gstatic.com'; pc2.crossOrigin='anonymous'; document.head.appendChild(pc2);
    const fl = document.createElement('link'); fl.rel='stylesheet'; fl.href='https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap'; fl.dataset.tcsFont='1'; document.head.appendChild(fl);
  }

  // ── CSS ──
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --nav-w: 260px; --nav-bg: #0f0f14; --nav-border: #1e1e28;
      --nav-accent: #e17055; --nav-text: #c8c8d8; --nav-muted: #555568;
      --nav-hover: #1a1a24; --nav-active: rgba(225,112,85,0.1); --nav-h: 52px;
    }
    #spi-sidebar {
      position: fixed; top: 0; left: 0; width: var(--nav-w); height: 100vh;
      background: var(--nav-bg); border-right: 1px solid var(--nav-border);
      display: flex; flex-direction: column; z-index: 1000;
      font-family: 'Noto Sans KR', sans-serif; transition: transform 0.3s ease; overflow: hidden;
    }
    .spi-logo {
      padding: 16px 20px 14px; border-bottom: 1px solid var(--nav-border);
      flex-shrink: 0; text-decoration: none; display: block; transition: background 0.15s;
    }
    .spi-logo:hover { background: var(--nav-hover); }
    .spi-logo-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: var(--nav-accent); text-transform: uppercase; }
    .spi-logo-sub { font-size: 11px; font-weight: 600; color: var(--nav-text); margin-top: 4px; line-height: 1.4; }
    .spi-logo-home { font-size: 9px; color: var(--nav-muted); margin-top: 5px; letter-spacing: 0.5px; }
    /* Exam tabs */
    .spi-exam-tabs {
      display: flex; gap: 4px; padding: 10px 10px 8px;
      border-bottom: 1px solid var(--nav-border); flex-shrink: 0;
    }
    .spi-exam-tab {
      flex: 1; padding: 8px 4px; border-radius: 8px; border: none;
      font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit;
      transition: all 0.18s; color: var(--nav-muted); background: transparent;
      white-space: nowrap;
    }
    .spi-exam-tab.active { background: var(--nav-active); color: var(--nav-accent); }
    .spi-exam-tab:hover:not(.active) { color: var(--nav-text); }
    .spi-exam-tab.disabled { opacity: 0.4; cursor: default; }
    /* TOC list */
    .spi-toc {
      flex: 1; overflow-y: auto; padding: 8px 4px 80px;
      scrollbar-width: thin; scrollbar-color: var(--nav-border) transparent;
      display: none;
    }
    .spi-toc.active { display: block; }
    .spi-toc::-webkit-scrollbar { width: 4px; }
    .spi-toc::-webkit-scrollbar-thumb { background: var(--nav-border); border-radius: 2px; }
    .spi-nav-header {
      font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: var(--nav-muted);
      padding: 14px 16px 6px 20px; text-transform: uppercase;
    }
    .spi-nav-item {
      display: block; padding: 8px 16px 8px 24px; font-size: 12px; color: var(--nav-muted);
      text-decoration: none; border-radius: 6px; margin: 1px 8px;
      transition: all 0.15s;
    }
    .spi-nav-item:hover { background: var(--nav-hover); color: var(--nav-text); }
    .spi-nav-item.active { background: var(--nav-active); color: var(--nav-accent); font-weight: 600; }
    .spi-nav-item.bold { font-weight: 600; padding-left: 16px; margin-bottom: 4px; }
    .spi-coming-soon {
      padding: 24px 20px; text-align: center;
      font-size: 12px; color: var(--nav-muted); line-height: 1.8;
    }
    .spi-coming-soon em { color: var(--nav-text); font-style: normal; font-weight: 600; }
    /* Body offset */
    body.spi-nav-ready { margin-left: var(--nav-w) !important; }
    /* Topbar mobile */
    #spi-topbar {
      display: none; position: fixed; top: 0; left: 0; right: 0; height: var(--nav-h);
      background: var(--nav-bg); border-bottom: 1px solid var(--nav-border);
      align-items: center; justify-content: space-between; padding: 0 14px; z-index: 1001; gap: 10px;
    }
    .spi-topbar-title { font-size: 12px; font-weight: 700; color: var(--nav-text); flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
    .spi-hamburger {
      width: 36px; height: 36px; background: var(--nav-hover); border: 1px solid var(--nav-border);
      border-radius: 8px; cursor: pointer; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 5px; flex-shrink: 0;
    }
    .spi-hamburger span { display: block; width: 16px; height: 1.5px; background: var(--nav-text); border-radius: 2px; }
    #spi-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 999; backdrop-filter: blur(2px); }
    #spi-overlay.show { display: block; }
    @media (max-width: 768px) {
      #spi-sidebar { transform: translateX(-100%); z-index: 1002; width: min(var(--nav-w), 85vw); }
      #spi-sidebar.mobile-open { transform: translateX(0); }
      body.spi-nav-ready { margin-left: 0 !important; padding-top: var(--nav-h) !important; }
      #spi-topbar { display: flex; }
    }
    @media (min-width: 769px) { body.spi-nav-ready { padding-bottom: 20px !important; } }
  `;
  document.head.appendChild(style);

  // ── HTML 빌드 ──
  function buildTocHtml(exam) {
    let html = '';
    for (const c of exam.children) {
      if (c.isHeader) {
        html += `<div class="spi-nav-header">${c.label.replace('── ', '')}</div>`;
      } else if (c.isComingSoon) {
        html += `<div class="spi-coming-soon"><em>${exam.label}</em> 대책 콘텐츠는<br>준비 중입니다.</div>`;
      } else {
        const isActive = c.file === currentFile ? ' active' : '';
        const isBold = c.isBold ? ' bold' : '';
        html += `<a class="spi-nav-item${isActive}${isBold}" href="${c.file}">${c.label}</a>`;
      }
    }
    return html;
  }

  // Tabs
  let tabsHtml = '';
  EXAMS.forEach(exam => {
    const isActive = exam.id === activeExamId ? ' active' : '';
    const isDisabled = !exam.index ? ' disabled' : '';
    tabsHtml += `<button class="spi-exam-tab${isActive}${isDisabled}" data-exam="${exam.id}">${exam.icon} ${exam.label}</button>`;
  });

  // TOC panels
  let tocsHtml = '';
  EXAMS.forEach(exam => {
    const isActive = exam.id === activeExamId ? ' active' : '';
    tocsHtml += `<nav class="spi-toc${isActive}" id="spi-toc-${exam.id}">${buildTocHtml(exam)}</nav>`;
  });

  // Get current page title for topbar
  function getCurrentTitle() {
    for (const exam of EXAMS) {
      for (const c of exam.children) {
        if (c.file === currentFile) return c.label;
      }
    }
    return '적성검사 대책';
  }

  const sidebarHtml = `
    <div id="spi-sidebar">
      <a class="spi-logo" href="index.html">
        <div class="spi-logo-title">Tokyo Career Studio</div>
        <div class="spi-logo-sub">적성검사 대책 가이드</div>
        <div class="spi-logo-home">← 홈으로</div>
      </a>
      <div class="spi-exam-tabs">${tabsHtml}</div>
      ${tocsHtml}
    </div>`;

  const topbarHtml = `
    <div id="spi-topbar">
      <div class="spi-topbar-title">📝 ${getCurrentTitle()}</div>
      <div class="spi-hamburger" onclick="spiToggleMobile()">
        <span></span><span></span><span></span>
      </div>
    </div>`;

  // ── DOM 삽입 ──
  const overlay = document.createElement('div');
  overlay.id = 'spi-overlay';
  overlay.onclick = () => spiCloseMobile();
  document.body.appendChild(overlay);

  document.body.insertAdjacentHTML('afterbegin', topbarHtml + sidebarHtml);
  document.body.classList.add('spi-nav-ready');

  // ── 탭 전환 ──
  document.querySelectorAll('.spi-exam-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const examId = tab.dataset.exam;
      const exam = EXAMS.find(e => e.id === examId);
      if (!exam || !exam.index) return;
      // If clicking a different exam, navigate to its index
      if (examId !== activeExamId && exam.index) {
        location.href = exam.index;
        return;
      }
      // Same exam, just switch tab display
      document.querySelectorAll('.spi-exam-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.spi-toc').forEach(t => t.classList.remove('active'));
      const panel = document.getElementById('spi-toc-' + examId);
      if (panel) panel.classList.add('active');
    });
  });

  // ── 모바일 토글 ──
  window.spiToggleMobile = function() {
    const sb = document.getElementById('spi-sidebar');
    if (sb.classList.contains('mobile-open')) spiCloseMobile();
    else { sb.classList.add('mobile-open'); overlay.classList.add('show'); }
  };
  window.spiCloseMobile = function() {
    document.getElementById('spi-sidebar').classList.remove('mobile-open');
    overlay.classList.remove('show');
  };

  // ── 현재 항목으로 스크롤 ──
  setTimeout(() => {
    const active = document.querySelector('.spi-nav-item.active');
    if (active) {
      const toc = active.closest('.spi-toc');
      if (toc) toc.scrollTop = active.offsetTop - 120;
    }
  }, 100);

  // ── 인증 가드 (사이드바 링크 클릭 시) ──
  document.addEventListener('click', e => {
    const link = e.target.closest('.spi-nav-item');
    if (!link) return;
    const dest = link.getAttribute('href');
    if (!dest) return;
    if (sessionStorage.getItem('tcs_auth') === 'ok') return;
    e.preventDefault();
    sessionStorage.setItem('tcs_redirect', dest);
    location.href = 'index.html';
  });

  window.scrollTo(0, 0);

})();
