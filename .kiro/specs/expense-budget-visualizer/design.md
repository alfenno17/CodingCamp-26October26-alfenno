# Design — Expense & Budget Visualizer

## Architecture

A single-page application with zero build steps. The entire runtime is three files:

```
index.html   → DOM skeleton + Chart.js CDN link
css/style.css → all visual styles (mobile-first)
js/script.js  → all app logic (state, localStorage, rendering, chart)
```

### Data Flow
```
User Action (add / delete)
        │
        ▼
  state[] (in-memory array)
        │
   ┌────┴────┐
   │         │
localStorage  renderAll()
 (persist)    │
         ┌───┼────┐
         │   │    │
   renderList renderBalance renderChart
```

---

## Data Model

Each transaction is a plain JavaScript object stored in an array:

```js
{
  id:       string,   // crypto.randomUUID() or Date.now().toString()
  name:     string,   // item name
  amount:   number,   // positive float
  category: string,   // "Food" | "Transport" | "Fun"
  date:     string    // ISO timestamp (for display / sort order)
}
```

`localStorage` key: `"expense_transactions"` — value is `JSON.stringify(transactions[])`.

---

## UI Layout

### Desktop (≥ 640 px)
```
┌─────────────────────────────────────────────┐
│  💸 Expense & Budget Visualizer              │
├─────────────────────────────────────────────┤
│  ┌────────── Total Balance ─────────────┐   │
│  │  Total Spent: Rp 0                   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──── Add Transaction ─────────────────┐   │
│  │  Item Name: [____________]           │   │
│  │  Amount:    [____________]           │   │
│  │  Category:  [Food ▾]                 │   │
│  │             [  Add Transaction  ]    │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌── Transactions ──┐ ┌─ Spending Chart ──┐ │
│  │ ○ Lunch    10000 │ │   [Pie Chart]     │ │
│  │   Food   🗑       │ │                   │ │
│  │ ○ Bus      5000  │ │  ● Food  60%     │ │
│  │   Transport 🗑    │ │  ● Transport 30% │ │
│  └──────────────────┘ └───────────────────┘ │
└─────────────────────────────────────────────┘
```

### Mobile (< 640 px) — single column, stacked vertically
All cards stack into a single column. Chart appears below the transactions list.

---

## Component Breakdown

### `index.html`
- `<header>` — app title
- `#balance-card` — total balance display
- `#form-card` — add-transaction form with `#error-msg` span
- `#transactions-card` — scrollable `<ul id="transaction-list">`
- `#chart-card` — `<canvas id="spending-chart">` or `#chart-placeholder`
- Chart.js loaded from CDN before `</body>`
- `<script src="js/script.js">` loaded as a module (or deferred)

### `css/style.css`
- CSS custom properties (`:root`) for color tokens
- Mobile-first breakpoints using `@media (min-width: 640px)`
- Category badge colors: Food = green, Transport = blue, Fun = orange
- Delete button: red, small, icon-style
- Smooth transitions on card hover, button press

### `js/script.js`
Key functions:

| Function | Responsibility |
|----------|---------------|
| `loadTransactions()` | Read + parse `localStorage`, return array |
| `saveTransactions()` | Stringify + write array to `localStorage` |
| `addTransaction(name, amount, category)` | Push new object, save, render |
| `deleteTransaction(id)` | Filter by id, save, render |
| `renderAll()` | Call renderList + renderBalance + renderChart |
| `renderList()` | Build `<li>` nodes, attach delete handlers |
| `renderBalance()` | Sum amounts, update DOM |
| `renderChart()` | Aggregate by category, update/create Chart.js instance |
| `handleFormSubmit(e)` | Validate, call addTransaction, reset form |
| `init()` | Load from storage, renderAll, attach listeners |

---

## Visual Design Tokens

```css
:root {
  --color-bg:          #f0f4f8;
  --color-surface:     #ffffff;
  --color-primary:     #4f46e5;   /* indigo */
  --color-primary-hover: #4338ca;
  --color-danger:      #ef4444;
  --color-text:        #1e293b;
  --color-text-muted:  #64748b;
  --color-border:      #e2e8f0;
  --badge-food:        #16a34a;
  --badge-transport:   #2563eb;
  --badge-fun:         #ea580c;
  --radius-card:       12px;
  --radius-btn:        8px;
  --shadow-card:       0 2px 8px rgba(0,0,0,0.08);
}
```

### Chart Colors
- Food: `#16a34a` (green)
- Transport: `#2563eb` (blue)
- Fun: `#ea580c` (orange)

---

## Error Handling

| Scenario | Behavior |
|----------|---------|
| Empty field on submit | Red inline error above button |
| Amount ≤ 0 | Error: "Amount must be greater than zero" |
| `localStorage` unavailable | Silent fallback to in-memory only; no crash |
| No transactions | Empty-state message in list; placeholder text in chart area |
| Chart.js CDN fails | Chart area shows fallback message; rest of app unaffected |
