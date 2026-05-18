window.GovBridge = window.GovBridge || {};

(function () {
  'use strict';

  function tryInit() {
    // Only init if the document body exists
    if (!document.body) return false;
    
    // Inject Language Bar globally
    window.GovBridge.langBar.inject();

    // Register our modular forms
    const detector = window.GovBridge.formDetector;
    if (window.GovBridge.forms.loginForm) {
      detector.registerForm(window.GovBridge.forms.loginForm);
    }
    if (window.GovBridge.forms.statusForm) {
      detector.registerForm(window.GovBridge.forms.statusForm);
    }
    if (window.GovBridge.forms.newConnectionGESCOM) {
      detector.registerForm(window.GovBridge.forms.newConnectionGESCOM);
    }

    // Initialize the detection loop/observer
    detector.initObserver();
    
    return true;
  }

  // Attempt to initialize immediately, or wait for DOM changes
  if (!tryInit()) {
    const observer = new MutationObserver((mutations, obs) => {
      if (tryInit()) {
        obs.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // Failsafe disconnect
    setTimeout(() => observer.disconnect(), 15000);
  }

})();
