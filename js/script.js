/**
 * Expense & Budget Visualizer
 * Vanilla JS — no frameworks, no build tools.
 * All data persisted to localStorage.
 *
 * Features:
 *  - Add / delete transactions (MVP)
 *  - Total balance with auto-update (MVP)
 *  - Pie chart by category via Chart.js (MVP)
 *  - Dark / Light mode toggle  [Feature 1]
 *  - Sort transactions by amount or category  [Feature 2]
 *  - Spending limit warning  [Feature 3]
 */

'use strict';

// ============================================================
// Constants
// ============================================================

/** localStorage keys */
const STORAGE_KEY       = 'expense_transactions';
const THEME_KEY         = 'expense_theme';
const LIMIT_KEY         = 'expense_limit';

/**
 * Category configuration — display label, badge CSS class, chart colour.
 * Adding a new category only requires a new entry here.
 */
const CATEGORIES = {
  Food:      { label: '🍔 Food',      badgeClass: 'badge-food',      color: '#16a34a' },
  Transport: { label: '🚌 Transport', badgeClass: 'badge-transport', color: '#2563eb' },
  Fun:       { label: '🎉 Fun',       badgeClass: 'badge-fun',       color: '#ea580c' },
};

// ============================================================
// Application State
// ============================================================

/** In-memory array — single source of truth for transactions */
let transactions = [];

/** Reference to the Chart.js instance (destroyed before re-creation) */
let chartInstance = null;

/** Current sort key — one of: "default" | "amount-asc" | "amount-desc" | "category-az" */
let currentSort = 'default';

/** Spending limit in Rupiah; 0 means no limit is active */
let spendingLimit = 0;

// ============================================================
// ── Feature 1: Dark / Light Mode ──────────────────────────
// ============================================================

/**
 * Read the saved theme from localStorage and apply it to <html>.
 * Falls back to "light" if no preference is stored.
 */
function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const theme = saved === 'dark' ? 'dark' : 'light';
  applyTheme(theme);
}

/**
 * Apply a theme by setting data-theme on <html> and updating the toggle button.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (theme === 'dark') {
    btn.textContent = '☀️';
    btn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    btn.textContent = '🌙';
    btn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

/**
 * Toggle between dark and light mode, persist the choice.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch { /* storage unavailable — continue without persisting */ }
  applyTheme(next);
}

// ============================================================
// ── Feature 2: Sort Transactions ──────────────────────────
// ============================================================

/**
 * Return a sorted copy of `transactions` according to `currentSort`.
 * The original array order is never mutated (preserves insertion order for "default").
 * @returns {Array}
 */
function getSortedTransactions() {
  const copy = [...transactions];
  switch (currentSort) {
    case 'amount-asc':
      return copy.sort((a, b) => a.amount - b.amount);
    case 'amount-desc':
      return copy.sort((a, b) => b.amount - a.amount);
    case 'category-az':
      return copy.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return copy; // insertion order (newest-first, as pushed)
  }
}

// ============================================================
// ── Feature 3: Spending Limit ─────────────────────────────
// ============================================================

/**
 * Load the spending limit from localStorage.
 * Returns 0 if not set or invalid.
 */
function loadLimit() {
  try {
    const raw = localStorage.getItem(LIMIT_KEY);
    const val = parseFloat(raw);
    return isFinite(val) && val > 0 ? val : 0;
  } catch {
    return 0;
  }
}

/**
 * Persist the current spending limit to localStorage.
 */
function saveLimit() {
  try {
    localStorage.setItem(LIMIT_KEY, String(spendingLimit));
  } catch { /* continue without persisting */ }
}

/**
 * Handle "Set" button click: read the limit input, validate, save, re-render balance.
 */
function handleSetLimit() {
  const input = document.getElementById('limit-input');
  const val   = parseFloat(input.value);

  if (!input.value.trim() || isNaN(val) || val <= 0) {
    // Flash a brief shake if invalid
    input.classList.add('input-shake');
    setTimeout(() => input.classList.remove('input-shake'), 400);
    return;
  }

  spendingLimit = val;
  saveLimit();
  updateLimitUI();
  renderBalance();
}

/**
 * Clear the active spending limit.
 */
