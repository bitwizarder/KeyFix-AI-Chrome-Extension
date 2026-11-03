const $ = id => document.getElementById(id);
const source = $('source'), result = $('result'), notice = $('notice');
const keyboard = globalThis.KeyFixKeyboard;
const locale = globalThis.KeyFixLocale;
let language = locale.getDefaultLanguage();

function applyLanguage(nextLanguage) {
  language = locale.resolveLanguage(nextLanguage);
  const strings = locale.messages[language];
  const isPersian = language === 'fa';
  document.documentElement.lang = language;
  document.documentElement.dir = isPersian ? 'rtl' : 'ltr';

  for (const id of [
    'brandSubtitle', 'activeText', 'heroTitle', 'heroDescription', 'sourceLabel',
    'resultLabel', 'suggestionsTitle', 'suggestionsDescription', 'smartModeTitle',
    'smartModeDescription', 'refreshHint'
  ]) {
    $(id).textContent = strings[id];
  }
  $('source').placeholder = strings.sourcePlaceholder;
  $('convertText').textContent = strings.convert;
  $('swap').title = strings.swapTitle;
  $('swap').setAttribute('aria-label', strings.swapTitle);
  $('result').placeholder = strings.resultPlaceholder;
  $('copy').textContent = strings.copy;
  $('copy').title = strings.copyTitle;
  $('privacyText').textContent = `🔒 ${strings.privacy}`;
  $('shortcut').textContent = strings.shortcut;
  $('languageToggle').textContent = strings.switchLanguage;
  $('languageToggle').title = strings.switchLanguageTitle;
  $('languageToggle').setAttribute('aria-label', strings.switchLanguageTitle);
}

function run(direction = null) {
  const value = source.value;
  if (!value.trim()) { notice.textContent = locale.messages[language].emptySource; result.value = ''; return; }
  const dir = direction || keyboard.guessDirection(value);
  result.value = keyboard.convert(value, dir);
  notice.textContent = dir === 'fa'
    ? locale.messages[language].convertedToPersian
    : locale.messages[language].convertedToEnglish;
}
$('convert').addEventListener('click', () => run());
$('swap').addEventListener('click', () => {
  if (!source.value.trim()) { notice.textContent = locale.messages[language].emptySource; return; }
  const inferred = keyboard.guessDirection(source.value);
  run(inferred === 'fa' ? 'en' : 'fa');
});
$('copy').addEventListener('click', async () => {
  if (!result.value) { notice.textContent = locale.messages[language].emptyResult; return; }
  try { await navigator.clipboard.writeText(result.value); notice.textContent = locale.messages[language].copied; }
  catch { result.focus(); result.select(); notice.textContent = locale.messages[language].copyFallback; }
});
chrome.storage.sync.get({ suggestions: true, smartMode: true, language: null }, data => {
  $('suggestions').checked = data.suggestions;
  $('smartMode').checked = data.smartMode;
  applyLanguage(data.language);
});
$('languageToggle').addEventListener('click', () => {
  const nextLanguage = language === 'fa' ? 'en' : 'fa';
  applyLanguage(nextLanguage);
  chrome.storage.sync.set({ language: nextLanguage });
  notice.textContent = '';
});
$('suggestions').addEventListener('change', e => {
  chrome.storage.sync.set({ suggestions: e.target.checked });
  notice.textContent = e.target.checked
    ? locale.messages[language].suggestionsOn
    : locale.messages[language].suggestionsOff;
});
$('smartMode').addEventListener('change', e => {
  chrome.storage.sync.set({ smartMode: e.target.checked });
  notice.textContent = e.target.checked
    ? locale.messages[language].smartModeOn
    : locale.messages[language].smartModeOff;
});
