const assert = require('node:assert/strict');
const test = require('node:test');
const locale = require('../language.js');

test('chooses Persian for Persian browser locales and English otherwise', () => {
  assert.equal(locale.getDefaultLanguage('fa-IR'), 'fa');
  assert.equal(locale.getDefaultLanguage('en-US'), 'en');
  assert.equal(locale.getDefaultLanguage('de-DE'), 'en');
});

test('explicit language preference overrides browser language', () => {
  assert.equal(locale.resolveLanguage('en', 'fa-IR'), 'en');
  assert.equal(locale.resolveLanguage('fa', 'en-US'), 'fa');
});

test('both UI languages provide every popup and suggestion message', () => {
  const keys = Object.keys(locale.messages.fa).sort();
  assert.deepEqual(Object.keys(locale.messages.en).sort(), keys);
  for (const language of ['fa', 'en']) {
    for (const [key, value] of Object.entries(locale.messages[language])) {
      assert.equal(typeof value, 'string', `${language}.${key} should be text`);
      assert.ok(value.length > 0, `${language}.${key} should not be empty`);
    }
  }
});
