# KeyFix AI

A lightweight Chrome extension that detects text typed with the wrong keyboard layout and suggests a local correction in Persian or English.

> Despite the product name, KeyFix does not use a cloud AI service. Text analysis and conversion run locally in your browser.

[راهنمای فارسی](README-fa.md)

## Features

- Detects likely Persian text typed with an English keyboard layout and English text typed with a Persian layout.
- Suggests a correction for the phrase around the caret instead of limiting the suggestion to the last word.
- Can correct a single-character typo in a recognized word, including an extra repeated character.
- Lets you accept or dismiss suggestions without changing surrounding text.
- Includes a popup converter and the `Alt+Shift+F` shortcut for selected text or the phrase near the caret.
- Provides a Persian and English interface, follows the browser language by default, and remembers your manual language choice.
- Keeps text on-device; no analytics, remote API, or account is used.

## Install for development

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome or a Chromium-based browser.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the repository directory (the one containing `manifest.json`).
5. Refresh any pages that were already open.

The extension cannot run on protected browser pages such as `chrome://` or the Chrome Web Store. Some canvas-based and custom editors may not expose editable text to extensions.

## Use

- Type in a supported text field. If the current phrase looks like text entered with the wrong layout, a suggestion appears after a short pause.
- Select **Fix** or **Fix phrase** to apply it, or dismiss the suggestion.
- Open the extension popup to convert text manually.
- Use `Alt+Shift+F` to convert selected text, or the phrase near the caret when there is no selection. You can change the shortcut at `chrome://extensions/shortcuts`.
- Turn off **Smart detection** in the popup to see more suggestions. This can also increase false positives.

The built-in word lists are intentionally limited. KeyFix is a keyboard-layout helper, not a general-purpose spell checker, translator, or grammar checker. Unknown words and longer typos may not be recognized.

## Privacy and permissions

KeyFix processes text locally and does not transmit page text. Its content script runs on HTTP and HTTPS pages to offer suggestions in editable fields.

- `storage`: saves the suggestion and smart-mode preferences.
- `activeTab`: supports the keyboard shortcut on the active tab.

## Development

Requires Node.js 22 or newer to run the test suite. There are no npm dependencies.

```sh
npm test
npm run check
```

The GitHub Actions workflow runs both commands on pushes and pull requests.

## Licensing

- Extension source code: [MIT License](LICENSE).
- Bundled Vazirmatn font files: [SIL Open Font License 1.1](fonts/OFL.txt).

The source-code license does not replace or change the font's separate license.
