window.GovBridge = window.GovBridge || {};

window.GovBridge.formDetector = (function () {
  const registeredForms = [];
  let currentActiveForms = [];

  // Simple application registry: add patterns or selector checks here.
  const appRegistry = [
    {
      id: 'possessionCertificate_kn',
      name: 'Application for Possession Certificate for Flats/ಫ್ಲಾಟ್ ಸ್ವಾಧೀನ ಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ',
      exactTitles: [
        'Application for Possession Certificate for Flats',
        'ಫ್ಲಾಟ್ ಸ್ವಾಧೀನ ಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ'
      ],
      // matches URL path; many forms reuse renderApplicationForm.do so this is broad
      urlMatch: /renderApplicationForm\.do/i,
      // optional selector that's usually present on the form page
      selector: 'h1, h2, h3, h4',
      // helpful keywords to look for in headings/labels
      keywords: ['flat', 'ಫ್ಲಾಟ್', 'ಸ್ವಾಧೀನ', 'application for possession certificate for flats']
    },
    {
      id: 'possessionCertificate_site_kn',
      name: 'Application for Possession Certificate for Sites / ನಿವೇಶನ ಸ್ವಾಧೀನ ಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ',
      exactTitles: [
        'Application for Possession Certificate for Sites',
        'ನಿವೇಶನ ಸ್ವಾಧೀನ ಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ'
      ],
      urlMatch: /renderApplicationForm\.do/i,
      selector: 'h1, h2, h3, h4',
      keywords: ['ನಿವೇಶನ ಸ್ವಾಧೀನ ಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ', 'application for possession certificate for sites']
    },
    {
      id: 'newConnectionGESCOM',
      name: 'New Connection - Non RAPDRP - GESCOM',
      exactTitles: [
        'New Connection - Non RAPDRP - GESCOM',
        'New Connection',
        'GESCOM'
      ],
      urlMatch: /renderApplicationForm\.do/i,
      selector: 'h1, h2, h3, h4',
      keywords: ['new connection', 'non rapdrp', 'gescom', 'electricity']
    }
    // Add more entries as needed or expose a register method below
  ];

  // Attempt to load a packaged JSON list of test application names (if present)
  async function loadTestApps() {
    try {
      if (!window.chrome || !chrome.runtime || !chrome.runtime.getURL) return;
      const url = chrome.runtime.getURL('src/core/testApps.json');
      const resp = await fetch(url);
      if (!resp.ok) return;
      const names = await resp.json();
      if (!Array.isArray(names)) return;

      const slugify = (s) => s.toString().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80);

      names.forEach((fullName) => {
        if (!fullName || typeof fullName !== 'string') return;
        const id = 'test_' + slugify(fullName);
        // Avoid duplicates
        if (appRegistry.some(a => a.id === id || (a.name && a.name === fullName))) return;

        const words = fullName.split(/\s+/).slice(0, 6).map(w => w.replace(/[^\w]/g, '').toLowerCase()).filter(Boolean);
        const entry = {
          id,
          name: fullName,
          exactTitles: [fullName],
          urlMatch: /renderApplicationForm\.do/i,
          selector: 'h1, h2, h3, h4',
          keywords: words
        };
        appRegistry.push(entry);
      });
    } catch (e) {
      // ignore - test file optional
      console.warn('GovBridge: could not load test apps', e);
    }
  }

  // Start loading test apps in background (non-blocking)
  loadTestApps();

  function findAppMatch() {
    const href = location.href;
    const pageText = ((document.body && document.body.innerText) || '').toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (let app of appRegistry) {
      if (app.urlMatch && app.urlMatch.test(href)) {
        let score = 0;

        if (app.exactTitles && Array.isArray(app.exactTitles)) {
          for (let exact of app.exactTitles) {
            if (exact && pageText.includes(exact.toLowerCase())) {
              score += 100;
            }
          }
        }

        // Match only when the page text strongly indicates this application.
        if (app.keywords && Array.isArray(app.keywords)) {
          for (let kw of app.keywords) {
            if (kw && pageText.includes(kw.toLowerCase())) {
              score += 10;
            }
          }
        }

        // If no page text matched yet, check visible headings as a backup.
        if (app.selector) {
          const els = document.querySelectorAll(app.selector);
          for (let el of els) {
            if (!el.textContent) continue;
            const txt = el.textContent.toLowerCase();
            if (app.exactTitles && Array.isArray(app.exactTitles)) {
              for (let exact of app.exactTitles) {
                if (exact && txt.includes(exact.toLowerCase())) score += 80;
              }
            }
            if (app.keywords && Array.isArray(app.keywords)) {
              for (let kw of app.keywords) {
                if (kw && txt.includes(kw.toLowerCase())) score += 5;
              }
            }
            if (txt.includes(app.name.toLowerCase())) score += 20;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = app;
        }
      }
    }

    return bestScore >= 80 ? bestMatch : null;
  }

  function injectAppBanner(app) {
    if (!app) return;
    if (document.getElementById('gg-app-identifier')) return;

    const banner = document.createElement('div');
    banner.id = 'gg-app-identifier';
    banner.setAttribute('data-gg-app', app.id);
    banner.style.position = 'fixed';
    banner.style.top = '8px';
    banner.style.right = '8px';
    banner.style.zIndex = '999999';
    banner.style.background = '#0b5cff';
    banner.style.color = 'white';
    banner.style.padding = '6px 10px';
    banner.style.borderRadius = '6px';
    banner.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    banner.style.fontSize = '13px';
    banner.style.fontFamily = 'Arial, sans-serif';
    banner.textContent = 'GovBridge: Application — ' + app.name;

    document.body.appendChild(banner);
  }

  function injectTestOverlay(app) {
    if (!app) return;
    // Show overlay for any matched app (used for testing/identification)
    if (document.getElementById('gg-test-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'gg-test-overlay';
    // Keep overlay below the small banner (banner zIndex 999999)
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'white';
    overlay.style.zIndex = '99999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.textAlign = 'center';
    overlay.style.padding = '20px';

    const msg = document.createElement('div');
    msg.style.maxWidth = '900px';
    msg.style.lineHeight = '1.4';
    msg.style.color = '#222';
    msg.style.fontFamily = 'Arial, sans-serif';
    msg.style.fontSize = '18px';
    msg.innerHTML = 'This is an application for<br><strong>GovBridge: Application — ' + app.name + '</strong>';

    overlay.appendChild(msg);

    // clicking overlay removes it (simple test control)
    overlay.addEventListener('click', () => {
      overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  return {
    registerForm(formLogic) {
      registeredForms.push(formLogic);
    },

    // Evaluates which forms are active based on their detect() method
    detectActiveForms() {
      return registeredForms.filter(form => form.detect());
    },

    // Main loop or observer trigger to handle SPA navigations or lazy loads
    scan() {
      // detect and show which application page we're on (if any)
      try {
        const app = findAppMatch();
        if (app) {
          injectAppBanner(app);
          // test overlay for possessionCertificate_kn
          injectTestOverlay(app);
        }
      } catch (e) {
        // swallow any errors to avoid breaking page
        console.warn('GovBridge app detection error', e);
      }

      const activeForms = this.detectActiveForms();

      activeForms.forEach(activeForm => {
        if (!currentActiveForms.includes(activeForm)) {
          // Initialize structural changes (only runs once per form session ideally)
          if (!activeForm.initialized) {
            activeForm.init();
            activeForm.initialized = true;
          }
          // Always translate when newly detected
          activeForm.translate(window.GovBridge.state.currentLang, window.GovBridge.dictionary);
        } else {
          // If the form is already active, it might have loaded new dynamic elements
          if (activeForm.onDynamicContent) {
            activeForm.onDynamicContent();
          }
        }
      });

      currentActiveForms = activeForms;
    },

    initObserver() {
      // Run initially
      this.scan();

      let scanTimeout = null;
      // Monitor DOM changes for dynamic form loads
      const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        for (let m of mutations) {
          if (m.addedNodes.length > 0) {
            // Optimization: ignore mutations from our own elements
            const hasExternalChange = Array.from(m.addedNodes).some(node => {
               if (node.nodeType === 1) { // Element
                 const id = node.id || '';
                 const className = (typeof node.className === 'string') ? node.className : '';
                 if (id.startsWith('gg-') || className.includes('gg-')) return false;
               }
               if (node.nodeType === 3 && node.parentElement) { // Text node
                 const p = node.parentElement;
                 const pid = p.id || '';
                 const pclass = (typeof p.className === 'string') ? p.className : '';
                 if (pid.startsWith('gg-') || pclass.includes('gg-')) return false;
               }
               return true;
            });

            if (hasExternalChange) {
              shouldScan = true;
              break;
            }
          }
        }
        
        if (shouldScan) {
          if (scanTimeout) clearTimeout(scanTimeout);
          scanTimeout = setTimeout(() => this.scan(), 150);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      // Also trigger scans on common navigation/focus events so tab switches
      // and SPA navigations also re-evaluate forms.
      const self = this;
      const scheduleScan = () => {
        if (scanTimeout) clearTimeout(scanTimeout);
        scanTimeout = setTimeout(() => self.scan(), 120);
      };

      window.addEventListener('focus', scheduleScan);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') scheduleScan();
      });
      window.addEventListener('pageshow', scheduleScan);
      window.addEventListener('popstate', scheduleScan);
      window.addEventListener('hashchange', scheduleScan);
    },
    
    // Allows global updates (like a language toggle) to re-translate the active forms
    retranslateActive() {
       currentActiveForms.forEach(form => {
          form.translate(window.GovBridge.state.currentLang, window.GovBridge.dictionary);
       });
    }
  };
})();
