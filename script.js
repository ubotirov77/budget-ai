document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
      MONTH SELECTOR + SEASON DECOR
  --------------------------------------------------------- */

  const monthBtn  = document.getElementById("month-btn");
  const monthList = document.getElementById("month-list");

  const monthSeasonMap = {
    January: "winter",
    February: "winter",
    December: "winter",
    March: "spring",
    April: "spring",
    May: "spring",
    June: "summer",
    July: "summer",
    August: "summer",
    September: "autumn",
    October: "autumn",
    November: "autumn"
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  let currentSeason   = null;
  let decorContainer  = null;
  let decorParticles  = [];
  let decorAnimID     = null;

  function applySeasonTheme(season) {
    ["winter","spring","summer","autumn"].forEach(s => {
      document.body.classList.remove(`theme-${s}`);
    });

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
  }

  function createDecorContainer() {
    const c = document.createElement("div");
    Object.assign(c.style, {
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 999
    });
    document.body.appendChild(c);
    return c;
  }

  function createParticle(opts) {
    const el = document.createElement("span");
    el.textContent = opts.char;

    Object.assign(el.style, {
      position: "absolute",
      fontSize: `${opts.size}px`,
      opacity: opts.opacity,
      left: `${opts.x}px`,
      top: `${opts.y}px`,
      filter: `blur(${opts.blur || 0}px)`,
      willChange: "transform"
    });

    decorContainer.appendChild(el);
    return { ...opts, el };
  }

  function initWinter() {
    const w = innerWidth, h = innerHeight;
    for (let i = 0; i < 40; i++) {
      decorParticles.push(
        createParticle({
          char: "❄",
          x: Math.random()*w,
          y: Math.random()*h,
          size: 14 + Math.random()*10,
          opacity: 0.4 + Math.random()*0.4,
          blur: 1,
          speedY: 0.5 + Math.random()*1.5,
          speedX: -0.3 + Math.random()*0.6,
          rotate: Math.random()*360,
          rotateSpeed: -0.2 + Math.random()*0.4,
          type: "snow"
        })
      );
    }
  }

  function initSpring() {
    const w = innerWidth, h = innerHeight;
    for (let i = 0; i < 25; i++) {
      decorParticles.push(
        createParticle({
          char: "🌸",
          x: Math.random()*w,
          y: Math.random()*h,
          size: 16 + Math.random()*10,
          opacity: 0.5 + Math.random()*0.4,
          speedY: 0.3 + Math.random(),
          speedX: 0.2 + Math.random()*0.6,
          rotate: Math.random()*360,
          rotateSpeed: -0.3 + Math.random()*0.6,
          type: "petal"
        })
      );
    }
  }

  function initSummer() {
    const w = innerWidth;
    const cx = w - 80;
    const cy = 80;

    for (let i = 0; i < 12; i++) {
      const ang = (Math.PI * 2 * i) / 12;

      decorParticles.push(
        createParticle({
          char: "☀️",
          x: cx + Math.cos(ang)*60,
          y: cy + Math.sin(ang)*60,
          size: 22,
          opacity: 0.8,
          rotate: ang,
          rotateSpeed: 0.008,
          radius: 60,
          centerX: cx,
          centerY: cy,
          type: "sun"
        })
      );
    }
  }

  function initAutumn() {
    const w = innerWidth, h = innerHeight;
    const leaves = ["🍂","🍁","🍃"];

    for (let i = 0; i < 30; i++) {
      decorParticles.push(
        createParticle({
          char: leaves[Math.floor(Math.random()*leaves.length)],
          x: Math.random()*w,
          y: Math.random()*h,
          size: 18 + Math.random()*10,
          opacity: 0.5 + Math.random()*0.4,
          speedY: 0.4 + Math.random(),
          speedX: -0.4 + Math.random()*0.8,
          rotate: Math.random()*360,
          rotateSpeed: -0.2 + Math.random()*0.4,
          type: "leaf"
        })
      );
    }
  }

  function animateDecor() {
    const w = innerWidth, h = innerHeight;

    decorParticles.forEach(p => {
      if (p.type === "sun") {
        p.rotate += p.rotateSpeed;
        p.x = p.centerX + Math.cos(p.rotate)*p.radius;
        p.y = p.centerY + Math.sin(p.rotate)*p.radius;
      } else {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotate += p.rotateSpeed;

        if (p.y > h + 40) p.y = -40;
        if (p.x > w + 40) p.x = -40;
        if (p.x < -40) p.x = w + 40;
      }

      p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`;
    });

    decorAnimID = requestAnimationFrame(animateDecor);
  }

  function setSeasonDecor(season) {
    if (season === currentSeason) return;
    clearDecor();
    currentSeason = season;

    if (!season) return;

    decorContainer = createDecorContainer();

    if (season === "winter") initWinter();
    if (season === "spring") initSpring();
    if (season === "summer") initSummer();
    if (season === "autumn") initAutumn();

    animateDecor();
  }

  /* Month dropdown */
  if (monthBtn && monthList) {
    monthBtn.addEventListener("click", () => {
      monthList.classList.toggle("hidden");
    });

    document.querySelectorAll("#month-list li").forEach(li => {
      li.addEventListener("click", () => {
        const m = li.dataset.month;
        monthBtn.textContent = `${m} Budget`;
        monthList.classList.add("hidden");
        applySeasonTheme(monthSeasonMap[m]);
      });
    });

    // Initial: real current month
    const now = new Date();
    const currentMonthName = monthNames[now.getMonth()];
    if (currentMonthName) {
      monthBtn.textContent = `${currentMonthName} Budget`;
      applySeasonTheme(monthSeasonMap[currentMonthName]);
    } else {
      const initMonth = monthBtn.textContent.split(" ")[0];
      applySeasonTheme(monthSeasonMap[initMonth]);
    }
  }

  /* ---------------------------------------------------------
      LOCAL STORAGE SYSTEM
  --------------------------------------------------------- */
  let incomeData  = JSON.parse(localStorage.getItem("incomeData")  || "[]");
  let expenseData = JSON.parse(localStorage.getItem("expenseData") || "[]");

  function saveData() {
    localStorage.setItem("incomeData",  JSON.stringify(incomeData));
    localStorage.setItem("expenseData", JSON.stringify(expenseData));
  }

  /* ---------------------------------------------------------
      UI ELEMENTS
  --------------------------------------------------------- */
  const els = {
    totalIncome:       document.getElementById("total-income"),
    totalExpenses:     document.getElementById("total-expenses"),
    totalBalance:      document.getElementById("total-balance"),

    incomeList:        document.getElementById("income-list"),
    expenseTableBody:  document.getElementById("expense-table-body"),
    expenseCount:      document.getElementById("expense-count"),

    incomeForm:        document.getElementById("income-form"),
    incomeSource:      document.getElementById("income-source"),
    incomeAmount:      document.getElementById("income-amount"),

    expenseForm:       document.getElementById("expense-form"),
    expenseDesc:       document.getElementById("expense-desc"),
    expenseCategory:   document.getElementById("expense-category"),
    expenseAmount:     document.getElementById("expense-amount"),

    langSelect:        document.getElementById("lang-select"),
    currencySelect:    document.getElementById("currency-select"),

    aiAnalyzeBtn:      document.getElementById("ai-analyze-btn"),
    aiPopup:           document.getElementById("ai-popup"),
    aiPopupOutput:     document.getElementById("popup-ai-output"),
    aiCloseBtn:        document.getElementById("ai-close-btn")
  };

  /* ---------------------------------------------------------
      CURRENCY SYSTEM
  --------------------------------------------------------- */

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
      return `${currentCurrency} ${num}`;
    }
  }

  if (els.currencySelect) {
    els.currencySelect.value = currentCurrency;

    els.currencySelect.addEventListener("change", () => {
      currentCurrency = els.currencySelect.value;
      localStorage.setItem("budgetCurrency", currentCurrency);
      renderSummary();
      renderIncomeList();
      renderExpenseTable();
    });
  }

  /* ---------------------------------------------------------
      SUMMARY RENDER
  --------------------------------------------------------- */

  function renderSummary() {
    const inc = incomeData.reduce((s, i) => s + i.amount, 0);
    const exp = expenseData.reduce((s, e) => s + e.amount, 0);
    const bal = inc - exp;

    if (els.totalIncome)  els.totalIncome.textContent  = formatCurrency(inc);
    if (els.totalExpenses)els.totalExpenses.textContent= formatCurrency(exp);
    if (els.totalBalance) els.totalBalance.textContent = formatCurrency(bal);
  }

  /* ---------------------------------------------------------
      RENDER LISTS
  --------------------------------------------------------- */

  function renderIncomeList() {
    if (!els.incomeList) return;
    els.incomeList.innerHTML = "";

    incomeData.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.source}</span>
        <span>${formatCurrency(item.amount)}</span>
        <button class="delete-btn">✖</button>
      `;

      li.querySelector(".delete-btn").addEventListener("click", () => {
        incomeData.splice(i, 1);
        saveData();
        renderIncomeList();
        renderSummary();
      });

      els.incomeList.appendChild(li);
    });
  }

  function renderExpenseTable() {
    if (!els.expenseTableBody) return;
    els.expenseTableBody.innerHTML = "";

    expenseData.forEach((item, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.date}</td>
        <td>${item.desc}</td>
        <td>${item.category}</td>
        <td class="right">${formatCurrency(item.amount)}</td>
        <td><button class="delete-btn">✖</button></td>
      `;

      tr.querySelector(".delete-btn").addEventListener("click", () => {
        expenseData.splice(i, 1);
        saveData();
        renderExpenseTable();
        renderSummary();
      });

      els.expenseTableBody.appendChild(tr);
    });

    if (els.expenseCount) {
      els.expenseCount.textContent = `${expenseData.length} items`;
    }
  }

  /* ---------------------------------------------------------
      FORM HANDLERS
  --------------------------------------------------------- */

  if (els.incomeForm) {
    els.incomeForm.addEventListener("submit", e => {
      e.preventDefault();
      const src = els.incomeSource.value.trim();
      const amt = Number(els.incomeAmount.value);

      if (!src || amt <= 0) return;

      incomeData.push({ source: src, amount: amt });
      saveData();
      els.incomeSource.value = "";
      els.incomeAmount.value = "";

      renderIncomeList();
      renderSummary();
    });
  }

  if (els.expenseForm) {
    els.expenseForm.addEventListener("submit", e => {
      e.preventDefault();
      const desc = els.expenseDesc.value.trim();
      const cat  = els.expenseCategory.value;
      const amt  = Number(els.expenseAmount.value);

      if (!desc || amt <= 0) return;

      const today = new Date().toISOString().slice(0, 10);
      expenseData.push({ date: today, desc, category: cat, amount: amt });

      saveData();
      els.expenseDesc.value = "";
      els.expenseAmount.value = "";

      renderExpenseTable();
      renderSummary();
    });
  }

  /* ---------------------------------------------------------
      AI PROMPT BUILDER
  --------------------------------------------------------- */

  function buildPrompt(lang) {
    const inc = incomeData.reduce((s,i)=>s+i.amount,0);
    const exp = expenseData.reduce((s,e)=>s+e.amount,0);
    const bal = inc - exp;

    const incLines = incomeData
      .map(i => `- ${i.source}: ${i.amount} ${currentCurrency}`)
      .join("\n") || "- None";

    const expLines = expenseData
      .map(e => `- [${e.category}] ${e.desc} (${e.date}): ${e.amount} ${currentCurrency}`)
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

H) Moliyaviy sog‘liqni yaxshilash uchun qolgan pulni boshqarish bo‘yicha ko‘rsatmalar bering.
- 5 ta amaliy maslahat
- Har bir maslahat qisqa va bajarish oson bo‘lsin.

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

  /* ---------------------------------------------------------
      AI BACKEND CALL
  --------------------------------------------------------- */

  async function sendToBackend(prompt) {
    if (!els.aiPopup || !els.aiPopupOutput) return;

    els.aiPopup.classList.add("show");
    els.aiPopupOutput.textContent = "Analyzing...";

    try {
      const res = await fetch("http://localhost:4000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      els.aiPopupOutput.innerHTML = (data.analysis || "No response.")
        .replace(/\n/g, "<br>");
        
    } catch (err) {
      els.aiPopupOutput.textContent = "Error: Backend connection failed.";
    }
  }

  /* ---------------------------------------------------------
      AI BUTTON CLICK
  --------------------------------------------------------- */

  if (els.aiAnalyzeBtn) {
    els.aiAnalyzeBtn.addEventListener("click", () => {
      const lang = els.langSelect ? els.langSelect.value : "en";
      const prompt = buildPrompt(lang);
      sendToBackend(prompt);
    });
  }

  /* ---------------------------------------------------------
      CLOSE POPUP
  --------------------------------------------------------- */

  if (els.aiCloseBtn && els.aiPopup) {
    els.aiCloseBtn.addEventListener("click", () => {
      els.aiPopup.classList.remove("show");
    });

    // optional: click backdrop to close
    els.aiPopup.addEventListener("click", (e) => {
      if (e.target === els.aiPopup) {
        els.aiPopup.classList.remove("show");
      }
    });

    // optional: ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        els.aiPopup.classList.remove("show");
      }
    });
  }

  /* ---------------------------------------------------------
      INITIAL RENDER
  --------------------------------------------------------- */

  renderIncomeList();
  renderExpenseTable();
  renderSummary();

});
