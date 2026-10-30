# Requirements — Expense & Budget Visualizer

## Overview
A client-side, mobile-friendly single-page web application that lets users log daily spending, view their transaction history, see their total balance, and understand category-level distribution through a pie chart. No server or build tool required.

---

## Functional Requirements

### FR-1: Input Form
- **FR-1.1** The form shall contain three fields: Item Name (text), Amount (number), and Category (dropdown with options: Food, Transport, Fun).
- **FR-1.2** On submission, the app shall validate that all three fields are non-empty and that Amount is a positive number greater than zero.
- **FR-1.3** If validation fails, the app shall display an inline error message without clearing the user's input.
- **FR-1.4** On successful submission, the transaction shall be added to the list, the form shall reset, and the error message shall be cleared.

### FR-2: Transaction List
- **FR-2.1** All transactions shall be displayed in a scrollable list, ordered by most-recently added first.
- **FR-2.2** Each list item shall display: Item Name, formatted Amount (IDR or plain currency), and a Category badge.
- **FR-2.3** Each list item shall have a Delete button that removes that transaction immediately.
- **FR-2.4** When the list is empty, a friendly empty-state message shall be shown.

### FR-3: Total Balance
- **FR-3.1** A summary card at the top of the page shall display the sum of all transaction amounts.
- **FR-3.2** The total shall update automatically whenever a transaction is added or deleted.
- **FR-3.3** The display shall format the amount clearly (e.g., currency symbol + comma-separated thousands).

### FR-4: Visual Pie Chart
- **FR-4.1** A pie chart shall visualize spending distribution grouped by category (Food, Transport, Fun).
- **FR-4.2** The chart shall update automatically whenever the transaction list changes.
- **FR-4.3** Chart.js shall be loaded via CDN (no local install).
- **FR-4.4** When there are no transactions, the chart area shall show a placeholder message instead of an empty chart.

### FR-5: Persistence
- **FR-5.1** All transactions shall be persisted to `localStorage` under a single key.
- **FR-5.2** On page load, the app shall restore all previously saved transactions and re-render the full UI.
- **FR-5.3** Deleting a transaction shall update `localStorage` immediately.

---

## Technical Constraints

| ID   | Constraint |
|------|-----------|
| TC-1 | HTML structure, CSS styling, Vanilla JavaScript only — no React, Vue, or other frameworks. No backend. |
| TC-2 | Browser `localStorage` API for all persistence. Client-side only. |
| TC-3 | Must run in modern browsers: Chrome, Firefox, Edge, Safari. Works as a standalone HTML file opened from disk or served statically. |

---

## Non-Functional Requirements

| ID    | Requirement |
|-------|------------|
| NFR-1 | **Simplicity** — Clean, minimal interface. No complex setup or test harness required. |
| NFR-2 | **Performance** — Fast initial load (single HTML file + CDN). UI interactions (add/delete) must feel instantaneous with no perceptible lag. |
| NFR-3 | **Visual Design** — User-friendly aesthetic, clear visual hierarchy, readable typography, color-coded category badges. Mobile-first responsive layout. |

---

## File & Folder Rules

```
/
├── index.html          ← single HTML entry point
├── css/
│   └── style.css       ← all styles (only this one CSS file)
└── js/
    └── script.js       ← all JavaScript (only this one JS file)
```

No other source files are permitted.
