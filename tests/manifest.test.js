const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));

test('manifest points to existing extension files', () => {
  const referencedFiles = [
    manifest.background.service_worker,
    manifest.action.default_popup,
    ...manifest.content_scripts.flatMap(script => [...script.js, ...script.css]),
    ...Object.values(manifest.icons),
    ...Object.values(manifest.action.default_icon)
  ];

  for (const file of referencedFiles) {
    assert.equal(fs.existsSync(path.join(root, file)), true, `Missing manifest file: ${file}`);
  }
});

test('keyboard helper loads before the content script', () => {
  for (const script of manifest.content_scripts) {
    assert.ok(
      script.js.indexOf('keyboard.js') < script.js.indexOf('language.js') &&
        script.js.indexOf('language.js') < script.js.indexOf('content.js'),
      'keyboard.js and language.js must load before content.js'
    );
  }
});

test('manifest and package versions match', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(manifest.version, packageJson.version);
});

test('default locale and localized manifest messages are valid', () => {
  assert.equal(manifest.default_locale, 'en');
  for (const language of ['en', 'fa']) {
    const messages = JSON.parse(
      fs.readFileSync(path.join(root, '_locales', language, 'messages.json'), 'utf8')
    );
    for (const key of ['extensionName', 'extensionDescription', 'convertSelectionCommand']) {
      assert.equal(typeof messages[key]?.message, 'string', `Missing ${language}.${key}`);
    }
  }
});
