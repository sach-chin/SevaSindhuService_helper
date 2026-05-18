window.GovBridge = window.GovBridge || {};

window.GovBridge.dictionary = {
  LANG: {
    en: {
      // Login method toggle
      loginQuestion: 'How do you want to log in?',
      btnPassword: '🔑 I have a password',
      btnOtp: '📱 Send me an OTP',
      btnResendOtp: '📱 Resend OTP',
      btnOtpLimit: '🚫 OTP limit reached',

      // Placeholders
      placeholderEmail: 'Email ID / Mobile No',
      placeholderPassword: 'Enter your password',
      placeholderOtp: 'Enter OTP sent to your email / Mobile No',
      placeholderCaptcha: 'Type here',

      // Buttons & labels
      submit: 'Submit',
      forgotPassword: 'Forgot Password',
      newUser: 'New user ? Register here',
      eligibility: 'Know Your Eligibility',
      showHidePassword: 'Show/hide password',

      // Section headings
      applyForService: 'Apply for Service',
      checkStatus: 'Check Your Application Status',
      selectDepartment: 'Select Department',
      selectService: 'Select Service',
      applicationId: 'Enter your Application ID',
      checkStatusBtn: 'Check Status Now',

      // CAPTCHA helper
      captchaTitle: '⚠️ Easy to mix up:',
      captchaHint: 'Click the refresh icon if the CAPTCHA is hard to read.',
      captchaPairs: ['l ≠ 1', 'O ≠ 0', 'I ≠ 1', 'g ≠ 9', 'z ≠ 2']
    },
    kn: {
      // Login method toggle
      loginQuestion: 'ನೀವು ಹೇಗೆ ಲಾಗಿನ್ ಆಗಲು ಬಯಸುತ್ತೀರಿ?',
      btnPassword: '🔑 ನನ್ನ ಬಳಿ ಪಾಸ್‌ವರ್ಡ್ ಇದೆ',
      btnOtp: '📱 ನನಗೆ OTP ಕಳುಹಿಸಿ',
      btnResendOtp: '📱 OTP ಮರುಕಳುಹಿಸಿ',
      btnOtpLimit: '🚫 OTP ಮಿತಿ ಮುಗಿದಿದೆ',

      // Placeholders
      placeholderEmail: 'ಇಮೇಲ್ ಐಡಿ / ಮೊಬೈಲ್ ನಂಬರ್',
      placeholderPassword: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
      placeholderOtp: 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ  ಕಳುಹಿಸಿದ OTP ನಮೂದಿಸಿ',
      placeholderCaptcha: 'ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ',

      // Buttons & labels
      submit: 'ಸಲ್ಲಿಸಿ',
      forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
      newUser: 'ಹೊಸ ಬಳಕೆದಾರರೇ? ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ',
      eligibility: 'ನಿಮ್ಮ ಅರ್ಹತೆ ತಿಳಿಯಿರಿ',
      showHidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ/ಮರೆಮಾಡಿ',

      // Section headings
      applyForService: 'ಸೇವೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
      checkStatus: 'ನಿಮ್ಮ ಅರ್ಜಿ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
      selectDepartment: 'ಇಲಾಖೆ ಆಯ್ಕೆ ಮಾಡಿ',
      selectService: 'ಸೇವೆ ಆಯ್ಕೆ ಮಾಡಿ',
      applicationId: 'ನಿಮ್ಮ ಅರ್ಜಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
      checkStatusBtn: 'ಈಗ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',

      // CAPTCHA helper
      captchaTitle: '⚠️ ಗೊಂದಲಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು:',
      captchaHint: 'CAPTCHA ಓದಲು ಕಷ್ಟವಾದರೆ ರಿಫ್ರೆಶ್ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.',
      captchaPairs: ['l ≠ 1', 'O ≠ 0', 'I ≠ 1', 'g ≠ 9', 'z ≠ 2']
    }
  },

  DROPDOWN_DICT: {
    'Revenue Department': 'ಕಂದಾಯ ಇಲಾಖೆ',
    'Food And Civil Supplies Department': 'ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ',
    'Agricultural Family member Certificate': 'ಕೃಷಿ ಕುಟುಂಬ ಸದಸ್ಯರ ಪ್ರಮಾಣಪತ್ರ',
    'Agricultural Labour Certificate': 'ಕೃಷಿ ಕಾರ್ಮಿಕರ ಪ್ರಮಾಣಪತ್ರ',
    'Addition of Name in RC': 'ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ (RC) ಹೆಸರು ಸೇರ್ಪಡೆ',
    'Correction of incorrect card category entries like APL. BPL & AAY': 'APL, BPL ಮತ್ತು AAY ನಂತಹ ತಪ್ಪಾದ ಕಾರ್ಡ್ ವರ್ಗ ನಮೂದುಗಳ ತಿದ್ದುಪಡಿ'
  }
};
