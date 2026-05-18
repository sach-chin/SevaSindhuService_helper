window.GovBridge = window.GovBridge || {};

window.GovBridge.forms = window.GovBridge.forms || {};

window.GovBridge.forms.statusForm = {
  detect() {
    return !!document.querySelector('input[value="Check Status Now"]') || 
           !!document.querySelector('[data-gg-role="gg-status-heading"]') ||
           !!document.querySelector('input[value="ಈಗ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ"]');
  },

  init() {
    // No specific structural DOM injection needed initially
  },
  
  onDynamicContent() {
    const langCode = window.GovBridge.state.currentLang;
    const dict = window.GovBridge.dictionary;
    window.GovBridge.dom.translateDropdownOptions(langCode, dict);
  },

  translate(langCode, dict) {
    const L = dict.LANG[langCode];
    const dom = window.GovBridge.dom;

    dom.updateTextByContent('Check Your Application Status', L.checkStatus, 'gg-status-heading', dict);

    dom.updateSelectPlaceholder('Select Department', L.selectDepartment, dict);
    dom.updateSelectPlaceholder('Select Service', L.selectService, dict);
    dom.translateDropdownOptions(langCode, dict);

    const appIdInput = document.querySelector('input[placeholder*="Application ID"], input[placeholder*="ಅರ್ಜಿ ಸಂಖ್ಯೆ"]');
    if (appIdInput) appIdInput.placeholder = L.applicationId;

    const statusBtn = document.querySelector('input[value="Check Status Now"], input[value="ಈಗ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ"]');
    if (statusBtn) statusBtn.value = L.checkStatusBtn;
  }
};
