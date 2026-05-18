#!/usr/bin/env python3
"""
Headed Playwright scraper for Seva Sindhu services list.

Usage:
  1. Install dependencies (see README or run `pip install -r requirements.txt`).
  2. Run `python tools/scrape_seva_playwright.py`.
  3. The script opens a Chromium browser; log in manually if prompted.
  4. After logging in, press Enter in the terminal to let the script continue.

Output: `seva_services_all_pages.txt` in the current folder.
"""
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
import time
import sys
import re

URL = "https://sevasindhuservices.karnataka.gov.in/beneficiaryPrimaryServiceList.do"


def get_services_table(page):
    tables = page.locator('table')
    try:
        table_count = tables.count()
    except Exception:
        table_count = 0

    for i in range(min(table_count, 50)):
        tbl = tables.nth(i)
        try:
            headers = [h.strip().lower() for h in tbl.locator('thead th').all_text_contents()]
        except Exception:
            headers = []
        has_service = any('service name' in h for h in headers)
        has_department = any('department name' in h for h in headers)
        if has_service and has_department:
            return tbl
    return None


def extract_names_from_table(table):
    rows = table.locator('tbody tr')
    try:
        rc = rows.count()
    except Exception:
        return []

    headers = table.locator('thead th').all_text_contents()
    name_idx = None
    for i, h in enumerate(headers):
        if 'service name' in h.lower():
            name_idx = i
            break

    names = []
    for i in range(rc):
        cells = rows.nth(i).locator('td')
        try:
            cell_count = cells.count()
        except Exception:
            cell_count = 0
        txt = ''
        if name_idx is not None and cell_count > name_idx:
            txt = cells.nth(name_idx).inner_text().strip()
        elif cell_count > 1:
            txt = cells.nth(1).inner_text().strip()
        elif cell_count > 0:
            txt = cells.nth(0).inner_text().strip()
        if txt:
            names.append(txt)
    return names


def get_page_status(page):
    """Return (current_page, total_pages) if available, else (None, None)."""
    candidates = [
        '.dataTables_info',
        'div:has-text("Showing page")',
        'span:has-text("Showing page")',
        'p:has-text("Showing page")'
    ]
    for sel in candidates:
        loc = page.locator(sel)
        try:
            cnt = loc.count()
        except Exception:
            cnt = 0
        for i in range(cnt):
            try:
                txt = (loc.nth(i).inner_text() or '').strip()
            except Exception:
                txt = ''
            m = re.search(r'showing\s+page\s+(\d+)\s+of\s+(\d+)', txt, re.IGNORECASE)
            if m:
                return int(m.group(1)), int(m.group(2))

    try:
        body = page.locator('body').inner_text()
    except Exception:
        body = ''
    m = re.search(r'showing\s+page\s+(\d+)\s+of\s+(\d+)', body, re.IGNORECASE)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None


def get_current_page_from_pager(page):
    selectors = [
        '.pagination .active',
        '.pagination .current',
        '.paginate_button.current',
        '.paginate_button.active',
        'li.active a',
        'li.current a'
    ]
    for sel in selectors:
        loc = page.locator(sel)
        try:
            cnt = loc.count()
        except Exception:
            cnt = 0
        for i in range(cnt):
            try:
                txt = (loc.nth(i).inner_text() or '').strip()
            except Exception:
                txt = ''
            if txt.isdigit():
                return int(txt)
    return None


