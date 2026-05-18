window.GovBridge = window.GovBridge || {};

window.GovBridge.forms = window.GovBridge.forms || {};

window.GovBridge.forms.newConnectionGESCOM = {
  detect() {
    // Detect GESCOM new connection form by looking for form elements or page content
    const pageText = ((document.body && document.body.innerText) || '').toLowerCase();
    return pageText.includes('new connection') && pageText.includes('gescom');
  },

  init() {
    // Initialization for GESCOM form (runs when form is detected)
    console.log('GovBridge: New Connection - Non RAPDRP - GESCOM form initialized');
  },
  
  onDynamicContent() {
    // Handle dynamically loaded form fields
    const langCode = window.GovBridge.state.currentLang;
    const dict = window.GovBridge.dictionary;
    // Translate any dynamic content here
  },

  translate(langCode, dict) {
    const L = dict.LANG[langCode];
    const dom = window.GovBridge.dom;

    // Update any form labels specific to GESCOM
    const submitBtn = document.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn && L && L.submit) {
      submitBtn.value = L.submit;
    }
  }
};