function handleClearLimit() {
  spendingLimit = 0;
  saveLimit();
  document.getElementById('limit-input').value = '';
  updateLimitUI();
  renderBalance();
}

/**
 * Sync the limit input field and clear-button visibility to current state.
 */
function updateLimitUI() {
  const input    = document.getElementById('limit-input');
  const clearBtn = document.getElementById('limit-clear-btn');

  if (spendingLimit > 0) {
    input.value = spendingLimit;
    clearBtn.classList.remove('hidden');
  } else {
    input.value = '';
    clearBtn.classList.add('hidden');
  }
}

// ============================================================
// Persistence — transactions
// ============================================================

/**
 * Load transactions from localStorage.
 * Returns an empty array if storage is unavailable or data is corrupted.
 * @returns {Array}
 */
function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist the current transactions array to localStorage.
 */
function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch { /* storage unavailable — continue */ }
}

// ============================================================
// Data mutations
// ============================================================

/**
 * Create and add a new transaction.
 * @param {string} name
 * @param {number} amount
 * @param {string} category
 */
function addTransaction(name, amount, category) {
  const transaction = {
    id:       generateId(),
    name:     name.trim(),
    amount:   parseFloat(amount),
    category: category,
    date:     new Date().toISOString(),
  };
  transactions.unshift(transaction); // newest first
  saveTransactions();
  renderAll();
}

/**
 * Remove a transaction by id.
 * @param {string} id
 */
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderAll();
}

// ============================================================
// Rendering
// ============================================================

/**
 * Re-render every reactive part of the UI.
 * Call this after every state change.
 */
function renderAll() {
  renderBalance();
  renderList();
  renderChart();
}

/**
 * Update the total-balance card, including limit warning (Feature 3).
 */
function renderBalance() {
  const total      = transactions.reduce((sum, t) => sum + t.amount, 0);
  const amountEl   = document.getElementById('balance-amount');
  const warningEl  = document.getElementById('balance-warning');
  const balanceCard = document.getElementById('balance-card');

  amountEl.textContent = formatCurrency(total);

  const overLimit = spendingLimit > 0 && total > spendingLimit;

  if (overLimit) {
    balanceCard.classList.add('balance-card--warning');
    warningEl.textContent = `⚠️ Over limit by ${formatCurrency(total - spendingLimit)}`;
    warningEl.classList.remove('hidden');
  } else {
    balanceCard.classList.remove('balance-card--warning');
    warningEl.classList.add('hidden');
    warningEl.textContent = '';
  }
}

/**
 * Rebuild the transaction list in the DOM.
 * Uses getSortedTransactions() to respect the current sort order (Feature 2).
 */
function renderList() {
  const list     = document.getElementById('transaction-list');
  const emptyMsg = document.getElementById('empty-state');

  list.innerHTML = '';

  if (transactions.length === 0) {
    emptyMsg.classList.remove('hidden');
    return;
  }

  emptyMsg.classList.add('hidden');

  // Use sorted copy — does NOT mutate the source array
  getSortedTransactions().forEach(t => {
    list.appendChild(createTransactionElement(t));
  });
}

/**
 * Create a single <li> element for a transaction.
 * @param {Object} t
 * @returns {HTMLLIElement}
 */
function createTransactionElement(t) {
  const cat = CATEGORIES[t.category] || { label: t.category, badgeClass: '', color: '#888' };

  const li = document.createElement('li');
  li.className = 'transaction-item';
  li.dataset.id = t.id;

  li.innerHTML = `
    <div class="transaction-info">
      <span class="transaction-name" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</span>
      <span class="badge ${cat.badgeClass}">${t.category}</span>
    </div>
    <div class="transaction-meta">
      <span class="transaction-amount">${formatCurrency(t.amount)}</span>
      <button
        class="btn btn-danger"
        aria-label="Delete ${escapeHtml(t.name)}"
        data-id="${t.id}"
      >Delete</button>
    </div>
  `;

  li.querySelector('.btn-danger').addEventListener('click', () => {
    deleteTransaction(t.id);
  });

  return li;
}

/**
 * Build or update the pie chart using Chart.js.
 */