def find_next_button(page, current_page=None):
    effective_current = current_page
    if effective_current is None:
        effective_current = get_current_page_from_pager(page)

    if effective_current is not None:
        next_page = effective_current + 1
        numeric_selectors = [
            f'.pagination a:has-text("{next_page}")',
            f'.pagination button:has-text("{next_page}")',
            f'.pagination span:has-text("{next_page}")',
            f'a.paginate_button:has-text("{next_page}")',
            f'span.paginate_button:has-text("{next_page}")',
            f'li a:has-text("{next_page}")',
            f'a:has-text("{next_page}")',
            f'span:has-text("{next_page}")'
        ]
        for sel in numeric_selectors:
            loc = page.locator(sel)
            try:
                cnt = loc.count()
            except Exception:
                cnt = 0
            for i in range(cnt):
                el = loc.nth(i)
                try:
                    if not el.is_visible():
                        continue
                    cls = (el.get_attribute('class') or '').lower()
                    aria = el.get_attribute('aria-disabled')
                    if 'disabled' in cls or 'inactive' in cls or aria == 'true':
                        continue
                    if (el.inner_text() or '').strip() == str(next_page):
                        return el
                except Exception:
                    continue

    selectors = [
        'a[id$="_next"]',
        'button[id$="_next"]',
        'span[id$="_next"]',
        'a.paginate_button.next',
        'span.paginate_button.next',
        'li.next a',
        '.pagination a[aria-label="Next"]',
        '.pagination span[aria-label="Next"]',
        'a[aria-label="Next"]',
        'span:has-text("›")',
        'a:has-text("›")',
        'span:has-text("→")',
        'a:has-text("→")',
        'a:has-text("»")',
        'span:has-text("»")',
        'a:has-text(">")',
        'span:has-text(">")',
        'a:has-text(">>")',
        'span:has-text(">>")',
        'a:has-text("Next")',
        'span:has-text("Next")',
        'a.next',
        'button.next'
    ]
    for sel in selectors:
        loc = page.locator(sel)
        try:
            cnt = loc.count()
        except Exception:
            cnt = 0
        for i in range(cnt):
            el = loc.nth(i)
            try:
                if not el.is_visible():
                    continue
                cls = (el.get_attribute('class') or '').lower()
                aria = el.get_attribute('aria-disabled')
                if 'disabled' in cls or 'inactive' in cls or aria == 'true':
                    continue
                return el
            except Exception:
                continue
    return None


def find_next_button_for_table(page, table, current_page=None):
    # Try the pager nearest to the services table first.
    if current_page is not None:
        next_page = current_page + 1
        sel = (
            'xpath=following::ul[contains(@class,"pagination")][1]'
            f'//*[self::a or self::button or self::span][normalize-space()="{next_page}"]'
        )
        loc = table.locator(sel)
        try:
            if loc.count() > 0:
                for i in range(loc.count()):
                    el = loc.nth(i)
                    if not el.is_visible():
                        continue
                    cls = (el.get_attribute('class') or '').lower()
                    aria = el.get_attribute('aria-disabled')
                    if 'disabled' in cls or 'inactive' in cls or aria == 'true':
                        continue
                    return el
        except Exception:
            pass

    symbol_selectors = [
        'xpath=following::ul[contains(@class,"pagination")][1]//*[contains(@class,"next") and (self::a or self::button or self::span)]',
        'xpath=following::ul[contains(@class,"pagination")][1]//*[self::a or self::button or self::span][normalize-space()="›"]',
        'xpath=following::ul[contains(@class,"pagination")][1]//*[self::a or self::button or self::span][normalize-space()="»"]',
        'xpath=following::ul[contains(@class,"pagination")][1]//*[self::a or self::button or self::span][contains(normalize-space(),"Next")]'
    ]
    for sel in symbol_selectors:
        loc = table.locator(sel)
        try:
            cnt = loc.count()
        except Exception:
            cnt = 0
        for i in range(cnt):
            el = loc.nth(i)
            try:
                if not el.is_visible():
                    continue
                cls = (el.get_attribute('class') or '').lower()
                aria = el.get_attribute('aria-disabled')
                if 'disabled' in cls or 'inactive' in cls or aria == 'true':
                    continue
                return el
            except Exception:
                continue

    # Fallback to global search.
    return find_next_button(page, current_page=current_page)


def click_next(page, next_btn):
    try:
        next_btn.click()
        return True
    except Exception:
        try:
            handle = next_btn.element_handle()
            if handle:
                page.evaluate('(el) => el.click()', handle)
                return True
        except Exception:
            return False
    return False


