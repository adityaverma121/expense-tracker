// Personal Expense Tracker - Vanilla JS

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Other",
];

const STORAGE_KEY = "expenses_v1";
const THEME_KEY = "theme_preference_v1"; // "light" | "dark"

function readExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function todayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isFuture(dateStr) {
  if (!dateStr) return false;
  const now = new Date(todayISO());
  const d = new Date(dateStr);
  return d.getTime() > now.getTime();
}

function toCurrency(amountNumber) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
  return formatter.format(amountNumber);
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function validateExpense({ amount, category, date }) {
  const errors = {};
  if (!(amount > 0)) errors.amount = "Amount must be a positive number";
  if (!category) errors.category = "Select a category";
  if (!date) errors.date = "Select a valid date";
  else if (isFuture(date)) errors.date = "Date cannot be in the future";
  return errors;
}

function showErrors(errors) {
  const fields = ["amount", "category", "date"];
  fields.forEach((name) => {
    const el = document.querySelector(`.error[data-error-for="${name}"]`);
    if (!el) return;
    el.textContent = errors?.[name] ?? "";
  });
}

const state = {
  filterCategory: "ALL",
  filterFrom: "",
  filterTo: "",
};

function applyFilters(expenses) {
  let result = [...expenses];
  if (state.filterCategory && state.filterCategory !== "ALL") {
    result = result.filter((e) => e.category === state.filterCategory);
  }
  if (state.filterFrom) {
    const fromTs = new Date(state.filterFrom).getTime();
    result = result.filter((e) => new Date(e.date).getTime() >= fromTs);
  }
  if (state.filterTo) {
    const toTs = new Date(state.filterTo).getTime();
    result = result.filter((e) => new Date(e.date).getTime() <= toTs);
  }
  result.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (db !== da) return db - da; // newest first
    return String(b.id).localeCompare(String(a.id));
  });
  return result;
}

function renderExpenses(expenses) {
  const list = document.getElementById("expense-list");
  const empty = document.getElementById("empty-state");
  list.innerHTML = "";

  if (expenses.length === 0) {
    empty.style.display = "block";
    list.style.display = "none";
    return;
  }
  empty.style.display = "none";
  list.style.display = "flex";

  const fragment = document.createDocumentFragment();
  expenses.forEach((e) => {
    const li = document.createElement("li");
    li.className = "list-item";
    li.dataset.id = e.id;

    const main = document.createElement("div");
    main.className = "item-main";
    const meta = document.createElement("div");
    meta.className = "item-meta";
    const date = document.createElement("span");
    date.textContent = formatDisplayDate(e.date);
    const cat = document.createElement("span");
    cat.className = "badge";
    cat.textContent = e.category;
    meta.append(date, cat);

    const desc = document.createElement("div");
    desc.className = "description";
    desc.textContent = e.description || "";
    main.append(meta, desc);

    const amount = document.createElement("div");
    amount.className = "amount";
    amount.textContent = toCurrency(e.amount);

    const del = document.createElement("button");
    del.className = "danger";
    del.textContent = "Delete";
    del.setAttribute("data-action", "delete");

    li.append(main, amount, del);
    fragment.appendChild(li);
  });
  list.appendChild(fragment);
}

function renderStats(expenses) {
  const totalEl = document.getElementById("stat-total");
  const countEl = document.getElementById("stat-count");
  const breakdownEl = document.getElementById("category-breakdown");
  const monthlyEl = document.getElementById("monthly-summary");

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  totalEl.textContent = toCurrency(total);
  countEl.textContent = String(expenses.length);

  const byCategory = new Map();
  for (const e of expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) || 0) + Number(e.amount || 0));
  }
  breakdownEl.innerHTML = "";
  if (byCategory.size === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No data for breakdown.";
    breakdownEl.appendChild(empty);
    // fall through to clear monthly too
  }

  const max = Math.max(...byCategory.values());
  const entries = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  for (const [cat, amount] of entries) {
    const row = document.createElement("div");
    row.className = "breakdown-row";

    const label = document.createElement("div");
    label.className = "breakdown-label";
    label.textContent = cat;

    const bar = document.createElement("div");
    bar.className = "bar";
    const fill = document.createElement("span");
    const pct = max > 0 ? Math.round((amount / max) * 100) : 0;
    fill.style.width = `${pct}%`;
    bar.appendChild(fill);

    const value = document.createElement("div");
    value.className = "breakdown-value";
    value.textContent = toCurrency(amount);

    row.append(label, bar, value);
    breakdownEl.appendChild(row);
  }

  // Monthly summary: group by yyyy-mm
  if (monthlyEl) {
    monthlyEl.innerHTML = "";
    const byMonth = new Map();
    for (const e of expenses) {
      const d = new Date(e.date);
      if (isNaN(d)) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, (byMonth.get(key) || 0) + Number(e.amount || 0));
    }
    if (byMonth.size === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No data for monthly summary.";
      monthlyEl.appendChild(empty);
    } else {
      const maxM = Math.max(...byMonth.values());
      const entriesM = Array.from(byMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      for (const [month, amount] of entriesM) {
        const row = document.createElement("div");
        row.className = "breakdown-row";

        const label = document.createElement("div");
        label.className = "breakdown-label";
        label.textContent = month;

        const bar = document.createElement("div");
        bar.className = "bar";
        const fill = document.createElement("span");
        const pct = maxM > 0 ? Math.round((amount / maxM) * 100) : 0;
        fill.style.width = `${pct}%`;
        bar.appendChild(fill);

        const value = document.createElement("div");
        value.className = "breakdown-value";
        value.textContent = toCurrency(amount);

        row.append(label, bar, value);
        monthlyEl.appendChild(row);
      }
    }
  }
}

