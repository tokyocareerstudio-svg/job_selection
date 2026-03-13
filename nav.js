/**
 * Tokyo Career Studio — e-Book Navigation Layer
 * 모든 레벨1/2/3 파일에 공통 적용되는 사이드바 + 모바일 네비
 */

(function () {
  // ===== 목차 구조 =====
  const TOC = [
    {
      id: "intro",
      label: "🗺️ 직종 대분류 맵",
      file: "map-lv1.html",
      children: []
    },
    {
      id: "sales",
      label: "📊 영업",
      file: "sales-overview.html",
      children: [
        { label: "메이커 영업",   file: "sales-eg01-maker.html" },
        { label: "IT영업",        file: "sales-eg02-it.html" },
        { label: "상사 영업",     file: "sales-eg03-trading.html" },
        { label: "광고 영업",     file: "sales-eg04-ad.html" },
        { label: "금융 영업",     file: "sales-eg05-finance.html" },
        { label: "부동산 영업",   file: "sales-eg06-realestate.html" },
        { label: "인재/HR 영업",  file: "sales-eg07-hr.html" },
        { label: "MR 제약영업",   file: "sales-eg08-pharma.html" },
      ]
    },
    {
      id: "se",
      label: "💻 SE/IT엔지니어",
      file: "se-overview.html",
      children: [
        { label: "SIer SE",        file: "se-se01-sier.html" },
        { label: "Web계 엔지니어", file: "se-se02-web.html" },
        { label: "인프라 엔지니어", file: "se-se03-infra.html" },
        { label: "SES 엔지니어",   file: "se-se04-ses.html" },
      ]
    },
    {
      id: "tech",
      label: "⚙️ 기술계 종합직",
      file: "tech-overview.html",
      children: [
        { label: "기계/전기 엔지니어",   file: "tech-gi01-mech.html" },
        { label: "생산관리·품질관리",     file: "tech-gi02-production.html" },
        { label: "연구개발 (R&D)",       file: "tech-gi03-rd.html" },
      ]
    },
    {
      id: "kikaku",
      label: "💡 기획/관리 계열",
      file: "kikaku-overview.html",
      children: [
        { label: "사무/관리",       file: "kikaku-kk01-admin.html" },
        { label: "기획",            file: "kikaku-kk02-planning.html" },
        { label: "마케팅",          file: "kikaku-kk03-marketing.html" },
        { label: "부동산·사업기획", file: "kikaku-kk04-realestate.html" },
      ]
    },
    {
      id: "logistics",
      label: "🚛 물류·SCM",
      file: "logistics-overview.html",
      children: [
        { label: "메이커·유통 SCM", file: "logistics-scm01-maker.html" },
        { label: "3PL·포워더",      file: "logistics-scm02-3pl.html" },
        { label: "무역·조달·구매",  file: "logistics-scm03-trade.html" },
      ]
    },
    {
      id: "service",
      label: "🛍️ 판매·서비스",
      file: "service-overview.html",
      children: [
        { label: "소매 판매",         file: "service-sv01-retail.html" },
        { label: "호텔·관광·브라이달", file: "service-sv02-hotel.html" },
        { label: "음식·F&B 서비스",  file: "service-sv03-fb.html" },
      ]
    },
    {
      id: "sekou",
      label: "🏗️ 시공관리",
      file: "sekou-overview.html",
      children: [
        { label: "건축 시공관리", file: "sekou-sk01-arch.html" },
        { label: "토목 시공관리", file: "sekou-sk02-civil.html" },
        { label: "설비 시공관리", file: "sekou-sk03-facility.html" },
      ]
    },
    {
      id: "creative",
      label: "🎨 크리에이티브",
      file: "creative-overview.html",
      children: [
        { label: "UI/UX 디자인",          file: "creative-cr01-uiux.html" },
        { label: "광고·엔터 크리에이티브", file: "creative-cr02-ad.html" },
        { label: "그래픽·비주얼 디자인",  file: "creative-cr03-graphic.html" },
      ]
    },
    {
      id: "consul",
      label: "🎯 컨설턴트",
      file: "consul-overview.html",
      children: [
        { label: "전략·종합 컨설팅", file: "consul-con01-strategy.html" },
        { label: "IT컨설팅",         file: "consul-con02-it.html" },
      ]
    },
  ];

  // ===== 현재 파일명 감지 =====
  const currentFile = location.pathname.split("/").pop() || "index.html";

  // ===== 플랫 페이지 리스트 (이전/다음용) =====
  const flatPages = [];
  TOC.forEach(ch => {
    flatPages.push({ label: ch.label.replace(/^.+?\s/, ""), file: ch.file });
    ch.children.forEach(c => flatPages.push(c));
  });
  const currentIdx = flatPages.findIndex(p => p.file === currentFile);

  // ===== CSS 주입 =====
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --nav-w: 260px;
      --nav-bg: #0f0f14;
      --nav-border: #1e1e28;
      --nav-accent: #4a9eff;
      --nav-text: #c8c8d8;
      --nav-muted: #555568;
      --nav-hover: #1a1a24;
      --nav-active: rgba(74,158,255,0.1);
      --nav-h: 52px; /* mobile top bar height */
    }

    /* ---- sidebar ---- */
    #tcs-sidebar {
      position: fixed;
      top: 0; left: 0;
      width: var(--nav-w);
      height: 100vh;
      background: var(--nav-bg);
      border-right: 1px solid var(--nav-border);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      font-family: 'Noto Sans KR', sans-serif;
      transition: transform 0.3s ease;
      overflow: hidden;
    }
    #tcs-sidebar.hidden { transform: translateX(-100%); }

    .tcs-logo {
      padding: 18px 20px 14px;
      border-bottom: 1px solid var(--nav-border);
      flex-shrink: 0;
    }
    .tcs-logo-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      color: var(--nav-accent);
      text-transform: uppercase;
    }
    .tcs-logo-sub {
      font-size: 10px;
      color: var(--nav-muted);
      margin-top: 3px;
    }

    .tcs-toc {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0 80px;
      scrollbar-width: thin;
      scrollbar-color: var(--nav-border) transparent;
    }
    .tcs-toc::-webkit-scrollbar { width: 4px; }
    .tcs-toc::-webkit-scrollbar-thumb { background: var(--nav-border); border-radius: 2px; }

    .tcs-ch {
      margin: 2px 0;
    }
    .tcs-ch-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 6px;
      margin: 0 6px;
      transition: background 0.15s;
      text-decoration: none;
      color: var(--nav-text);
      font-size: 12px;
      font-weight: 600;
      gap: 8px;
    }
    .tcs-ch-header:hover { background: var(--nav-hover); }
    .tcs-ch-header.active { background: var(--nav-active); color: var(--nav-accent); }

    .tcs-ch-toggle {
      font-size: 10px;
      color: var(--nav-muted);
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .tcs-ch.open .tcs-ch-toggle { transform: rotate(90deg); }

    .tcs-children {
      display: none;
      padding: 2px 0 4px 28px;
    }
    .tcs-ch.open .tcs-children { display: block; }

    .tcs-item {
      display: block;
      padding: 6px 12px;
      font-size: 11px;
      color: var(--nav-muted);
      text-decoration: none;
      border-radius: 5px;
      margin: 1px 6px 1px 0;
      transition: all 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tcs-item:hover { background: var(--nav-hover); color: var(--nav-text); }
    .tcs-item.active {
      background: var(--nav-active);
      color: var(--nav-accent);
      font-weight: 600;
    }

    /* ---- page offset ---- */
    body.tcs-ready { margin-left: var(--nav-w) !important; }

    /* ---- prev/next bar ---- */
    #tcs-pager {
      position: fixed;
      bottom: 0;
      left: var(--nav-w);
      right: 0;
      height: 48px;
      background: rgba(10,10,15,0.95);
      border-top: 1px solid var(--nav-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 999;
      backdrop-filter: blur(8px);
    }
    .tcs-pager-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--nav-muted);
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--nav-border);
      transition: all 0.2s;
      max-width: 200px;
      overflow: hidden;
    }
    .tcs-pager-btn:hover { border-color: var(--nav-accent); color: var(--nav-accent); }
    .tcs-pager-btn span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tcs-pager-center {
      font-size: 10px;
      color: var(--nav-muted);
      letter-spacing: 1px;
    }
    .tcs-pager-ghost { width: 80px; }

    /* ---- mobile top bar ---- */
    #tcs-topbar {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0;
      height: var(--nav-h);
      background: var(--nav-bg);
      border-bottom: 1px solid var(--nav-border);
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 1001;
    }
    .tcs-topbar-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--nav-text);
      letter-spacing: 1px;
    }
    .tcs-hamburger {
      width: 36px; height: 36px;
      background: var(--nav-hover);
      border: 1px solid var(--nav-border);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .tcs-hamburger span {
      display: block;
      width: 16px; height: 1.5px;
      background: var(--nav-text);
      border-radius: 2px;
      transition: all 0.2s;
    }

    /* ---- overlay ---- */
    #tcs-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 999;
      backdrop-filter: blur(2px);
    }
    #tcs-overlay.show { display: block; }

    /* ---- mobile breakpoint ---- */
    @media (max-width: 768px) {
      #tcs-sidebar {
        transform: translateX(-100%);
        z-index: 1002;
        width: min(var(--nav-w), 85vw);
      }
      #tcs-sidebar.mobile-open { transform: translateX(0); }
      body.tcs-ready { margin-left: 0 !important; padding-top: var(--nav-h) !important; }
      #tcs-topbar { display: flex; }
      #tcs-pager { left: 0; bottom: 0; }
      body.tcs-ready { padding-bottom: 56px !important; }
    }

    @media (min-width: 769px) {
      body.tcs-ready { padding-bottom: 56px !important; }
    }
  `;
  document.head.appendChild(style);

  // ===== HTML 생성 =====
  function buildSidebar() {
    let html = `
      <div id="tcs-sidebar">
        <div class="tcs-logo">
          <div class="tcs-logo-title">Tokyo Career Studio</div>
          <div class="tcs-logo-sub">일본취업 직종 가이드북</div>
        </div>
        <nav class="tcs-toc">`;

    TOC.forEach(ch => {
      const isChActive = ch.file === currentFile;
      const hasActiveChild = ch.children.some(c => c.file === currentFile);
      const isOpen = isChActive || hasActiveChild;

      if (ch.children.length === 0) {
        html += `
          <div class="tcs-ch ${isOpen ? "open" : ""}">
            <a class="tcs-ch-header ${isChActive ? "active" : ""}" href="${ch.file}">
              <span>${ch.label}</span>
            </a>
          </div>`;
      } else {
        html += `
          <div class="tcs-ch ${isOpen ? "open" : ""}">
            <div class="tcs-ch-header ${isChActive ? "active" : ""}" onclick="tcsCh(this)">
              <a href="${ch.file}" onclick="event.stopPropagation()" style="color:inherit;text-decoration:none;flex:1">${ch.label}</a>
              <span class="tcs-ch-toggle">▶</span>
            </div>
            <div class="tcs-children">`;

        ch.children.forEach(c => {
          const isItemActive = c.file === currentFile;
          html += `<a class="tcs-item ${isItemActive ? "active" : ""}" href="${c.file}">${c.label}</a>`;
        });

        html += `</div></div>`;
      }
    });

    html += `</nav></div>`;
    return html;
  }

  function buildTopbar() {
    const currentPage = flatPages[currentIdx];
    const title = currentPage ? currentPage.label : "직종 가이드북";
    return `
      <div id="tcs-topbar">
        <span class="tcs-topbar-title">TCS 직종 가이드</span>
        <div class="tcs-hamburger" onclick="tcsToggleMobile()">
          <span></span><span></span><span></span>
        </div>
      </div>`;
  }

  function buildPager() {
    const prev = currentIdx > 0 ? flatPages[currentIdx - 1] : null;
    const next = currentIdx < flatPages.length - 1 ? flatPages[currentIdx + 1] : null;
    const pos = currentIdx >= 0 ? `${currentIdx + 1} / ${flatPages.length}` : "";

    const prevBtn = prev
      ? `<a class="tcs-pager-btn" href="${prev.file}">← <span>${prev.label}</span></a>`
      : `<div class="tcs-pager-ghost"></div>`;
    const nextBtn = next
      ? `<a class="tcs-pager-btn" href="${next.file}"><span>${next.label}</span> →</a>`
      : `<div class="tcs-pager-ghost"></div>`;

    return `
      <div id="tcs-pager">
        ${prevBtn}
        <span class="tcs-pager-center">${pos}</span>
        ${nextBtn}
      </div>`;
  }

  // ===== 오버레이 =====
  const overlay = document.createElement("div");
  overlay.id = "tcs-overlay";
  overlay.onclick = () => tcsCloseMobile();
  document.body.appendChild(overlay);

  // ===== DOM 삽입 =====
  document.body.insertAdjacentHTML("afterbegin", buildTopbar() + buildSidebar());
  document.body.insertAdjacentHTML("beforeend", buildPager());
  document.body.classList.add("tcs-ready");

  // ===== 토글 함수 =====
  window.tcsCh = function (el) {
    const ch = el.closest(".tcs-ch");
    ch.classList.toggle("open");
  };

  window.tcsToggleMobile = function () {
    const sidebar = document.getElementById("tcs-sidebar");
    const isOpen = sidebar.classList.contains("mobile-open");
    if (isOpen) {
      tcsCloseMobile();
    } else {
      sidebar.classList.add("mobile-open");
      overlay.classList.add("show");
    }
  };

  window.tcsCloseMobile = function () {
    document.getElementById("tcs-sidebar").classList.remove("mobile-open");
    overlay.classList.remove("show");
  };

  // ===== 현재 항목으로 스크롤 =====
  setTimeout(() => {
    const active = document.querySelector(".tcs-item.active, .tcs-ch-header.active");
    if (active) {
      const toc = document.querySelector(".tcs-toc");
      if (toc) toc.scrollTop = active.offsetTop - 100;
    }
  }, 100);

})();
