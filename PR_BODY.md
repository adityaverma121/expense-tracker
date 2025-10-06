## Summary
- Add dark mode toggle with persisted preference (localStorage)
- Export all expenses to CSV via client-side download
- Monthly summary (per-month totals) with simple bar visualization

## Details
- HTML: header toolbar with theme toggle and export button; added monthly summary container in `#stats`
- CSS: dark theme via `[data-theme="dark"]` variables; dark styles for inputs, badges, and bars
- JS: theme initialization with system preference fallback; toggle + persist; CSV generation and download with proper CSV escaping; monthly aggregation (yyyy-mm) and rendering

## Test plan
- Toggle Dark/Light and refresh; preference should persist
- Add expenses across different months; verify monthly bars update
- Click Export CSV; open the file and verify headers and row values
- Verify existing features still work: adding, deleting, filtering, and category breakdown
