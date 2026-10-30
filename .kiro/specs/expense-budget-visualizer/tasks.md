# Tasks — Expense & Budget Visualizer

## Completed (MVP)

### T-1 through T-8 ✅
All MVP tasks completed — see requirements.md for details.

---

## Phase 2 — Optional Features

### T-9: Dark / Light Mode Toggle
- [x] Add `data-theme` attribute strategy on `<html>` — `"light"` (default) or `"dark"`
- [x] Add dark-mode CSS custom property overrides under `[data-theme="dark"]`
- [x] Add toggle button in header (moon/sun icon, accessible label)
- [x] JS: `loadTheme()` — read `localStorage` key `expense_theme`, apply to `<html>`
- [x] JS: `toggleTheme()` — flip theme, persist, update button icon/label
- [x] Call `loadTheme()` inside `init()` before first render

### T-10: Sort Transactions
- [x] Add sort dropdown above the transaction list (options: Default / By Amount ↑ / By Amount ↓ / By Category A–Z)
- [x] JS: `currentSort` state variable (default `"default"`)
- [x] JS: `getSortedTransactions()` — return a sorted copy of `transactions[]` without mutating original order
- [x] Update `renderList()` to use `getSortedTransactions()` instead of `transactions` directly
- [x] Attach `change` listener to sort dropdown; update `currentSort`, call `renderList()`

### T-11: Spending Limit Warning
- [x] Add "Set Spending Limit" input + button in the balance card area
- [x] JS: `spendingLimit` state variable (0 = no limit)
- [x] JS: `loadLimit()` — read `localStorage` key `expense_limit`, parse as number
- [x] JS: `saveLimit()` — write limit to `localStorage`
- [x] Update `renderBalance()` — when total > limit > 0, add `.balance-card--warning` class + warning message; remove when under limit
- [x] CSS: `.balance-card--warning` — red/amber gradient, warning icon/message styles
- [x] Call `loadLimit()` inside `init()`
