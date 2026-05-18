window.GovBridge = window.GovBridge || {};

window.GovBridge.langBar = (function () {
  return {
    inject() {
      if (document.getElementById('gg-lang-bar')) return;

      const bar = document.createElement('div');
      bar.id = 'gg-lang-bar';
      bar.innerHTML = `
        <button class="gg-lang-btn gg-lang-active" id="gg-lang-en">English</button>
        <button class="gg-lang-btn" id="gg-lang-kn">ಕನ್ನಡ</button>
      `;

      document.body.prepend(bar);
      document.body.classList.add('gg-has-lang-bar');

      const state = window.GovBridge.state;

      document.getElementById('gg-lang-en').addEventListener('click', () => {
        state.setLang('en');
      });
      document.getElementById('gg-lang-kn').addEventListener('click', () => {
        state.setLang('kn');
      });

      // Listen for language changes to update button styling
      state.onChange((lang) => {
        const enBtn = document.getElementById('gg-lang-en');
        const knBtn = document.getElementById('gg-lang-kn');
        if (lang === 'en') {
          enBtn.classList.add('gg-lang-active');
          knBtn.classList.remove('gg-lang-active');
        } else {
          knBtn.classList.add('gg-lang-active');
          enBtn.classList.remove('gg-lang-active');
        }
        
        // Also tell the detector to retranslate the active form
        window.GovBridge.formDetector.retranslateActive();
      });
    }
  };
})();
