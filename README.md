# GovBridge – Seva Sindhu Helper

Welcome to **GovBridge**, a Chrome extension that makes accessing Karnataka government services simpler and more accessible. Get bilingual support (Kannada & English), intelligent form detection, and auto-fill capabilities for Seva Sindhu portal applications.

We're currently live for the [Seva Sindhu Services Portal](https://sevasindhuservices.karnataka.gov.in/) and working to expand coverage to other government portals.

## How did it start?

Seva Sindhu is a vital portal for Karnataka citizens to apply for government services – from property certificates to electricity connections. However, the portal presents challenges:

- **Language barrier**: Not all users are comfortable with English-only interfaces
- **Form complexity**: Many applications are lengthy and difficult to navigate
- **Repetitive data entry**: Users often fill the same information across multiple forms
- **Accessibility**: No tools exist to help citizens understand or streamline the process

GovBridge was built to bridge this gap – making government services more accessible to all Kannada and English-speaking citizens.

## What can it do?

### Features

-- **Bilingual Support**: Seamlessly switch between Kannada and English across the portal
-- **Form Detection**: Automatically identifies which government service form you're on
-- **Smart Auto-fill**: Pre-fills common fields across application forms
-- **Targeted Help**: Provides language-specific enhancements for:
  - Property possession certificate applications (flats & sites)
  - Electricity connection applications (GESCOM)
  - User login forms
  - Service status inquiry forms
-- **Extensible**: Easily add support for new service forms

## How can you help?

We encourage contributions! Here's what we need:

### Code Contributions

1. **Add new form handlers**: Extend `src/forms/` with new service types
2. **Improve form detection**: Enhance the pattern matching in `src/core/formDetector.js`
3. **Expand language support**: Add translations to `src/core/dictionary.js`
4. **Bug fixes & UI improvements**: Triage and fix UI issues

### Data Contributions

1. **Identify new services**: Help us map out other forms on the Seva Sindhu portal
2. **Field mapping**: Document which fields appear on each service form
3. **Test coverage**: Report any forms that don't work correctly
4. **Kannada translations**: Verify and improve Kannada field labels and help text

### Getting Started

Before you start, please:

- **Reach out to us** via [contact](https://zencitizen.in/contact-us/) so we can align efforts
- **Review the project structure** in the sections below

## Project Structure

```
├── manifest.json                 # Chrome extension configuration
├── styles.css                    # Extension styling
├── src/
│   ├── main.js                   # Entry point and initialization
│   ├── core/
│   │   ├── state.js              # State management
│   │   ├── dictionary.js         # Bilingual translations (Kannada/English)
│   │   ├── formDetector.js       # Service form identification logic
│   │   └── testApps.json         # Test application registry
│   ├── components/
│   │   └── langBar.js            # Language toggle UI component
│   ├── forms/
│   │   ├── loginForm.js          # Login form handler
│   │   ├── statusForm.js         # Service status inquiry handler
│   │   └── newConnectionGESCOM.js # Electricity connection handler
│   └── utils/
│       └── dom.js                # DOM manipulation utilities
├── tools/
│   └── scrape_seva_playwright.py # Web scraper for service discovery
├── requirements.txt              # Python dependencies
└── README.md                      # This file
```

## Installation

### For Users

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select this folder
5. The extension should appear in your toolbar

### For Developers

Clone this repo
https://github.com/sachin2003sacchu/SevaSindhuService_helper

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   ```

2. On Windows (PowerShell):
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

3. Install dependencies for the scraper tool:
   ```bash
   pip install -r requirements.txt
   python -m playwright install chromium
   ```

## Usage

### Using the Extension

1. Install the extension from a browser store (Chrome Web Store) or download the unpacked extension and load it manually in the browser
2. Navigate to the Seva Sindhu Services Portal: https://sevasindhuservices.karnataka.gov.in/
3. The extension will automatically activate on supported pages
4. Use the language toggle to switch between Kannada and English
5. Common fields may be auto-filled by the extension to speed up applications

### Running the Scraper Tool (developers only)

The Playwright scraper (`tools/scrape_seva_playwright.py`) is a developer utility used to collect service and form metadata from Seva Sindhu. It is NOT required for end users — it helps contributors build and verify form handlers.

Run it like this:

```bash
python tools/scrape_seva_playwright.py
```

Notes:
- The script runs in headed mode so you can log in interactively.
- After login and when the services table is visible, follow the script prompts to continue.
- Output is written to `seva_services_all_pages.txt` for analysis and mapping.

## Development

### Adding a New Service Form

1. Create a new file in `src/forms/` (e.g., `myServiceForm.js`)
2. Follow the pattern from existing forms – define a handler object with methods like `autoFill()`, `validate()`, etc.
3. Register the form in `src/core/formDetector.js` by adding an entry to `appRegistry`
4. Add test cases and Kannada translations to `src/core/dictionary.js`
5. Update this README

### Adding Translations

Edit `src/core/dictionary.js` to add Kannada and English translations:

```javascript
{
  en: "Your English label",
  kn: "ನಿಮ್ಮ ಕನ್ನಡ ಪದರ"
}
```

### Testing (developers)

There are no automated test scripts included yet. Current testing is manual:

1. Make code changes
2. Reload the extension in your browser (Developer mode > reload)
3. Manually exercise target forms on the Seva Sindhu site and verify behavior
4. Use the browser console to inspect errors and logs

You can add automated tests later; leave placeholders for test scripts in `tests/` when ready.

## Troubleshooting

**Extension doesn't load?**
- Ensure you've allowed "File access" for the extension in `chrome://extensions/`
- Check the console (F12 > Console tab) for error messages

**Forms not auto-filling?**
- The service may not be in the `appRegistry` yet – please contact the maintainers via the contact page
- Try manually testing the form and report what fields should auto-fill

**Scraper not working?**
- Ensure you have Playwright and Chromium installed: `python -m playwright install chromium`
- Check that you're logged into Seva Sindhu before pressing Enter in the terminal

**Kannada text not displaying?**
- Verify your system has Kannada fonts installed
- Report the issue with screenshots

## Additional Resources

- [Seva Sindhu Services Portal](https://sevasindhuservices.karnataka.gov.in/) – The main portal
- [Zen Citizen](https://zencitizen.in/) – The organization behind this project
- [Contact Us](https://zencitizen.in/contact-us/) – Get in touch with the team

## License & Attribution

This project is maintained by [Zen Citizen](https://zencitizen.in/) to help citizens access government services more easily.

---

**Questions or ideas?** Open an issue or [reach out to us](https://zencitizen.in/contact-us/). We'd love to hear from you!
