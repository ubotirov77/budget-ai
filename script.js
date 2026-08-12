document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
      HELPERS
  ========================================================= */
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  const CATEGORY_COLORS = {
    Food:      "#fbbf24",
    Transport: "#38bdf8",
    Shopping:  "#e879f9",
    Bills:     "#34d399",
    Debt:      "#fb7185",
    Other:     "#a5b4fc"
  };

  /* =========================================================
      MONTH SELECTOR + SEASON DECOR
  ========================================================= */
  const monthBtn  = document.getElementById("month-btn");
  const monthList = document.getElementById("month-list");
  const monthWrap = document.querySelector(".month-selector");

  const monthSeasonMap = {
    January: "winter", February: "winter", December: "winter",
    March: "spring",   April: "spring",    May: "spring",
    June: "summer",    July: "summer",     August: "summer",
    September: "autumn", October: "autumn", November: "autumn"
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  let currentSeason  = null;
  let decorContainer = null;
  let decorParticles = [];
  let decorAnimID    = null;

  function applySeasonTheme(season) {
    ["winter", "spring", "summer", "autumn"].forEach((s) =>
      document.body.classList.remove(`theme-${s}`)
    );
    if (season) {
      document.body.classList.add(`theme-${season}`);
      setSeasonDecor(season);
    }
  }

  function clearDecor() {
    if (decorAnimID) cancelAnimationFrame(decorAnimID);
    if (decorContainer) decorContainer.remove();
    decorContainer = null;
    decorParticles = [];
    decorAnimID = null;
  }

  function createDecorContainer() {
    const c = document.createElement("div");
    Object.assign(c.style, {
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 5,
      overflow: "hidden"
    });
    document.body.appendChild(c);
    return c;
  }

  function createParticle(opts) {
    const el = document.createElement("span");
    el.textContent = opts.char;
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      fontSize: `${opts.size}px`,
      opacity: opts.opacity,
      filter: `blur(${opts.blur || 0}px)`,
      willChange: "transform"
    });
    decorContainer.appendChild(el);
    return { ...opts, el };
  }

  function spawn(chars, count, extra = {}) {
    const w = innerWidth, h = innerHeight;
    for (let i = 0; i < count; i++) {
      decorParticles.push(
        createParticle({
          char: chars[Math.floor(Math.random() * chars.length)],
          x: Math.random() * w,
          y: Math.random() * h,
          size: extra.minSize + Math.random() * extra.sizeRange,
          opacity: 0.25 + Math.random() * 0.35,
          blur: extra.blur || 0,
          speedY: extra.minSpeedY + Math.random() * extra.speedYRange,
          speedX: extra.baseX + Math.random() * extra.speedXRange,
          rotate: Math.random() * 360,
          rotateSpeed: -0.25 + Math.random() * 0.5
        })
      );
    }
  }

  function initWinter() {
    spawn(["❄", "❅", "•"], 34, {
      minSize: 10, sizeRange: 12, blur: 0.6,
      minSpeedY: 0.35, speedYRange: 1.1, baseX: -0.3, speedXRange: 0.6
    });
  }
  function initSpring() {
    spawn(["🌸", "🌼", "🍃"], 22, {
      minSize: 14, sizeRange: 10,
      minSpeedY: 0.25, speedYRange: 0.8, baseX: 0.1, speedXRange: 0.6
    });
  }
  function initSummer() {
    spawn(["✦", "☀", "✧"], 20, {
      minSize: 10, sizeRange: 10, blur: 0.4,
      minSpeedY: -0.15, speedYRange: 0.5, baseX: -0.25, speedXRange: 0.5
    });
  }
  function initAutumn() {
    spawn(["🍂", "🍁", "🍃"], 24, {
      minSize: 14, sizeRange: 11,
      minSpeedY: 0.3, speedYRange: 0.9, baseX: -0.4, speedXRange: 0.8
    });
  }

  function animateDecor() {
    const w = innerWidth, h = innerHeight;
    decorParticles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotate += p.rotateSpeed;
      if (p.y > h + 40) p.y = -40;
      if (p.y < -60) p.y = h + 30;
      if (p.x > w + 40) p.x = -40;
      if (p.x < -40) p.x = w + 40;
      p.el.style.transform =
        `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotate}deg)`;
    });
    decorAnimID = requestAnimationFrame(animateDecor);
  }

  function setSeasonDecor(season) {
    if (season === currentSeason) return;
    clearDecor();
    currentSeason = season;
    if (!season) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    decorContainer = createDecorContainer();
    ({ winter: initWinter, spring: initSpring, summer: initSummer, autumn: initAutumn }[season])();
    animateDecor();
  }

  if (monthBtn && monthList) {
    monthBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      monthList.classList.toggle("hidden");
      if (monthWrap) monthWrap.classList.toggle("open", !monthList.classList.contains("hidden"));
    });

    document.addEventListener("click", (e) => {
      if (monthWrap && !monthWrap.contains(e.target)) {
        monthList.classList.add("hidden");
        monthWrap.classList.remove("open");
      }
    });

    const setMonth = (m) => {
      monthBtn.textContent = `${m} Budget`;
      monthList.querySelectorAll("li").forEach((li) =>
        li.classList.toggle("active", li.dataset.month === m)
      );
      applySeasonTheme(monthSeasonMap[m]);
    };

    monthList.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        setMonth(li.dataset.month);
        monthList.classList.add("hidden");
        if (monthWrap) monthWrap.classList.remove("open");
      });
    });

    setMonth(monthNames[new Date().getMonth()]);
  }

  /* =========================================================
      DATA / STORAGE
  ========================================================= */
  let incomeData  = JSON.parse(localStorage.getItem("incomeData")  || "[]");
  let expenseData = JSON.parse(localStorage.getItem("expenseData") || "[]");

  function saveData() {
    localStorage.setItem("incomeData",  JSON.stringify(incomeData));
    localStorage.setItem("expenseData", JSON.stringify(expenseData));
  }

  /* =========================================================
      UI ELEMENTS
  ========================================================= */
  const els = {
    totalIncome:      document.getElementById("total-income"),
    totalExpenses:    document.getElementById("total-expenses"),
    totalBalance:     document.getElementById("total-balance"),
    incomeCountLabel: document.getElementById("income-count-label"),
    spendRatioLabel:  document.getElementById("spend-ratio-label"),
    balanceBar:       document.getElementById("balance-bar"),
    incomeList:       document.getElementById("income-list"),
    expenseTableBody: document.getElementById("expense-table-body"),
    expenseCount:     document.getElementById("expense-count"),
    incomeForm:       document.getElementById("income-form"),
    incomeSource:     document.getElementById("income-source"),
    incomeAmount:     document.getElementById("income-amount"),
    expenseForm:      document.getElementById("expense-form"),
    expenseDesc:      document.getElementById("expense-desc"),
    expenseCategory:  document.getElementById("expense-category"),
    expenseAmount:    document.getElementById("expense-amount"),
    donut:            document.getElementById("donut"),
    donutValue:       document.getElementById("donut-value"),
    legend:           document.getElementById("legend"),
    langSelect:       document.getElementById("lang-select"),
    currencySelect:   document.getElementById("currency-select"),
    aiAnalyzeBtn:     document.getElementById("ai-analyze-btn"),
    aiPopup:          document.getElementById("ai-popup"),
    aiPopupOutput:    document.getElementById("popup-ai-output"),
    aiCloseBtn:       document.getElementById("ai-close-btn")
  };

  /* =========================================================
      CURRENCY
  ========================================================= */
  let currentCurrency = localStorage.getItem("budgetCurrency") || "KRW";

  function formatCurrency(num) {
    num = Number(num) || 0;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currentCurrency,
        maximumFractionDigits: 0
      }).format(num);
    } catch {
      return `${currentCurrency} ${Math.round(num).toLocaleString()}`;
    }
  }

  if (els.currencySelect) {
    els.currencySelect.value = currentCurrency;
    els.currencySelect.addEventListener("change", () => {
      currentCurrency = els.currencySelect.value;
      localStorage.setItem("budgetCurrency", currentCurrency);
      renderAll();
    });
  }

  /* =========================================================
      COUNT-UP ANIMATION
  ========================================================= */
  const countState = new WeakMap();

  function countTo(el, target) {
    if (!el) return;
    const from = countState.get(el) || 0;
    countState.set(el, target);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = formatCurrency(target);
      return;
    }

    const dur = 700;
    const t0 = performance.now();

    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCurrency(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================================================
      SUMMARY
  ========================================================= */
  function totals() {
    const inc = incomeData.reduce((s, i) => s + Number(i.amount || 0), 0);
    const exp = expenseData.reduce((s, e) => s + Number(e.amount || 0), 0);
    return { inc, exp, bal: inc - exp };
  }

  function renderSummary() {
    const { inc, exp, bal } = totals();

    countTo(els.totalIncome, inc);
    countTo(els.totalExpenses, exp);
    countTo(els.totalBalance, bal);

    if (els.incomeCountLabel) {
      els.incomeCountLabel.textContent =
        `${incomeData.length} source${incomeData.length === 1 ? "" : "s"}`;
    }

    const ratio = inc > 0 ? Math.round((exp / inc) * 100) : 0;
    if (els.spendRatioLabel) {
      els.spendRatioLabel.textContent =
        inc > 0 ? `${ratio}% of income` : "no income yet";
    }

    if (els.balanceBar) {
      const left = inc > 0 ? Math.max(0, Math.min(100, (bal / inc) * 100)) : 0;
      els.balanceBar.style.width = `${left}%`;
    }
  }

  /* =========================================================
      INCOME LIST
  ========================================================= */
  function renderIncomeList() {
    if (!els.incomeList) return;
    els.incomeList.innerHTML = "";

    if (!incomeData.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.style.display = "block";
      li.textContent = "No income added yet";
      els.incomeList.appendChild(li);
      return;
    }

    incomeData.forEach((item, i) => {
      const li = document.createElement("li");
      li.style.animationDelay = `${Math.min(i * 40, 300)}ms`;
      li.innerHTML = `
        <span class="src">${esc(item.source)}</span>
        <span class="val">${formatCurrency(item.amount)}</span>
        <button class="delete-btn" type="button" aria-label="Delete">✕</button>
      `;
      li.querySelector(".delete-btn").addEventListener("click", () => {
        incomeData.splice(i, 1);
        saveData();
        renderAll();
      });
      els.incomeList.appendChild(li);
    });
  }

  /* =========================================================
      EXPENSE TABLE
  ========================================================= */
  function renderExpenseTable() {
    if (!els.expenseTableBody) return;
    els.expenseTableBody.innerHTML = "";

    if (!expenseData.length) {
      els.expenseTableBody.innerHTML =
        `<tr><td colspan="5" class="table-empty">No expenses yet — add your first one above</td></tr>`;
    } else {
      expenseData.forEach((item, i) => {
        const cat = CATEGORY_COLORS[item.category] ? item.category : "Other";
        const tr = document.createElement("tr");
        tr.style.animationDelay = `${Math.min(i * 30, 300)}ms`;
        tr.innerHTML = `
          <td class="date">${esc(item.date)}</td>
          <td>${esc(item.desc)}</td>
          <td><span class="pill ${cat}">${esc(item.category)}</span></td>
          <td class="right amt">${formatCurrency(item.amount)}</td>
          <td class="right"><button class="delete-btn" type="button" aria-label="Delete">✕</button></td>
        `;
        tr.querySelector(".delete-btn").addEventListener("click", () => {
          expenseData.splice(i, 1);
          saveData();
          renderAll();
        });
        els.expenseTableBody.appendChild(tr);
      });
    }

    if (els.expenseCount) {
      els.expenseCount.textContent =
        `${expenseData.length} item${expenseData.length === 1 ? "" : "s"}`;
    }
  }

  /* =========================================================
      DONUT CHART
  ========================================================= */
  const SVG_NS = "http://www.w3.org/2000/svg";
  const R = 45;
  const CIRC = 2 * Math.PI * R;

  function categoryTotals() {
    const map = {};
    expenseData.forEach((e) => {
      const cat = CATEGORY_COLORS[e.category] ? e.category : "Other";
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1]);
  }

  function renderDonut() {
    if (!els.donut) return;
    els.donut.innerHTML = "";
    if (els.legend) els.legend.innerHTML = "";

    const data = categoryTotals();
    const total = data.reduce((s, [, v]) => s + v, 0);

    if (els.donutValue) els.donutValue.textContent = formatCurrency(total);

    // Track ring
    const track = document.createElementNS(SVG_NS, "circle");
    track.setAttribute("cx", 60);
    track.setAttribute("cy", 60);
    track.setAttribute("r", R);
    track.setAttribute("stroke", "rgba(255,255,255,0.06)");
    track.setAttribute("stroke-width", 14);
    els.donut.appendChild(track);

    if (!total) {
      if (els.legend) {
        els.legend.innerHTML = `<div class="empty">No spending data yet</div>`;
      }
      return;
    }

    let offset = 0;
    const arcs = [];

    data.forEach(([cat, val], idx) => {
      const frac = val / total;
      const len = frac * CIRC;
      const gap = data.length > 1 ? 2 : 0;

      const arc = document.createElementNS(SVG_NS, "circle");
      arc.setAttribute("cx", 60);
      arc.setAttribute("cy", 60);
      arc.setAttribute("r", R);
      arc.setAttribute("stroke", CATEGORY_COLORS[cat]);
      arc.setAttribute("stroke-width", 14);
      arc.setAttribute("stroke-dasharray", `${Math.max(len - gap, 0.6)} ${CIRC}`);
      arc.setAttribute("stroke-dashoffset", -offset);
      arc.style.strokeDasharray = `0 ${CIRC}`;
      arc.style.filter = `drop-shadow(0 0 6px ${CATEGORY_COLORS[cat]}66)`;
      els.donut.appendChild(arc);
      arcs.push({ el: arc, len: Math.max(len - gap, 0.6), cat });

      // animate in
      setTimeout(() => {
        arc.style.strokeDasharray = `${Math.max(len - gap, 0.6)} ${CIRC}`;
      }, 60 + idx * 90);

      offset += len;

      // Legend row
      if (els.legend) {
        const row = document.createElement("div");
        row.className = "legend-item";
        row.style.animationDelay = `${idx * 60}ms`;
        row.innerHTML = `
          <span class="legend-dot" style="background:${CATEGORY_COLORS[cat]};box-shadow:0 0 10px ${CATEGORY_COLORS[cat]}"></span>
          <span class="legend-name">${esc(cat)}</span>
          <span class="legend-pct">${Math.round(frac * 100)}%</span>
          <span class="legend-amt" style="color:${CATEGORY_COLORS[cat]}">${formatCurrency(val)}</span>
        `;
        row.addEventListener("mouseenter", () => {
          arcs.forEach((a) => a.el.classList.toggle("dim", a.cat !== cat));
        });
        row.addEventListener("mouseleave", () => {
          arcs.forEach((a) => a.el.classList.remove("dim"));
        });
        els.legend.appendChild(row);
      }
    });
  }

  /* =========================================================
      RENDER ALL
  ========================================================= */
  function renderAll() {
    renderIncomeList();
    renderExpenseTable();
    renderDonut();
    renderSummary();
  }

  /* =========================================================
      FORMS
  ========================================================= */
  function shake(el) {
    if (!el) return;
    el.style.borderColor = "#fb7185";
    el.focus();
    setTimeout(() => (el.style.borderColor = ""), 900);
  }

  if (els.incomeForm) {
    els.incomeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const src = els.incomeSource.value.trim();
      const amt = Number(els.incomeAmount.value);
      if (!src) return shake(els.incomeSource);
      if (!(amt > 0)) return shake(els.incomeAmount);

      incomeData.push({ source: src, amount: amt });
      saveData();
      els.incomeSource.value = "";
      els.incomeAmount.value = "";
      renderAll();
    });
  }

  if (els.expenseForm) {
    els.expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const desc = els.expenseDesc.value.trim();
      const cat  = els.expenseCategory.value;
      const amt  = Number(els.expenseAmount.value);
      if (!desc) return shake(els.expenseDesc);
      if (!(amt > 0)) return shake(els.expenseAmount);

      const today = new Date().toISOString().slice(0, 10);
      expenseData.push({ date: today, desc, category: cat, amount: amt });
      saveData();
      els.expenseDesc.value = "";
      els.expenseAmount.value = "";
      renderAll();
    });
  }

  /* =========================================================
      AI PROMPT BUILDER
  ========================================================= */
  function buildPrompt(lang) {
    const { inc, exp, bal } = totals();

    const incLines = incomeData
      .map((i) => `- ${i.source}: ${i.amount} ${currentCurrency}`)
      .join("\n") || "- None";

    const expLines = expenseData
      .map((e) => `- [${e.category}] ${e.desc} (${e.date}): ${e.amount} ${currentCurrency}`)
      .join("\n") || "- None";

    if (lang === "uz") {
      return `
Siz moliyani sodda, juda tushunarli qilib tahlil qilasiz.
Matn telefon ekranida ham oson o'qiladigan bo'lsin.
Har bo'limni qisqa, punktlarda yozing.
Hech qanday ** belgisi yoki markdown ishlatmang.

UMUMIY RAQAMLAR:
- Jami daromad: ${inc} ${currentCurrency}
- Jami xarajat: ${exp} ${currentCurrency}
- Qoldiq: ${bal} ${currentCurrency}

DAROMAD RO'YXATI:
${incLines}

XARAJATLAR RO'YXATI:
${expLines}

Natijani faqat quyidagi strukturada yozing.
Bo'lim nomlari aniq shu ko'rinishda bo'lsin, lekin markdownsiz:

A) Qisqa va aniq xulosa
- 2–3 ta juda qisqa gap
- Daromad, xarajat, qoldiq haqida

B) Xarajatlarning asosiy yo'nalishlari
- 3–4 ta punkt
- Qaysi joyga pul ko'p ketayotgani

C) Eng zaif moliyaviy joylar
- 3 tagacha punkt
- Eng xavfli odatlar yoki kategoriyalar

D) Kategoriya bo'yicha sodda tahlil
- Har kategoriya uchun 1 ta satr
- Format: "- Debt: qisqa izoh"

E) Amalda bajariladigan o'lchanadigan takliflar
- 3–5 ta punkt
- Har birida aniq raqam yoki muddat bo'lsin

F) Kelajak uchun real prognoz
- 2–3 ta gap
- Agar hech narsa o'zgarmasa va agar tavsiyalar bajarilsa

G) Achchiq haqiqat, lekin o'qiladigan paragraf
- 1 ta paragraf
- Rostini ayting, lekin haddan tashqari ilmiy yoki drama qilmasdan

H) Moliyaviy sog'liqni yaxshilash uchun qolgan pulni boshqarish bo'yicha ko'rsatmalar bering.
- 5 ta amaliy maslahat
- Har bir maslahat qisqa va bajarish oson bo'lsin.

Qoidalar:
- Juda uzun matn yozmang.
- Har bo'lim 3–4 qatordan oshmasin.
- Hech qanday markdown belgisi, ayniqsa yulduzcha belgilari ishlatmang.
`;
    }

    return `
You analyze the budget in a simple, human style.
The result must be easy to read on a phone screen.
Use short sentences and plain text.
Do NOT use any markdown or ** characters.

OVERVIEW NUMBERS:
- Total income: ${inc} ${currentCurrency}
- Total expenses: ${exp} ${currentCurrency}
- Balance: ${bal} ${currentCurrency}

INCOME LIST:
${incLines}

EXPENSE LIST:
${expLines}

Write the result in this exact structure.
Keep the section titles exactly like this, without markdown:

A) Short clear summary
- 2–3 short lines
- Mention income, expenses, and balance

B) Main spending patterns
- 3–4 bullet points
- Where most of the money goes

C) Weak financial points
- Up to 3 bullets
- The most dangerous habits or categories

D) Simple category-by-category analysis
- One line per category
- Example: "- Food: short comment"

E) Specific realistic improvements
- 3–5 bullet points
- Each with concrete numbers or timeframes

F) Grounded future projection
- 2–3 sentences
- One for "if nothing changes", one for "if improvements are made"

G) Brutally honest but readable paragraph
- 1 paragraph
- Direct but not academic

H) Give instructions to improve financial health with left money management tips.
- 5 practical tips
- Each tip should be concise and actionable.

Rules:
- Do NOT write long essays.
- Keep each section short and scannable.
- Do NOT use any markdown or asterisks.
`;
  }

  /* =========================================================
      AI OUTPUT FORMATTING
  ========================================================= */
  function renderAiText(text) {
    const lines = String(text).split("\n");
    return lines
      .map((line) => {
        const t = line.trim();
        if (/^[A-H]\)/.test(t)) {
          return `<span class="ai-h">${esc(t)}</span>`;
        }
        return esc(line);
      })
      .join("\n");
  }

  /* =========================================================
      BACKEND CALL
  ========================================================= */
  async function sendToBackend(prompt) {
    if (!els.aiPopup || !els.aiPopupOutput) return;

    els.aiPopup.classList.add("show");
    els.aiPopupOutput.innerHTML = `
      <div class="ai-loading">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>Analyzing your budget…</span>
      </div>`;

    try {
      const res = await fetch("http://localhost:4000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      els.aiPopupOutput.innerHTML = renderAiText(data.analysis || "No response.");
    } catch {
      els.aiPopupOutput.innerHTML =
        `<span class="ai-h">Connection error</span>\nBackend is not reachable at localhost:4000.`;
    }
  }

  if (els.aiAnalyzeBtn) {
    els.aiAnalyzeBtn.addEventListener("click", () => {
      const lang = els.langSelect ? els.langSelect.value : "en";
      sendToBackend(buildPrompt(lang));
    });
  }

  /* =========================================================
      POPUP CLOSE
  ========================================================= */
  function closePopup() {
    if (els.aiPopup) els.aiPopup.classList.remove("show");
  }

  if (els.aiCloseBtn) els.aiCloseBtn.addEventListener("click", closePopup);

  if (els.aiPopup) {
    els.aiPopup.addEventListener("click", (e) => {
      if (e.target === els.aiPopup) closePopup();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });

  /* =========================================================
      INIT
  ========================================================= */
  renderAll();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentSeason) {
        const s = currentSeason;
        currentSeason = null;
        setSeasonDecor(s);
      }
    }, 300);
  });
});