def click_next_via_dom(page, current_page=None):
        next_page = None
        if current_page is not None:
                next_page = current_page + 1

        script = r"""
        (nextPage) => {
            const roots = Array.from(document.querySelectorAll('.pagination, .dataTables_paginate, nav, ul'));
            const candidates = [];

            const isVisible = (el) => {
                if (!el) return false;
                const s = getComputedStyle(el);
                const r = el.getBoundingClientRect();
                return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0;
            };

            const isDisabled = (el) => {
                if (!el) return true;
                const cls = (el.className || '').toString().toLowerCase();
                return cls.includes('disabled') || cls.includes('inactive') || el.getAttribute('aria-disabled') === 'true';
            };

            for (const root of roots) {
                const els = Array.from(root.querySelectorAll('a, button, span, li'));
                for (const el of els) {
                    const text = (el.innerText || el.textContent || '').trim();
                    if (!isVisible(el) || isDisabled(el)) continue;
                    candidates.push({el, text});
                }
            }

            const active = roots
                .flatMap(root => Array.from(root.querySelectorAll('.active, .current, .paginate_button.current, .paginate_button.active')))
                .find(el => isVisible(el) && !isDisabled(el));

            const exactNext = nextPage ? String(nextPage) : null;
            const exactMatches = exactNext ? candidates.filter(c => c.text === exactNext) : [];
            const nextTextMatches = candidates.filter(c => /^(next|›|»|>|>>)$/i.test(c.text));

            const clickEl = (el) => {
                try {
                    el.click();
                    return true;
                } catch (e) {}
                try {
                    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    return true;
                } catch (e) {}
                return false;
            };

            if (active) {
                let node = active;
                for (let step = 0; step < 8; step++) {
                    node = node.nextElementSibling;
                    if (!node) break;
                    const text = (node.innerText || node.textContent || '').trim();
                    if (!isVisible(node) || isDisabled(node)) continue;
                    if (/^(next|›|»|>|>>)$/i.test(text) || /^\d+$/.test(text)) {
                        if (clickEl(node)) return {clicked: true, text};
                    }
                }
            }

            for (const item of exactMatches) {
                if (clickEl(item.el)) return {clicked: true, text: item.text};
            }
            for (const item of nextTextMatches) {
                if (clickEl(item.el)) return {clicked: true, text: item.text};
            }
            if (candidates.length) {
                const numeric = candidates
                    .map(c => ({...c, n: /^\d+$/.test(c.text) ? Number(c.text) : NaN}))
                    .filter(c => !Number.isNaN(c.n))
                    .sort((a, b) => a.n - b.n);
                if (nextPage) {
                    const match = numeric.find(c => c.n === nextPage);
                    if (match && clickEl(match.el)) return {clicked: true, text: match.text};
                }
            }
            return {clicked: false, text: null, candidates: candidates.slice(0, 20).map(c => c.text)};
        }
        """

        try:
                result = page.evaluate(script, next_page)
                return bool(result and result.get('clicked'))
        except Exception:
                return False


def get_datatable_info(page):
        script = r"""
        () => {
            const tables = Array.from(document.querySelectorAll('table'));
            const table = tables.find(t => {
                const headers = Array.from(t.querySelectorAll('thead th')).map(h => (h.textContent || '').trim().toLowerCase());
                return headers.some(h => h.includes('service name')) && headers.some(h => h.includes('department name'));
            });
            if (!table || !window.jQuery || !jQuery.fn || !jQuery.fn.DataTable) return null;
            try {
                const dt = jQuery(table).DataTable();
                const info = dt.page.info();
                return { page: info.page + 1, pages: info.pages };
            } catch (e) {
                return null;
            }
        }
        """
        try:
                return page.evaluate(script)
        except Exception:
                return None


