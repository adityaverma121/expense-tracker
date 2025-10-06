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

## How to Run
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

## Repository
- GitHub: [adityaverma121/expense-tracker](https://github.com/adityaverma121/expense-tracker)

## Bug Fixes & Error Handling
- Safe `localStorage` parsing with empty/invalid JSON fallbacks.
- Input validation: positive amount, required category, required date, no future dates.
- Date inputs capped with `max` set to today to prevent future selection.
- CSV export includes header when dataset is empty; proper CSV escaping (quotes, commas, newlines).
- Dark mode contrast fixes for secondary buttons to maintain readability.

## UI/UX
- Visual: clean card layout, clear hierarchy, subtle shadows, readable typography.
- Accessibility: focus outlines, `aria-pressed` for theme toggle, semantic HTML structure.
- Responsive: CSS grid with `minmax(280px, 1fr)` for fluid, mobile‑first layout.

## Cursor Usage Documentation
- Prompts used:
  - "Implement a dark mode toggle persisted in localStorage. Use CSS variables for the dark theme, add an accessible header toggle, and apply preference on load."
  - "Add an Export to CSV feature that converts localStorage expenses into a properly escaped CSV and triggers a client‑side download with filename pattern expenses_YYYYMMDD.csv."
  - "Create a monthly summary visualization by grouping expenses per YYYY‑MM and rendering proportional bars in vanilla JS without external libraries."
- How Cursor helped:
  - Accelerated scaffolding (HTML/CSS/JS) and iterative enhancements with fast feedback.
  - Suggested robust CSV escaping and aggregation patterns for monthly summaries.
  - Streamlined UX polish (dark theme variables, accessible toggle state handling).
- Modifications to AI‑generated code and why:
  - Strengthened contrast for secondary buttons in dark mode to meet readability standards.
  - Hardened CSV export to handle quotes/commas/newlines and empty datasets.
  - Tightened validation: enforced `max` date; improved safe JSON parsing and defaults.

## Challenges & Solutions
- Dark mode contrast on secondary buttons: adjusted colors to use `--card` background and `--text` foreground in dark theme.
- Robust CSV escaping: implemented quote‑doubling and quoting for fields with special characters.
- Date validation and UX: set `max` to today and re‑populate date after submit for quick entry.

## Bonus Features
- Dark mode with persisted preference.
- Export to CSV with proper escaping and timestamped filenames.
- Monthly summary bars by `YYYY‑MM` in addition to category breakdown.

## Time Spent
- ≈ 3 hours total (build + enhancements + QA + docs).
