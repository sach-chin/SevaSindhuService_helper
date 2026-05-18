Playwright scraper for Seva Sindhu services list
===============================================

Files added:
- `tools/scrape_seva_playwright.py` — headed Playwright script that opens a browser, lets you log in, then scrapes all pages and writes `seva_services_all_pages.txt`.
- `requirements.txt` — lists `playwright`.

Setup & run (Windows / PowerShell):

1. Create and activate a virtual environment (optional but recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies and browsers:

```powershell
pip install -r requirements.txt
python -m playwright install chromium
```

3. Run the scraper:

```powershell
python tools\scrape_seva_playwright.py
```

When the script opens a browser, log in to Seva Sindhu in that browser. After login and when the services table is visible, switch back to the terminal and press Enter to let the script continue. Output file: `seva_services_all_pages.txt`.

Notes:
- The script runs headed (non-headless) so you can interactively log in.
- If the site's login cannot be completed manually (e.g., complex captcha), consider a manual export via the browser console approach instead.
