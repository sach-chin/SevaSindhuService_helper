window.GovBridge = window.GovBridge || {};

window.GovBridge.forms = window.GovBridge.forms || {};

window.GovBridge.forms.loginForm = {
  detect() {
    return !!document.getElementById('password') && !!document.getElementById('captchaAnswer');
  },

  init() {
    this.injectLoginToggle();
    this.injectEyeToggle();
    this.injectCaptchaHelper();
    this.syncBoxWidths();
  },

  injectLoginToggle() {
    const passwordField = document.getElementById('password');
    const otpButton = document.getElementById('resendOtpButton');

    if (!passwordField || !otpButton) return;
    if (document.getElementById('gg-method-toggle')) return;

    otpButton.style.display = 'none';

    const L = window.GovBridge.dictionary.LANG[window.GovBridge.state.currentLang];

    const toggle = document.createElement('div');
    toggle.id = 'gg-method-toggle';
    toggle.innerHTML = `
      <span class="gg-label">${L.loginQuestion}</span>
      <div class="gg-options">
        <button class="gg-btn gg-active" id="gg-btn-password">${L.btnPassword}</button>
        <button class="gg-btn" id="gg-btn-otp">${L.btnOtp}</button>
      </div>
    `;

    const passwordTable = passwordField.closest('table');
    if (!passwordTable) return;
    passwordTable.parentElement.insertBefore(toggle, passwordTable);

    const otpBtnObserver = new MutationObserver(() => {
      const originalText = otpButton.textContent.trim().toLowerCase();
      const ggBtn = document.getElementById('gg-btn-otp');
      if (!ggBtn) return;
      
      const L2 = window.GovBridge.dictionary.LANG[window.GovBridge.state.currentLang];
      if (originalText.includes('resend') && originalText.includes('1')) {
        ggBtn.textContent = L2.btnResendOtp;
        ggBtn.disabled = false;
        ggBtn.style.opacity = '1';
        ggBtn.style.cursor = 'pointer';
        ggBtn.style.borderColor = '';
        ggBtn.style.color = '';
      } else if (originalText.includes('resend') && originalText.includes('2')) {
        ggBtn.textContent = L2.btnOtpLimit;
        ggBtn.disabled = true;
        ggBtn.style.opacity = '0.5';
        ggBtn.style.cursor = 'not-allowed';
        ggBtn.style.borderColor = '#ccc';
        ggBtn.style.color = '#888';
        ggBtn.style.background = 'white';
      }
    });
    otpBtnObserver.observe(otpButton, { childList: true, subtree: true, characterData: true });

    const activatePasswordMode = () => {
      const L3 = window.GovBridge.dictionary.LANG[window.GovBridge.state.currentLang];
      document.getElementById('gg-btn-password').classList.add('gg-active');
      document.getElementById('gg-btn-otp').classList.remove('gg-active');
      passwordField.type = 'password';
      passwordField.placeholder = L3.placeholderPassword;
      passwordField.value = '';
      const eyeBtn = document.getElementById('gg-eye-btn');
      if (eyeBtn) {
        eyeBtn.style.display = 'inline-flex';
        eyeBtn.textContent = '👁️';
      }
      passwordField.focus();
    };

    const activateOtpMode = () => {
      const L3 = window.GovBridge.dictionary.LANG[window.GovBridge.state.currentLang];
      document.getElementById('gg-btn-otp').classList.add('gg-active');
      document.getElementById('gg-btn-password').classList.remove('gg-active');
      passwordField.type = 'text';
      passwordField.placeholder = L3.placeholderOtp;
      passwordField.value = '';
      const eyeBtn = document.getElementById('gg-eye-btn');
      if (eyeBtn) eyeBtn.style.display = 'none';
      otpButton.click();
      passwordField.focus();
    };

    document.getElementById('gg-btn-password').addEventListener('click', activatePasswordMode);
    document.getElementById('gg-btn-otp').addEventListener('click', activateOtpMode);

    activatePasswordMode();
  },

  injectEyeToggle() {
    const passwordField = document.getElementById('password');
    const showPasswd = document.getElementById('showPasswd');
    const hidePasswd = document.getElementById('hidePasswd');

    if (!passwordField) return;
    if (document.getElementById('gg-eye-btn')) return;

    if (showPasswd) showPasswd.style.display = 'none';
    if (hidePasswd) hidePasswd.style.display = 'none';

    const inputGroup = passwordField.closest('.input-group');
    if (!inputGroup) return;

    const L = window.GovBridge.dictionary.LANG[window.GovBridge.state.currentLang];
    const eyeBtn = document.createElement('button');
    eyeBtn.id = 'gg-eye-btn';
    eyeBtn.type = 'button';
    eyeBtn.title = L.showHidePassword;
    eyeBtn.textContent = '👁️';
    inputGroup.appendChild(eyeBtn);

    eyeBtn.addEventListener('click', () => {
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeBtn.textContent = '👁️‍🗨️';
      } else {
        passwordField.type = 'password';
        eyeBtn.textContent = '👁️';
      }
      passwordField.focus();
    });
  },

  injectCaptchaHelper() {
    const captchaInput = document.getElementById('captchaAnswer');
    if (!captchaInput) return;
    if (document.getElementById('gg-captcha-helper')) return;

    const L = window.GovBridge.dictionary.LANG[window.GovBridge.state.currentLang];

    const helper = document.createElement('div');
    helper.id = 'gg-captcha-helper';
    helper.innerHTML = `
      <div class="gg-cap-title">${L.captchaTitle}</div>
      <div class="gg-pairs">
        ${L.captchaPairs.map(p => '<span class="gg-pair">' + p + '</span>').join('')}
      </div>
      <small class="gg-cap-hint">${L.captchaHint}</small>
    `;

    const captchaTable = captchaInput.closest('table');
    if (!captchaTable) return;
    captchaTable.insertAdjacentElement('afterend', helper);
  },

  translate(langCode, dict) {
    const L = dict.LANG[langCode];
    const dom = window.GovBridge.dom;

    const toggleLabel = document.querySelector('#gg-method-toggle .gg-label');
    if (toggleLabel) toggleLabel.textContent = L.loginQuestion;

    const btnPwd = document.getElementById('gg-btn-password');
    if (btnPwd) btnPwd.textContent = L.btnPassword;

    const btnOtp = document.getElementById('gg-btn-otp');
    if (btnOtp && !btnOtp.disabled) {
      const otpButton = document.getElementById('resendOtpButton');
      if (otpButton) {
        const originalText = otpButton.textContent.trim().toLowerCase();
        if (originalText.includes('resend') && originalText.includes('2')) {
          btnOtp.textContent = L.btnOtpLimit;
        } else if (originalText.includes('resend')) {
          btnOtp.textContent = L.btnResendOtp;
        } else {
          btnOtp.textContent = L.btnOtp;
        }
      } else {
        btnOtp.textContent = L.btnOtp;
      }
    } else if (btnOtp && btnOtp.disabled) {
      btnOtp.textContent = L.btnOtpLimit;
    }

    const passwordField = document.getElementById('password');
    if (passwordField) {
      if (passwordField.type === 'password' || document.querySelector('#gg-btn-password.gg-active')) {
        passwordField.placeholder = L.placeholderPassword;
      } else {
        passwordField.placeholder = L.placeholderOtp;
      }
    }

    const emailField = document.getElementById('email') || document.querySelector('input[placeholder*="Email"], input[placeholder*="Mobile"], input[placeholder*="ಇಮೇಲ್"], input[placeholder*="ಮೊಬೈಲ್"]');
    if (emailField) emailField.placeholder = L.placeholderEmail;

    const captchaInput = document.getElementById('captchaAnswer');
    if (captchaInput) captchaInput.placeholder = L.placeholderCaptcha;

    const eyeBtn = document.getElementById('gg-eye-btn');
    if (eyeBtn) eyeBtn.title = L.showHidePassword;

    const capTitle = document.querySelector('#gg-captcha-helper .gg-cap-title');
    if (capTitle) capTitle.innerHTML = L.captchaTitle;
    const capHint = document.querySelector('#gg-captcha-helper .gg-cap-hint');
    if (capHint) capHint.textContent = L.captchaHint;
    const capPairs = document.querySelectorAll('#gg-captcha-helper .gg-pair');
    if (capPairs.length > 0 && L.captchaPairs) {
      capPairs.forEach((el, i) => {
        if (L.captchaPairs[i]) el.textContent = L.captchaPairs[i];
      });
    }

    const submitInput = document.querySelector('input[type="submit"], input[value="Submit"], input[value="ಸಲ್ಲಿಸಿ"]');
    if (submitInput) submitInput.value = L.submit;

    dom.updateTextByContent('Apply for Service', L.applyForService, 'gg-apply-heading', dict);
    dom.updateLinkText('Forgot Password', L.forgotPassword, dict);
    dom.updateLinkText('New user', L.newUser, dict);
    dom.updateLinkText('Know Your Eligibility', L.eligibility, dict);
  },

  syncBoxWidths() {
    const emailField = document.getElementById('email') || document.querySelector('input[placeholder*="Email"], input[placeholder*="Mobile"], input[placeholder*="ಇಮೇಲ್"], input[placeholder*="ಮೊಬೈಲ್"]');
    if (!emailField) return;

    const toggleBox = document.getElementById('gg-method-toggle');
    const captchaBox = document.getElementById('gg-captcha-helper');

    const applyWidths = function () {
      const emailRect = emailField.getBoundingClientRect();
      const w = emailRect.width;

      if (w > 0) {
        if (toggleBox) {
          toggleBox.style.width = w + 'px';
          toggleBox.style.marginLeft = '0';
          toggleBox.style.marginRight = '0';
          toggleBox.style.transform = 'none';

          const boxRect = toggleBox.getBoundingClientRect();
          const diffX = emailRect.left - boxRect.left;
          toggleBox.style.transform = 'translateX(' + diffX + 'px)';
        }

        if (captchaBox) {
          captchaBox.style.width = w + 'px';
          captchaBox.style.marginLeft = '0';
          captchaBox.style.marginRight = '0';
          captchaBox.style.transform = 'none';

          const capRect = captchaBox.getBoundingClientRect();
          const diffX = emailRect.left - capRect.left;
          captchaBox.style.transform = 'translateX(' + diffX + 'px)';
        }
      }
    };

    let resizeTimeout = null;
    const debouncedApply = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(applyWidths, 100);
    };

    setTimeout(applyWidths, 50);

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(debouncedApply);
      ro.observe(emailField);
      ro.observe(document.body);
    } else {
      window.addEventListener('resize', debouncedApply);
    }
  }
};
