(() => {
  const messages = {
    fa: {
      brandSubtitle: 'دستیار هوشمند تایپ',
      active: 'فعال',
      heroTitle: 'زبان اشتباه؟ درستش کن.',
      heroDescription: 'متنت رو وارد کن یا در هر صفحه وب، عبارت را اصلاح کن.',
      sourceLabel: 'متنی که اشتباهی تایپ شده',
      sourcePlaceholder: 'مثلاً sghl o,fd?',
      convert: 'تبدیل متن',
      swapTitle: 'تبدیل در جهت برعکس',
      resultLabel: 'نتیجه',
      resultPlaceholder: 'نتیجه اینجا نمایش داده می‌شود',
      copy: 'کپی',
      copyTitle: 'کپی نتیجه',
      suggestionsTitle: 'پیشنهاد هنگام تایپ',
      suggestionsDescription: 'در همان صفحه، پیشنهاد اصلاح را کنار فیلد نشان بده.',
      smartModeTitle: 'تشخیص دقیق‌تر',
      smartModeDescription: 'پیشنهاد خودکار برای عبارت‌های آشنای فارسی و انگلیسی؛ مزاحمت کمتر.',
      privacy: 'پردازش متن به‌صورت محلی',
      shortcut: 'Alt + Shift + F',
      refreshHint: 'برای فعال‌شدن در تب‌های باز، صفحه را یک‌بار تازه‌سازی کن.',
      switchLanguage: 'English',
      switchLanguageTitle: 'Switch interface language to English',
      emptySource: 'اول متن رو وارد کن.',
      convertedToPersian: 'متن به چیدمان فارسی تبدیل شد.',
      convertedToEnglish: 'متن به چیدمان انگلیسی تبدیل شد.',
      emptyResult: 'چیزی برای کپی کردن نیست.',
      copied: 'نتیجه کپی شد ✓',
      copyFallback: 'متن انتخاب شد؛ Ctrl+C رو بزن.',
      suggestionsOn: 'پیشنهادهای هنگام تایپ فعال شد.',
      suggestionsOff: 'پیشنهادهای هنگام تایپ غیرفعال شد.',
      smartModeOn: 'حالت تشخیص دقیق‌تر فعال شد.',
      smartModeOff: 'پیشنهادهای بیشتری برای هر دو زبان نمایش داده می‌شود.',
      suggestionTitle: 'شاید زبان کیبورد اشتباهه',
      fix: 'اصلاح',
      fixPhrase: 'اصلاح عبارت',
      dismiss: 'بستن'
    },
    en: {
      brandSubtitle: 'Smart typing assistant',
      active: 'Active',
      heroTitle: 'Wrong keyboard layout? Fix it.',
      heroDescription: 'Enter text here, or fix a phrase on any webpage.',
      sourceLabel: 'Text typed with the wrong layout',
      sourcePlaceholder: 'For example: sghl o,fd?',
      convert: 'Convert text',
      swapTitle: 'Switch conversion direction',
      resultLabel: 'Result',
      resultPlaceholder: 'Your converted text will appear here',
      copy: 'Copy',
      copyTitle: 'Copy result',
      suggestionsTitle: 'Suggestions while typing',
      suggestionsDescription: 'Show correction suggestions beside fields on webpages.',
      smartModeTitle: 'Smart detection',
      smartModeDescription: 'Fewer suggestions; favors familiar Persian and English phrases.',
      privacy: 'Text is processed locally',
      shortcut: 'Alt + Shift + F',
      refreshHint: 'Refresh already-open tabs to enable the extension.',
      switchLanguage: 'فارسی',
      switchLanguageTitle: 'تغییر زبان رابط به فارسی',
      emptySource: 'Enter some text first.',
      convertedToPersian: 'Text converted to the Persian keyboard layout.',
      convertedToEnglish: 'Text converted to the English keyboard layout.',
      emptyResult: 'There is nothing to copy.',
      copied: 'Result copied ✓',
      copyFallback: 'Text selected. Press Ctrl+C to copy.',
      suggestionsOn: 'Typing suggestions enabled.',
      suggestionsOff: 'Typing suggestions disabled.',
      smartModeOn: 'Smart detection enabled.',
      smartModeOff: 'More suggestions are now shown for both languages.',
      suggestionTitle: 'Your keyboard layout may be incorrect',
      fix: 'Fix',
      fixPhrase: 'Fix phrase',
      dismiss: 'Dismiss'
    }
  };

  function getDefaultLanguage(browserLanguage = globalThis.navigator?.language) {
    return String(browserLanguage || '').toLowerCase().startsWith('fa') ? 'fa' : 'en';
  }

  function resolveLanguage(preference, browserLanguage) {
    if (preference === 'fa' || preference === 'en') return preference;
    return getDefaultLanguage(browserLanguage);
  }

  const api = Object.freeze({
    messages,
    getDefaultLanguage,
    resolveLanguage
  });
  globalThis.KeyFixLocale = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
