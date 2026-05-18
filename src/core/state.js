// Establish the global namespace for the extension
window.GovBridge = window.GovBridge || {};

window.GovBridge.state = (function () {
  let currentLang = 'en';
  const listeners = [];

  return {
    get currentLang() {
      return currentLang;
    },
    
    setLang(lang) {
      if (currentLang !== lang) {
        currentLang = lang;
        this.notifyListeners();
      }
    },
    
    onChange(callback) {
      listeners.push(callback);
    },
    
    notifyListeners() {
      listeners.forEach(cb => cb(currentLang));
    }
  };
})();