function syncDateMaxes() {
  const max = todayISO();
  const inputs = [
    document.getElementById("date"),
    document.getElementById("filter-from"),
    document.getElementById("filter-to"),
  ];
  inputs.forEach((el) => el && el.setAttribute("max", max));
}

function handleAddSubmit(ev, expenses) {
  ev.preventDefault();
  const form = ev.currentTarget;
  const amount = Number((form.amount?.value || "").trim());
  const category = (form.category?.value || "").trim();
  const date = (form.date?.value || "").trim();
  const description = (form.description?.value || "").trim();

  const errors = validateExpense({ amount, category, date });
  showErrors(errors);
  if (Object.keys(errors).length > 0) return;

  const newExpense = { id: generateId(), amount, category, date, description };
  expenses.push(newExpense);
  writeExpenses(expenses);

  form.reset();
  form.date.value = todayISO();

  renderAll();
}

function handleDelete(ev, expenses) {
  const btn = ev.target.closest("button[data-action='delete']");
  if (!btn) return;
  const li = btn.closest(".list-item");
  if (!li) return;
  const id = li.dataset.id;
  const index = expenses.findIndex((e) => e.id === id);
  if (index !== -1) {
    expenses.splice(index, 1);
    writeExpenses(expenses);
    renderAll();
  }
}

function readFilterUI() {
  state.filterCategory = document.getElementById("filter-category").value;
  state.filterFrom = document.getElementById("filter-from").value;
  state.filterTo = document.getElementById("filter-to").value;
}

function clearFiltersUI() {
  document.getElementById("filter-category").value = "ALL";
  document.getElementById("filter-from").value = "";
  document.getElementById("filter-to").value = "";
}

function renderAll() {
  const all = readExpenses();
  const filtered = applyFilters(all);
  renderExpenses(filtered);
  renderStats(filtered);
}

function init() {
  syncDateMaxes();
  // Theme setup
  const rootHtml = document.documentElement;
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  rootHtml.setAttribute('data-theme', initialTheme);
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    const setBtnState = () => {
      const isDark = rootHtml.getAttribute('data-theme') === 'dark';
      themeBtn.setAttribute('aria-pressed', String(isDark));
      themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    };
    setBtnState();
    themeBtn.addEventListener('click', () => {
      const current = rootHtml.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      rootHtml.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      setBtnState();
    });
  }
  const form = document.getElementById("expense-form");
  if (form) {
    form.date.value = todayISO();
    form.addEventListener("submit", (e) => handleAddSubmit(e, readExpenses()));
  }

  const list = document.getElementById("expense-list");
  if (list) {
    list.addEventListener("click", (e) => handleDelete(e, readExpenses()));
  }

  const filterEls = [
    document.getElementById("filter-category"),
    document.getElementById("filter-from"),
    document.getElementById("filter-to"),
  ];
  filterEls.forEach((el) => el && el.addEventListener("input", () => { readFilterUI(); renderAll(); }));

  const clearBtn = document.getElementById("clear-filters");
  clearBtn && clearBtn.addEventListener("click", () => { clearFiltersUI(); readFilterUI(); renderAll(); });

  // Export CSV
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const rows = readExpenses();
      if (!rows || rows.length === 0) {
        // no data
        const blob = new Blob(["id,date,category,amount,description\n"], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
      const escapeCell = (v) => {
        if (v === null || v === undefined) return '';
        const s = String(v).replace(/"/g, '""');
        if (/[",\n]/.test(s)) return '"' + s + '"';
        return s;
      };
      const header = ["id","date","category","amount","description"];
      const lines = [header.join(',')];
      for (const e of rows) {
        const line = [e.id, e.date, e.category, e.amount, e.description || ''].map(escapeCell).join(',');
        lines.push(line);
      }
      const csv = lines.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ts = new Date();
      const y = ts.getFullYear();
      const m = String(ts.getMonth()+1).padStart(2,'0');
      const d = String(ts.getDate()).padStart(2,'0');
      a.download = `expenses_${y}${m}${d}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  readFilterUI();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
