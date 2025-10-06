# Personal Expense Tracker (HTML/CSS/JS)

A lightweight, single‑page web application to record, filter, and analyze personal expenses. It runs entirely in the browser (no backend) and persists data using `localStorage`. The UI is responsive, mobile‑friendly, and includes a dark mode.

## Features
- **Add expenses**: amount, category, date, optional description with validation
  - Positive amount only; date cannot be in the future
- **Expense list**: clean list with date, category, amount, and description
- **Delete**: remove individual expenses
- **Filtering**: by category and by date range (from/to) with a clear option
- **Statistics**:
  - Total amount spent
  - Breakdown by category with proportional bars
  - Monthly summary (totals per YYYY‑MM) with simple bar visualization
- **Dark mode**: toggle between light/dark; preference saved to `localStorage`
- **Export to CSV**: download your expense data as a `.csv` file (client‑side)
- **Responsive design**: optimized for mobile and desktop

## Tech Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Storage**: Browser `localStorage` (no server required)
- **Dependencies**: None (no external libraries)

## Project Structure
```
index.html   # App layout: header, form, filters, stats, and list
styles.css   # Light/dark themes, layout, and component styles
app.js       # App logic: CRUD (localStorage), validation, filters, stats, CSV
```

## Getting Started
1) Quick start: open `index.html` in any modern browser.

2) Or serve locally (recommended during development), e.g. with Python:
```
python3 -m http.server 5173
# then open http://localhost:5173 in your browser
```

## Usage
- **Add an expense**: Fill in amount, category, date, and optionally a description. Submit to add. Validation errors are shown inline.
- **Filter**: Use the category dropdown and date range inputs. Click “Clear Filters” to reset.
- **Delete**: Click “Delete” on any expense entry.
- **Dark mode**: Use the header toggle to switch between light/dark; the preference persists across reloads.
- **Export CSV**: Click “Export CSV” to download your current data as a CSV file.
- **Statistics**: View total spend, per‑category breakdown, and a monthly totals summary.

## Data & Privacy
- All data is stored locally in your browser via `localStorage`.
- No data leaves your device. Clearing browser storage removes the data.
- Storage keys used:
  - `expenses_v1`: array of expense objects `{ id, amount, category, date, description }`
  - `theme_preference_v1`: preferred color theme (`"light"` | `"dark"`)

## CSV Export Details
- File name: `expenses_YYYYMMDD.csv`
- Columns: `id,date,category,amount,description`
- Values are CSV‑escaped (quotes doubled; fields with special characters wrapped in quotes).

## Accessibility
- The theme toggle uses `aria-pressed` for state indication.
- Clear focus outlines are provided; keyboard navigation is supported by default HTML controls.

## Limitations & Notes
- Data is device‑local; it does not sync across devices.
- Editing existing entries is not implemented (delete and re‑add as needed).
- Currency formatting is set to INR; adjust `toCurrency` in `app.js` if needed.
- Date handling uses the browser’s locale/timezone; edge cases may vary by region.

## Development
- No build step is required; changes to `index.html`, `styles.css`, or `app.js` are picked up on refresh.
- Suggested improvements (future work): edit expenses, recurring expenses, import CSV, charts by category over time, IndexedDB for larger datasets, unit tests.
