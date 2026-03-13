/**
 * Tokyo Career Studio — e-Book Navigation Layer v2
 * 개선사항:
 * - 로고 클릭 → index.html (홈) 이동
 * - 모바일 topbar: 카테고리 > 페이지명 breadcrumb 표시
 * - pager 버튼: 카테고리 | 페이지명 계층 표시
 * - 페이지 진입 시 scroll to top
 * - 키보드 ← → 이전/다음 이동
 * - 레벨2 branch-card → 레벨3 링크 자동 주입
 */

(function () {

  const TOC = [
    { id: "intro", label: "🗺️ 직종 대분류 맵", file: "map-lv1.html", children: [] },
    { id: "sales", label: "📊 영업", file: "sales-overview.html", children: [
        { label: "메이커 영업",   file: "sales-eg01-maker.html" },
        { label: "IT영업",        file: "sales-eg02-it.html" },
        { label: "상사 영업",     file: "sales-eg03-trading.html" },
        { label: "광고 영업",     file: "sales-eg04-ad.html" },
        { label: "금융 영업",     file: "sales-eg05-finance.html" },
        { label: "부동산 영업",   file: "sales-eg06-realestate.html" },
        { label: "인재/HR 영업",  file: "sales-eg07-hr.html" },
        { label: "MR 제약영업",   file: "sales-eg08-pharma.html" },
    ]},
    { id: "se", label: "💻 SE/IT엔지니어", file: "se-overview.html", children: [
        { label: "SIer SE",         file: "se-se01-sier.html" },
        { label: "Web계 엔지니어",  file: "se-se02-web.html" },
        { label: "인프라 엔지니어", file: "se-se03-infra.html" },
        { label: "SES 엔지니어",    file: "se-se04-ses.html" },
    ]},
    { id: "tech", label: "⚙️ 기술계 종합직", file: "tech-overview.html", children: [
        { label: "기계/전기 엔지니어", file: "tech-gi01-mech.html" },
        { label: "생산관리·품질관리",  file: "tech-gi02-production.html" },
        { label: "연구개발 (R&D)",     file: "tech-gi03-rd.html" },
    ]},
    { id: "kikaku", label: "💡 기획/관리 계열", file: "kikaku-overview.html", children: [
        { label: "사무/관리",       file: "kikaku-kk01-admin.html" },
        { label: "기획",            file: "kikaku-kk02-planning.html" },
        { label: "마케팅",          file: "kikaku-kk03-marketing.html" },
        { label: "부동산·사업기획", file: "kikaku-kk04-realestate.html" },
    ]},
    { id: "logistics", label: "🚛 물류·SCM", file: "logistics-overview.html", children: [
        { label: "메이커·유통 SCM", file: "logistics-scm01-maker.html" },
        { label: "3PL·포워더",      file: "logistics-scm02-3pl.html" },
        { label: "무역·조달·구매",  file: "logistics-scm03-trade.html" },
    ]},
    { id: "service", label: "🛍️ 판매·서비스", file: "service-overview.html", children: [
        { label: "소매 판매",          file: "service-sv01-retail.html" },
        { label: "호텔·관광·브라이달", file: "service-sv02-hotel.html" },
        { label: "음식·F&B 서비스",    file: "service-sv03-fb.html" },
    ]},
    { id: "sekou", label: "🏗️ 시공관리", file: "sekou-overview.html", children: [
        { label: "건축 시공관리", file: "sekou-sk01-arch.html" },
        { label: "토목 시공관리", file: "sekou-sk02-civil.html" },
        { label: "설비 시공관리", file: "sekou-sk03-facility.html" },
    ]},
    { id: "creative", label: "🎨 크리에이티브", file: "creative-overview.html", children: [
        { label: "UI/UX 디자인",          file: "creative-cr01-uiux.html" },
        { label: "광고·엔터 크리에이티브", file: "creative-cr02-ad.html" },
        { label: "그래픽·비주얼 디자인",  file: "creative-cr03-graphic.html" },
    ]},
    { id: "consul", label: "🎯 컨설턴트", file: "consul-overview.html", children: [
        { label: "전략·종합 컨설팅", file: "consul-con01-strategy.html" },
        { label: "IT컨설팅",         file: "consul-con02-it.html" },
    ]},
  ];

  // 레벨2 branch-card h4 → 레벨3 파일 매핑
  const L2_TO_L3 = {
    "메이커 영업": "sales-eg01-maker.html",
    "IT영업": "sales-eg02-it.html",
    "상사영업": "sales-eg03-trading.html",
    "광고/미디어 영업": "sales-eg04-ad.html",
    "금융영업": "sales-eg05-finance.html",
    "부동산영업": "sales-eg06-realestate.html",
    "인재/HR영업": "sales-eg07-hr.html",
    "MR (製薬)": "sales-eg08-pharma.html",
    "SIer SE": "se-se01-sier.html",
    "Web계 엔지니어": "se-se02-web.html",
    "인프라/네트워크 엔지니어": "se-se03-infra.html",
    "SES (기술자파견)": "se-se04-ses.html",
    "기계/전기 엔지니어": "tech-gi01-mech.html",
    "생산관리": "tech-gi02-production.html",
    "품질관리": "tech-gi02-production.html",
    "연구개발": "tech-gi03-rd.html",
    "사무/관리": "kikaku-kk01-admin.html",
    "기획": "kikaku-kk02-planning.html",
    "마케팅": "kikaku-kk03-marketing.html",
    "부동산 사업기획": "kikaku-kk04-realestate.html",
    "메이커·유통 SCM": "logistics-scm01-maker.html",
    "3PL·포워더": "logistics-scm02-3pl.html",
    "무역·조달·구매": "logistics-scm03-trade.html",
    "소매판매": "service-sv01-retail.html",
    "호텔·관광·브라이달": "service-sv02-hotel.html",
    "음식·F&B": "service-sv03-fb.html",
    "건축 시공관리": "sekou-sk01-arch.html",
    "토목 시공관리": "sekou-sk02-civil.html",
    "설비 시공관리": "sekou-sk03-facility.html",
    "UI/UX 디자인": "creative-cr01-uiux.html",
    "광고·엔터테인먼트 크리에이티브": "creative-cr02-ad.html",
    "그래픽·비주얼 디자인": "creative-cr03-graphic.html",
    "전략·종합 컨설팅": "consul-con01-strategy.html",
    "전략 컨설팅": "consul-con01-strategy.html",
    "종합컨설팅": "consul-con01-strategy.html",
    "IT컨설팅": "consul-con02-it.html",
  };

  // ===== 인증 가드 =====
  const _curFile = location.pathname.split("/").pop() || "";
  if (_curFile !== "index.html" && _curFile !== "") {
    if (sessionStorage.getItem("tcs_auth") !== "ok") {
      sessionStorage.setItem("tcs_redirect", _curFile);
      location.replace("index.html");
    }
  }

  const currentFile = location.pathname.split("/").pop() || "index.html";

  // 플랫 페이지 리스트 (catLabel 포함)
  const flatPages = [];
  TOC.forEach(ch => {
    const catName = ch.label.replace(/^\S+\s/, "");
    flatPages.push({ label: catName, file: ch.file, catLabel: null });
    ch.children.forEach(c => flatPages.push({ label: c.label, file: c.file, catLabel: catName }));
  });
  const currentIdx = flatPages.findIndex(p => p.file === currentFile);

  function getCurrentCrumb() {
    for (const ch of TOC) {
      const catName = ch.label.replace(/^\S+\s/, "");
      if (ch.file === currentFile) return { cat: null, page: catName };
      for (const c of ch.children) {
        if (c.file === currentFile) return { cat: catName, page: c.label };
      }
    }
    return { cat: null, page: "직종 가이드북" };
  }

  // ===== 폰트 — nav.js에서 한 번만 로드 =====
  if (!document.querySelector("link[data-tcs-font]")) {
    const preconn1 = document.createElement("link");
    preconn1.rel = "preconnect";
    preconn1.href = "https://fonts.googleapis.com";
    preconn1.dataset.tcsFont = "1";
    document.head.appendChild(preconn1);

    const preconn2 = document.createElement("link");
    preconn2.rel = "preconnect";
    preconn2.href = "https://fonts.gstatic.com";
    preconn2.crossOrigin = "anonymous";
    document.head.appendChild(preconn2);

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap";
    fontLink.dataset.tcsFont = "1";
    document.head.appendChild(fontLink);
  }

  // ===== CSS =====
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --nav-w: 260px; --nav-bg: #0f0f14; --nav-border: #1e1e28;
      --nav-accent: #4a9eff; --nav-text: #c8c8d8; --nav-muted: #555568;
      --nav-hover: #1a1a24; --nav-active: rgba(74,158,255,0.1); --nav-h: 52px;
    }
    #tcs-sidebar {
      position: fixed; top: 0; left: 0; width: var(--nav-w); height: 100vh;
      background: var(--nav-bg); border-right: 1px solid var(--nav-border);
      display: flex; flex-direction: column; z-index: 1000;
      font-family: 'Noto Sans KR', sans-serif; transition: transform 0.3s ease; overflow: hidden;
    }
    .tcs-logo {
      padding: 16px 20px 14px; border-bottom: 1px solid var(--nav-border);
      flex-shrink: 0; text-decoration: none; display: block; transition: background 0.15s;
    }
    .tcs-logo:hover { background: var(--nav-hover); }
    .tcs-logo-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: var(--nav-accent); text-transform: uppercase; }
    .tcs-logo-sub { font-size: 11px; font-weight: 600; color: var(--nav-text); margin-top: 4px; line-height: 1.4; }
    .tcs-logo-home { font-size: 9px; color: var(--nav-muted); margin-top: 5px; letter-spacing: 0.5px; }
    .tcs-toc { flex: 1; overflow-y: auto; padding: 8px 0 80px; scrollbar-width: thin; scrollbar-color: var(--nav-border) transparent; }
    .tcs-toc::-webkit-scrollbar { width: 4px; }
    .tcs-toc::-webkit-scrollbar-thumb { background: var(--nav-border); border-radius: 2px; }
    .tcs-ch { margin: 2px 0; }
    .tcs-ch-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 16px; cursor: pointer; border-radius: 6px; margin: 0 6px;
      transition: background 0.15s; text-decoration: none; color: var(--nav-text);
      font-size: 12px; font-weight: 600; gap: 8px;
    }
    .tcs-ch-header:hover { background: var(--nav-hover); }
    .tcs-ch-header.active { background: var(--nav-active); color: var(--nav-accent); }
    .tcs-ch-toggle { font-size: 10px; color: var(--nav-muted); transition: transform 0.2s; flex-shrink: 0; }
    .tcs-ch.open .tcs-ch-toggle { transform: rotate(90deg); }
    .tcs-children { display: none; padding: 2px 0 4px 28px; }
    .tcs-ch.open .tcs-children { display: block; }
    .tcs-item {
      display: block; padding: 6px 12px; font-size: 11px; color: var(--nav-muted);
      text-decoration: none; border-radius: 5px; margin: 1px 6px 1px 0;
      transition: all 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tcs-item:hover { background: var(--nav-hover); color: var(--nav-text); }
    .tcs-item.active { background: var(--nav-active); color: var(--nav-accent); font-weight: 600; }
    .tcs-item.visited::after { content: '✓'; margin-left: auto; font-size: 9px; color: var(--nav-muted); opacity: 0.6; padding-left: 4px; }
    .tcs-item.visited.active::after { color: var(--nav-accent); opacity: 0.8; }
    .tcs-ch-header.visited .tcs-ch-toggle::before { content: '✓ '; font-size: 9px; color: var(--nav-muted); opacity: 0.6; }
    body.tcs-ready { margin-left: var(--nav-w) !important; }
    #tcs-pager {
      position: fixed; bottom: 0; left: var(--nav-w); right: 0; height: 52px;
      background: rgba(10,10,15,0.96); border-top: 1px solid var(--nav-border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; z-index: 999; backdrop-filter: blur(10px);
    }
    .tcs-pager-btn {
      display: flex; flex-direction: column; justify-content: center; gap: 2px;
      text-decoration: none; padding: 7px 12px; border-radius: 7px;
      border: 1px solid var(--nav-border); transition: all 0.2s;
      max-width: 210px; overflow: hidden;
    }
    .tcs-pager-btn:hover { border-color: var(--nav-accent); }
    .tcs-pager-cat { font-size: 9px; color: var(--nav-muted); letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.8; }
    .tcs-pager-name { font-size: 11px; font-weight: 600; color: var(--nav-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tcs-pager-btn:hover .tcs-pager-name { color: var(--nav-accent); }
    .tcs-pager-center { font-size: 10px; color: var(--nav-muted); letter-spacing: 1px; flex-shrink: 0; text-align: center; }
    .tcs-pager-ghost { width: 80px; }
    #tcs-topbar {
      display: none; position: fixed; top: 0; left: 0; right: 0; height: var(--nav-h);
      background: var(--nav-bg); border-bottom: 1px solid var(--nav-border);
      align-items: center; justify-content: space-between; padding: 0 14px; z-index: 1001; gap: 10px;
    }
    .tcs-topbar-breadcrumb { display: flex; flex-direction: column; gap: 1px; overflow: hidden; flex: 1; }
    .tcs-topbar-cat { font-size: 9px; color: var(--nav-muted); letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tcs-topbar-page { font-size: 12px; font-weight: 700; color: var(--nav-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tcs-hamburger {
      width: 36px; height: 36px; background: var(--nav-hover); border: 1px solid var(--nav-border);
      border-radius: 8px; cursor: pointer; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 5px; flex-shrink: 0;
    }
    .tcs-hamburger span { display: block; width: 16px; height: 1.5px; background: var(--nav-text); border-radius: 2px; transition: all 0.2s; }
    #tcs-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 999; backdrop-filter: blur(2px); }
    #tcs-overlay.show { display: block; }
    .tcs-branch-link {
      display: flex !important; text-decoration: none !important; color: inherit !important;
      cursor: pointer; position: relative;
    }
    .tcs-branch-link::after {
      content: '상세 보기 →'; position: absolute; right: 16px; bottom: 14px;
      font-size: 10px; color: var(--nav-accent, #4a9eff); opacity: 0;
      transition: opacity 0.2s; font-weight: 600; letter-spacing: 0.3px;
    }
    .tcs-branch-link:hover::after { opacity: 1; }
    .tcs-branch-link:hover { border-color: rgba(74,158,255,0.3) !important; background: rgba(74,158,255,0.04) !important; }
    @media (max-width: 768px) {
      #tcs-sidebar { transform: translateX(-100%); z-index: 1002; width: min(var(--nav-w), 85vw); }
      #tcs-sidebar.mobile-open { transform: translateX(0); }
      body.tcs-ready { margin-left: 0 !important; padding-top: var(--nav-h) !important; padding-bottom: 60px !important; }
      #tcs-topbar { display: flex; }
      #tcs-pager { left: 0; }
    }
    @media (min-width: 769px) { body.tcs-ready { padding-bottom: 60px !important; } }
  `;
  document.head.appendChild(style);

  // ===== HTML 빌드 =====
  function buildSidebar() {
    let html = `<div id="tcs-sidebar">
      <a class="tcs-logo" href="index.html">
        <div class="tcs-logo-title">Tokyo Career Studio</div>
        <div class="tcs-logo-sub">일본취업 직종 가이드북</div>
        <div class="tcs-logo-home">← 홈으로</div>
      </a>
      <nav class="tcs-toc">`;

    TOC.forEach(ch => {
      const isChActive = ch.file === currentFile;
      const hasActiveChild = ch.children.some(c => c.file === currentFile);
      const isOpen = isChActive || hasActiveChild;
      if (ch.children.length === 0) {
        html += `<div class="tcs-ch ${isOpen ? "open" : ""}">
          <a class="tcs-ch-header ${isChActive ? "active" : ""}" href="${ch.file}"><span>${ch.label}</span></a>
        </div>`;
      } else {
        html += `<div class="tcs-ch ${isOpen ? "open" : ""}">
          <div class="tcs-ch-header ${isChActive ? "active" : ""}" onclick="tcsCh(this)">
            <a href="${ch.file}" onclick="event.stopPropagation()" style="color:inherit;text-decoration:none;flex:1">${ch.label}</a>
            <span class="tcs-ch-toggle">▶</span>
          </div>
          <div class="tcs-children">`;
        ch.children.forEach(c => {
          html += `<a class="tcs-item ${c.file === currentFile ? "active" : ""}" href="${c.file}">${c.label}</a>`;
        });
        html += `</div></div>`;
      }
    });
    html += `</nav></div>`;
    return html;
  }

  function buildTopbar() {
    const crumb = getCurrentCrumb();
    return `<div id="tcs-topbar">
      <div class="tcs-topbar-breadcrumb">
        ${crumb.cat ? `<span class="tcs-topbar-cat">${crumb.cat}</span>` : ""}
        <span class="tcs-topbar-page">${crumb.page}</span>
      </div>
      <div class="tcs-hamburger" onclick="tcsToggleMobile()">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  }

  function buildPager() {
    const prev = currentIdx > 0 ? flatPages[currentIdx - 1] : null;
    const next = currentIdx < flatPages.length - 1 ? flatPages[currentIdx + 1] : null;
    const pos = currentIdx >= 0 ? `${currentIdx + 1} / ${flatPages.length}` : "";

    function btn(p, dir) {
      if (!p) return `<div class="tcs-pager-ghost"></div>`;
      const catTxt = p.catLabel || "";
      if (dir === "prev") {
        return `<a class="tcs-pager-btn" href="${p.file}">
          <span class="tcs-pager-cat">← ${catTxt}</span>
          <span class="tcs-pager-name">${p.label}</span>
        </a>`;
      } else {
        return `<a class="tcs-pager-btn" href="${p.file}">
          <span class="tcs-pager-cat">${catTxt} →</span>
          <span class="tcs-pager-name">${p.label}</span>
        </a>`;
      }
    }

    return `<div id="tcs-pager">
      ${btn(prev, "prev")}
      <span class="tcs-pager-center">${pos}</span>
      ${btn(next, "next")}
    </div>`;
  }

  // ===== 오버레이 & DOM 삽입 =====
  const overlay = document.createElement("div");
  overlay.id = "tcs-overlay";
  overlay.onclick = () => tcsCloseMobile();
  document.body.appendChild(overlay);

  document.body.insertAdjacentHTML("afterbegin", buildTopbar() + buildSidebar());
  document.body.insertAdjacentHTML("beforeend", buildPager());
  document.body.classList.add("tcs-ready");

  // ===== 읽은 페이지 추적 =====
  const VISITED_KEY = "tcs_visited";
  function getVisited() {
    try { return JSON.parse(sessionStorage.getItem(VISITED_KEY) || "[]"); } catch { return []; }
  }
  function markVisited(file) {
    const v = getVisited();
    if (!v.includes(file)) { v.push(file); sessionStorage.setItem(VISITED_KEY, JSON.stringify(v)); }
  }
  function applyVisitedStyles() {
    const visited = getVisited();
    document.querySelectorAll(".tcs-item").forEach(el => {
      const href = el.getAttribute("href");
      if (href && visited.includes(href)) el.classList.add("visited");
    });
    // overview(ch-header) 링크도 체크
    document.querySelectorAll(".tcs-ch-header a").forEach(el => {
      const href = el.getAttribute("href");
      if (href && visited.includes(href)) el.closest(".tcs-ch-header").classList.add("visited");
    });
  }

  // 현재 페이지 방문 기록
  if (currentFile && currentFile !== "index.html") markVisited(currentFile);
  applyVisitedStyles();

  // ===== 토글 =====
  window.tcsCh = el => el.closest(".tcs-ch").classList.toggle("open");
  window.tcsToggleMobile = function () {
    const sb = document.getElementById("tcs-sidebar");
    if (sb.classList.contains("mobile-open")) { tcsCloseMobile(); }
    else { sb.classList.add("mobile-open"); overlay.classList.add("show"); }
  };
  window.tcsCloseMobile = function () {
    document.getElementById("tcs-sidebar").classList.remove("mobile-open");
    overlay.classList.remove("show");
  };

  // ===== 사이드바 현재 항목으로 스크롤 =====
  setTimeout(() => {
    const active = document.querySelector(".tcs-item.active, .tcs-ch-header.active");
    if (active) {
      const toc = document.querySelector(".tcs-toc");
      if (toc) toc.scrollTop = active.offsetTop - 120;
    }
  }, 100);

  // ===== 페이지 진입 시 scroll to top =====
  window.scrollTo(0, 0);

  // ===== 키보드 ← → 네비 =====
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft" && currentIdx > 0)
      location.href = flatPages[currentIdx - 1].file;
    if (e.key === "ArrowRight" && currentIdx < flatPages.length - 1)
      location.href = flatPages[currentIdx + 1].file;
  });

  // ===== 레벨2 branch-card → 레벨3 링크 주입 =====
  function injectBranchLinks() {
    document.querySelectorAll(".branch-card").forEach(card => {
      if (card.closest("a")) return; // 이미 처리됨
      const h4 = card.querySelector("h4");
      if (!h4) return;
      const text = h4.textContent.trim();
      let href = null;
      for (const [key, url] of Object.entries(L2_TO_L3)) {
        if (text.includes(key)) { href = url; break; }
      }
      if (!href) return;
      const a = document.createElement("a");
      a.href = href;
      a.className = "tcs-branch-link";
      // branch-card의 기존 스타일 클래스도 복사
      card.classList.forEach(cls => { if (cls !== "tcs-branch-link") a.classList.add(cls); });
      card.parentNode.insertBefore(a, card);
      a.appendChild(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectBranchLinks);
  } else {
    injectBranchLinks();
  }

  // ===== 레벨2/3 섹션 스크롤 → 사이드바 섹션 표시 =====
  function initSectionObserver() {
    const sections = document.querySelectorAll(".section[id]");
    if (!sections.length) return;

    // 사이드바 현재 페이지 항목 아래에 섹션 미니맵 추가
    const activeItem = document.querySelector(".tcs-item.active, .tcs-ch-header.active");
    if (!activeItem) return;

    // 섹션 레이블 수집
    const sectionLabels = {};
    document.querySelectorAll(".nav-item").forEach(btn => {
      const match = btn.getAttribute("onclick") && btn.getAttribute("onclick").match(/'(s\d+)'/);
      if (match) sectionLabels[match[1]] = btn.textContent.trim();
    });

    // 미니맵 컨테이너 생성
    const minimap = document.createElement("div");
    minimap.id = "tcs-section-map";
    minimap.style.cssText = `
      padding: 4px 0 6px 28px;
      border-left: 1px solid var(--nav-border);
      margin: 2px 6px 4px 20px;
    `;

    sections.forEach(sec => {
      const label = sectionLabels[sec.id] || sec.id;
      const dot = document.createElement("div");
      dot.dataset.secId = sec.id;
      dot.style.cssText = `
        font-size: 10px; color: var(--nav-muted); padding: 3px 8px;
        border-radius: 4px; cursor: pointer; transition: all 0.15s;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        margin: 1px 0;
      `;
      dot.textContent = label;
      dot.onclick = () => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        const navEl = document.querySelector(".section-nav");
        const offset = navEl ? navEl.offsetHeight : 0;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset - 16, behavior: "smooth" });
      };
      minimap.appendChild(dot);
    });

    // activeItem 바로 뒤에 삽입 (ch-header면 children 아래, item이면 그 다음)
    const parent = activeItem.closest(".tcs-ch");
    if (parent) {
      const children = parent.querySelector(".tcs-children");
      if (children) {
        children.appendChild(minimap);
      } else {
        parent.appendChild(minimap);
      }
    }

    // IntersectionObserver로 현재 섹션 추적
    let currentSecId = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentSecId = entry.target.id;
          minimap.querySelectorAll("[data-sec-id]").forEach(dot => {
            const isActive = dot.dataset.secId === currentSecId;
            dot.style.color = isActive ? "var(--nav-accent)" : "var(--nav-muted)";
            dot.style.background = isActive ? "var(--nav-active)" : "";
            dot.style.fontWeight = isActive ? "600" : "400";
          });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSectionObserver);
  } else {
    setTimeout(initSectionObserver, 150);
  }

})();