def go_to_page(page, target_page):
        script = r"""
        (targetPage) => {
            const tables = Array.from(document.querySelectorAll('table'));
            const table = tables.find(t => {
                const headers = Array.from(t.querySelectorAll('thead th')).map(h => (h.textContent || '').trim().toLowerCase());
                return headers.some(h => h.includes('service name')) && headers.some(h => h.includes('department name'));
            });
            if (!table || !window.jQuery || !jQuery.fn || !jQuery.fn.DataTable) {
                return { ok: false, reason: 'datatable unavailable' };
            }
            try {
                const dt = jQuery(table).DataTable();
                const info = dt.page.info();
                const index = targetPage - 1;
                if (index < 0 || index >= info.pages) {
                    return { ok: false, reason: `target ${targetPage} outside range 1..${info.pages}` };
                }
                dt.page(index).draw(false);
                return { ok: true, page: targetPage, pages: info.pages };
            } catch (e) {
                return { ok: false, reason: String(e) };
            }
        }
        """
        try:
                result = page.evaluate(script, target_page)
                return bool(result and result.get('ok'))
        except Exception:
                return False


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(URL)

        print('\nOpened services page in the browser.')
        print('If you are not logged in, please log in in the opened browser window.')
        input('Press Enter here after you have logged in and the services table is visible...')

        try:
            page.wait_for_selector('table tbody tr', timeout=60000)
        except PWTimeout:
            print('Timed out waiting for the services table. Is the page visible? Exiting.')
            browser.close()
            sys.exit(1)

        services_table = get_services_table(page)
        if not services_table:
            print('Could not locate services table with expected headers.')
            print(f'Current URL: {page.url}')
            browser.close()
            sys.exit(1)

        datatable_info = get_datatable_info(page)
        total_pages = None
        if datatable_info and isinstance(datatable_info, dict):
            total_pages = datatable_info.get('pages')

        seen = set()
        results = []
        current_page, status_total_pages = get_page_status(page)
        if total_pages is None:
            total_pages = status_total_pages
        if total_pages is None:
            total_pages = 1

        print(f'Using sequential pagination across {total_pages} pages.')

        for target_page in range(1, total_pages + 1):
            if target_page == 1:
                print(f'On page {target_page} of {total_pages}.')
            else:
                moved = False
                for _ in range(3):
                    moved = go_to_page(page, target_page)
                    if moved:
                        time.sleep(0.75)
                        break
                    time.sleep(0.5)

                if not moved:
                    print(f'Failed to move directly to page {target_page}; trying next-button fallback.')
                    current_guess = get_current_page_from_pager(page) or target_page - 1
                    for _ in range(10):
                        if current_guess >= target_page:
                            moved = True
                            break

                        next_btn = find_next_button_for_table(page, services_table, current_page=current_guess)
                        if next_btn and click_next(page, next_btn):
                            time.sleep(0.75)
                        elif click_next_via_dom(page, current_page=current_guess):
                            time.sleep(0.75)
                        else:
                            time.sleep(0.5)
                            refreshed_guess = get_current_page_from_pager(page)
                            if refreshed_guess is not None and refreshed_guess > current_guess:
                                current_guess = refreshed_guess
                                continue
                            continue

                        refreshed_guess = get_current_page_from_pager(page)
                        if refreshed_guess is None:
                            refreshed_guess = current_guess + 1
                        current_guess = refreshed_guess

                    if not moved and current_guess < target_page:
                        print(f'Could not reach page {target_page}. Stopping early.')
                        break
                print(f'On page {target_page} of {total_pages}.')

            names = extract_names_from_table(services_table)
            new_count = 0
            for n in names:
                if n and n not in seen:
                    seen.add(n)
                    results.append(n)
                    new_count += 1
            print(f'Collected {len(results)} unique names (+{new_count} this page).')

            if target_page < total_pages:
                first_before = ''
                try:
                    first_before = services_table.locator('tbody tr td').first.inner_text()
                except Exception:
                    pass
                changed = False
                for _ in range(40):
                    time.sleep(0.5)
                    try:
                        cur = services_table.locator('tbody tr td').first.inner_text()
                    except Exception:
                        cur = ''
                    if cur != first_before:
                        changed = True
                        break
                if not changed:
                    time.sleep(1)

        out_file = 'seva_services_all_pages.txt'
        with open(out_file, 'w', encoding='utf-8') as fh:
            fh.write('\n'.join(results))

        print(f'Finished. Wrote {len(results)} unique service names to {out_file}')
        browser.close()


if __name__ == '__main__':
    main()