function renderChart() {
  const wrapper     = document.getElementById('chart-wrapper');
  const placeholder = document.getElementById('chart-placeholder');
  const canvas      = document.getElementById('spending-chart');

  if (transactions.length === 0) {
    wrapper.classList.add('hidden');
    placeholder.classList.remove('hidden');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    return;
  }

  placeholder.classList.add('hidden');
  wrapper.classList.remove('hidden');

  // Aggregate totals per category
  const totals = {};
  transactions.forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const labels = Object.keys(totals);
  const data   = labels.map(k => totals[k]);
  const colors = labels.map(k => (CATEGORIES[k] ? CATEGORIES[k].color : '#888'));

  // Destroy old instance to prevent canvas reuse errors
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data:            data,
        backgroundColor: colors,
        borderColor:     'transparent',
        borderWidth:     3,
        hoverOffset:     8,
      }],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font:          { size: 13, family: "'Segoe UI', system-ui, sans-serif" },
            padding:       16,
            usePointStyle: true,
            pointStyle:    'circle',
            // Show label + percentage
            generateLabels: function(chart) {
              const meta  = chart.getDatasetMeta(0);
              const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              return chart.data.labels.map((label, i) => {
                const value = chart.data.datasets[0].data[i];
                const pct   = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return {
                  text:        `${label}  ${pct}%`,
                  fillStyle:   chart.data.datasets[0].backgroundColor[i],
                  strokeStyle: 'transparent',
                  hidden:      meta.data[i] && meta.data[i].hidden,
                  index:       i,
                };
              });
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const pct   = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `  ${formatCurrency(value)}  (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

// ============================================================
// Form handling
// ============================================================

/**
 * Handle the "Add Transaction" form submission.
 * Validates inputs, shows errors if needed, calls addTransaction on success.
 * @param {Event} e
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const nameInput     = document.getElementById('item-name');
  const amountInput   = document.getElementById('item-amount');
  const categoryInput = document.getElementById('item-category');
  const errorMsg      = document.getElementById('error-msg');

  const name     = nameInput.value.trim();
  const amount   = amountInput.value.trim();
  const category = categoryInput.value;

  if (!name) {
    showError(errorMsg, 'Please enter an item name.');
    nameInput.focus();
    return;
  }
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    showError(errorMsg, 'Amount must be a positive number greater than zero.');
    amountInput.focus();
    return;
  }
  if (!category) {
    showError(errorMsg, 'Please select a category.');
    categoryInput.focus();
    return;
  }

  clearError(errorMsg);
  addTransaction(name, Number(amount), category);
  e.target.reset();
  nameInput.focus();
}

/** Display an inline error message. */
function showError(el, message) {
  el.textContent = message;
  el.classList.remove('hidden');
}

/** Hide the inline error message. */
function clearError(el) {
  el.textContent = '';
  el.classList.add('hidden');
}

// ============================================================
// Utilities
// ============================================================

/**
 * Format a number as Indonesian Rupiah.
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate a reasonably unique ID.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ============================================================
// Initialisation
// ============================================================

/**
 * Bootstrap the app:
 *  1. Apply saved theme (Feature 1)
 *  2. Load persisted transactions
 *  3. Load persisted spending limit (Feature 3)
 *  4. Render the full UI
 *  5. Attach all event listeners
 */
function init() {
  // ── Feature 1: theme ──────────────────────────────────────
  loadTheme();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // ── Core: transactions ────────────────────────────────────
  transactions = loadTransactions();

  // ── Feature 3: spending limit ─────────────────────────────
  spendingLimit = loadLimit();
  updateLimitUI();

  document.getElementById('limit-set-btn').addEventListener('click', handleSetLimit);
  document.getElementById('limit-clear-btn').addEventListener('click', handleClearLimit);

  // Allow pressing Enter inside the limit input to set it
  document.getElementById('limit-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSetLimit(); }
  });

  // ── Feature 2: sort dropdown ──────────────────────────────
  document.getElementById('sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderList(); // only list needs to change — balance/chart are unaffected
  });

  // ── Core: form submission ─────────────────────────────────
  document.getElementById('transaction-form').addEventListener('submit', handleFormSubmit);

  // Clear validation error as user types
  ['item-name', 'item-amount', 'item-category'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      clearError(document.getElementById('error-msg'));
    });
  });

  // ── Initial render ────────────────────────────────────────
  renderAll();
}

// Start the app once the DOM is ready
document.addEventListener('DOMContentLoaded', init);
