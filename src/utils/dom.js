window.GovBridge = window.GovBridge || {};

window.GovBridge.dom = (function () {
  
  return {
    // Helper: update heading text by matching original English content
    updateTextByContent(originalEnglish, newText, dataAttr, dict) {
      const tagged = document.querySelector('[data-gg-role="' + dataAttr + '"]');
      if (tagged) {
        if (tagged.textContent !== newText) {
          tagged.textContent = newText;
        }
        return;
      }

      const candidates = document.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b, td, th, span, div, p');
      for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i];
        if (el.children.length === 0 && el.textContent.trim() === originalEnglish) {
          el.setAttribute('data-gg-role', dataAttr);
          if (el.textContent !== newText) {
            el.textContent = newText;
          }
          return;
        }
      }
      
      const knText = dict.LANG.kn[Object.keys(dict.LANG.en).find(k => dict.LANG.en[k] === originalEnglish) || ''];
      if (knText) {
        for (let i = 0; i < candidates.length; i++) {
          const el = candidates[i];
          if (el.children.length === 0 && el.textContent.trim() === knText) {
            el.setAttribute('data-gg-role', dataAttr);
            if (el.textContent !== newText) {
              el.textContent = newText;
            }
            return;
          }
        }
      }
    },

    // Helper: update link text
    updateLinkText(originalPartial, newText, dict) {
      const isKannadaMatch = (text, originalEnglish) => {
        const keyMap = {
          'Forgot Password': 'forgotPassword',
          'New user': 'newUser',
          'Know Your Eligibility': 'eligibility'
        };
        const key = keyMap[originalEnglish];
        if (key && dict.LANG.kn[key]) {
          return text.includes(dict.LANG.kn[key]);
        }
        return false;
      };

      const links = document.querySelectorAll('a, span, td');
      for (let i = 0; i < links.length; i++) {
        const el = links[i];
        const text = el.textContent.trim();
        if (el.children.length === 0 && (text.includes(originalPartial) || isKannadaMatch(text, originalPartial))) {
          if (el.textContent !== newText) {
            el.textContent = newText;
          }
          return;
        }
      }
    },

    // Helper: update select element's first option placeholder
    updateSelectPlaceholder(originalText, newText, dict) {
      const selects = document.querySelectorAll('select');
      selects.forEach(sel => {
        const firstOpt = sel.querySelector('option:first-child');
        if (firstOpt) {
          const t = firstOpt.textContent.trim();
          if (t === originalText || 
              t === dict.LANG.kn.selectDepartment || 
              t === dict.LANG.kn.selectService ||
              t === dict.LANG.en.selectDepartment || 
              t === dict.LANG.en.selectService) {
            if (firstOpt.textContent !== newText) {
              firstOpt.textContent = newText;
            }
          }
        }
      });
    },

    // Helper: translate dropdown options
    translateDropdownOptions(currentLang, dict) {
      const selects = document.querySelectorAll('select');
      selects.forEach(sel => {
        const options = sel.querySelectorAll('option');
        options.forEach(opt => {
          if (opt === sel.querySelector('option:first-child')) return;

          if (!opt.hasAttribute('data-gg-orig-text')) {
            const text = opt.textContent.trim();
            if (text) {
              opt.setAttribute('data-gg-orig-text', text);
            }
          }
          const origText = opt.getAttribute('data-gg-orig-text');
          if (origText && dict.DROPDOWN_DICT[origText]) {
            const targetText = (currentLang === 'kn') ? dict.DROPDOWN_DICT[origText] : origText;
            if (opt.textContent !== targetText) {
              opt.textContent = targetText;
            }
          }
        });
      });
    }
  };
})();
