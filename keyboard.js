(() => {
  const enToFa = {
    q: 'ض', w: 'ص', e: 'ث', r: 'ق', t: 'ف', y: 'غ', u: 'ع', i: 'ه', o: 'خ', p: 'ح', '[': 'ج', ']': 'چ',
    a: 'ش', s: 'س', d: 'ی', f: 'ب', g: 'ل', h: 'ا', j: 'ت', k: 'ن', l: 'م', ';': 'ک', "'": 'گ',
    z: 'ظ', x: 'ط', c: 'ز', v: 'ر', b: 'ذ', n: 'د', m: 'ئ', ',': 'و', '.': '.', '/': '/', '?': '؟', ' ': ' '
  };
  Object.assign(enToFa, {
    Q: 'ْ', W: 'ٌ', E: 'ٍ', R: 'ً', T: 'ُ', Y: 'ِ', U: 'َ', I: 'ّ', O: ']', P: '[',
    A: 'ؤ', S: 'ئ', D: 'ي', F: 'إ', G: 'أ', H: 'آ', J: 'ة', K: '»', L: '«', Z: 'ٰ',
    X: 'ٓ', C: 'ژ', V: '‌', B: '‌', N: 'ء', M: 'ء', '<': '،', '>': '.', '|': '؛'
  });

  const faToEn = Object.create(null);
  for (const [key, value] of Object.entries(enToFa)) {
    if (faToEn[value] === undefined) faToEn[value] = key.toLowerCase();
  }
  Object.assign(faToEn, { '؟': '?', '،': ',', '؛': ';', '‌': '' });

  const persianWords = new Set((
    'سلام خوبی خوب چطوری چطور چطوره چرا چی چه من تو شما ما این اون آن آره نه بله باشه ' +
    'عالی فقط فونت ممنون مرسی لطفا لطفاً خواهش امروز فردا دیروز الان بعد قبل کجا کی چقدر هست هستم هستی هستند ' +
    'بود بودم باشه دارم داری داریم دارند میخوام می‌خوام میشه می‌شود نمیخوام نمی‌خوام کردم کن کار ' +
    'پروژه سایت فایل برنامه اکستنشن افزونه فارسی انگلیسی درست اشتباه تایپ متن تست یکی دیگه خیلی بیشتر ' +
    'کمتر خوبه عالیه اوکی ممنونم وقت بخیر روز شب صبح عصر حالت حال سلامتی دمت گرم دوست دارم منم اونا ' +
    'اینجا اونجا همین همینکه بفرما انجام بده بگو ببین بریم بیا خسته نباشی خداحافظ فعلا فعلاً جدید ' +
    'شد باز مشکل وب گوگل تلگرام واتساپ جیمیل ایمیل شماره آدرس نام قیمت خرید فروش هستش بودش دارم ' +
    'می‌کنم می‌کنیم می‌کنید می‌کنند می‌خواهم می‌خواهی می‌خواهد می‌خواهیم می‌خواهید می‌خواهند ' +
    'نمی‌دانم نمیدانم می‌دونم میدونم می‌دونی میدونی می‌تونی میتونی می‌توانم می‌تونم ' +
    'باید شاید ممکن حتما حتماً الانم الانش لطفاً بگو بکن بکنم بکنیم بکنید بکنند کردم کردی کرد ' +
    'کردیم کردید کردند گفتم گفتی گفت گفتیم گفتید گفتند دیدم دیدی دید دیدیم دیدید دیدند ' +
    'رفتم رفتی رفت رفتیم رفتید رفتند آمدم آمدی آمد آمدیم آمدید آمدند نوشتم نوشتی نوشت ' +
    'می‌نویسم مینویسم می‌نویسی می‌نویسد می‌نویسیم بخون بخوان بنویس بنویسم بفرست فرستادم ' +
    'ببینم ببینی ببینه ببینیم ببینید ببینند باشم باشی باشد باشیم باشید باشند ' +
    'منظور معنی کلمه جمله عبارت جواب سوال پرسش پاسخ کمک راهنمایی توضیح بررسی کن ' +
    'میشه میشه؟ می‌تونی؟ میشه لطفا اصلاح درستش کن اشتباهه تایپ کردم تایپ شد ' +
    'دوست عزیز سلام روزت خوبی هستید خوبم خوبین خوبید عالیه بد نیست خوب نیست ' +
    'می‌خوام میخوام برم میرم بریم میای می‌آیی میاد می‌آید می‌ره میره ' +
    'اینکه اگه اگر چون ولی اما برای درباره نسبت از به با در تا روی زیر بین ' +
    'هم همون همان یکی چند هر همه هیچ بعضی کدام کدوم چیزی چیز چیزها کسی ' +
    'خونه خانه مدرسه دانشگاه شرکت محل شهر کشور ایران تهران دنیا زندگی زمان وقت ' +
    'هوا آب غذا کتاب گوشی کامپیوتر لپتاپ ویندوز مک اندروید کروم مرورگر صفحه ' +
    'ممنون بابت لطف زحمت سپاس متشکرم ببخشید معذرت سلامتی خوشحال خوشحالم ' +
    'صبح بخیر شب بخیر عصر بخیر خداحافظ فعلا بعدا بعداً تا فردا مراقب باش ' +
    'پول هزینه حساب پولی رایگان سریع ساده بهتر بهترین بزرگ کوچک جدید قدیمی ' +
    'اول آخر اولی آخری سمت چپ راست بالا پایین جلو عقب وسط نزدیک دور ' +
    'فارسی انگلیسی عربی زبان کیبورد صفحه‌کلید کلید نوشته متن تایپ کردن اصلاح ' +
    'پیشنهاد کلمه واژه جمله پاراگراف معنی ترجمه درست غلط صحیح خطا اشتباه مشکل ' +
    'افزونه اکستنشن نرم‌افزار برنامه اپلیکیشن سایت وبسایت وب‌سایت اینترنت ' +
    'عکس تصویر فیلم ویدیو صدا موسیقی پیام ایمیل نامه خبر گزارش تماس جلسه ' +
    'کاربر مدیر حساب کاربری رمز عبور گذرواژه تنظیمات انتخاب ذخیره حذف اضافه ' +
    'باز بسته روشن خاموش فعال غیرفعال آنلاین آفلاین محلی امن سریع دقیق ' +
    'من می تو شما او آنها ایشان ما شماها اینها آنها که را رو هست به از ' +
    'برای ولی یا و اگر چون وقتی پس تا نه بله چرا چطور کجا کی چی چه ' +
    'ممنونم عزیز جان داداش آبجی آقا خانم استاد دکتر مهندس'
  ).split(/\s+/).map(normalizeWord));

  const englishWords = new Set((
    'a an the and or but if then than because as at by for from in into of on onto to with without ' +
    'is are was were be been being have has had do does did can could will would should may might must ' +
    'i me my mine we us our ours you your yours he him his she her hers it its they them their theirs ' +
    'this that these those there here what which who whom whose when where why how all any both each few ' +
    'more most other some such no nor not only own same so too very just also again ever never always ' +
    'hello hi hey good great fine thanks thank please sorry welcome yes yeah no okay ok today tomorrow ' +
    'yesterday now later before after time day week month year morning night evening work home school ' +
    'world people person man woman child family friend name life way thing place case point problem ' +
    'help make get go know think see come want use find give tell ask need feel try leave call keep let ' +
    'begin seem show hear play run move live believe bring happen write provide sit stand lose pay meet ' +
    'include continue set learn change lead understand watch follow stop create speak read allow add ' +
    'spend grow open walk win offer remember love consider appear buy wait serve die send expect build ' +
    'stay fall cut reach remain suggest raise pass sell require report decide pull return explain hope ' +
    'develop carry break receive agree support hit produce eat cover catch draw choose cause listen ' +
    'close finish talk turn start look want work read house car computer phone browser page text word ' +
    'sentence language keyboard english persian correct wrong typo typing fix suggestion extension ' +
    'software application website internet email message file folder settings account password ' +
    'quick fast slow easy simple better best new old right left up down first last next previous ' +
    'small large big important different same possible sure real local private secure accurate ' +
    'please help me can you how are you what is this it is fine that is good this is a test ' +
    'i am you are we are they are he is she is it works does it work thank you very much ' +
    'good morning good night see you have a nice day'
  ).split(/\s+/).map(normalizeWord));

  const persianLetters = /[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u06C0]/;
  const latinLetters = /[A-Za-z]/;
  const wordPattern = /[A-Za-z]+|[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u06C0\u200C]+/g;

  function normalizeWord(word) {
    return String(word)
      .normalize('NFC')
      .replace(/[يى]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/[\u064B-\u065F\u0670\u200C]/g, '')
      .toLowerCase();
  }

  function convert(text, direction) {
    let source = String(text);
    if (direction === 'fa') {
      source = source.replace(/([A-Za-z]{2,})\s+T(?=\s+[A-Za-z]{2,})/g, '$1،');
    }
    const map = direction === 'fa' ? enToFa : faToEn;
    return [...source].map(character => map[character] ?? character).join('')
      .replace(/[ \t\u00a0]+([،؛؟,.!])/g, '$1')
      .replace(/([،؛؟!?])(?=\S)/g, '$1 ');
  }

  function guessDirection(text) {
    const source = String(text);
    const latin = (source.match(/[A-Za-z]/g) || []).length;
    const persian = (source.match(/[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u06C0]/g) || []).length;
    return latin >= persian ? 'fa' : 'en';
  }

  function isOneEditApart(left, right) {
    if (Math.abs(left.length - right.length) > 1) return false;
    let leftIndex = 0;
    let rightIndex = 0;
    let edits = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] === right[rightIndex]) {
        leftIndex += 1;
        rightIndex += 1;
        continue;
      }
      edits += 1;
      if (edits > 1) return false;
      if (left.length > right.length) leftIndex += 1;
      else if (right.length > left.length) rightIndex += 1;
      else {
        leftIndex += 1;
        rightIndex += 1;
      }
    }
    if (leftIndex < left.length || rightIndex < right.length) edits += 1;
    return edits <= 1;
  }

  function correctKnownTypos(text, dictionary) {
    wordPattern.lastIndex = 0;
    const matches = [...String(text).matchAll(wordPattern)];
    let corrected = String(text);
    let knownCount = 0;
    let changed = false;
    const patches = [];

    for (const match of matches) {
      const word = normalizeWord(match[0]);
      if (dictionary.has(word)) {
        knownCount += 1;
        continue;
      }
      const closeMatches = [];
      for (const knownWord of dictionary) {
        if (isOneEditApart(word, knownWord)) closeMatches.push(knownWord);
        if (closeMatches.length > 1) break;
      }
      if (closeMatches.length !== 1) continue;

      const correctedWord = closeMatches[0];
      patches.push({ start: match.index, end: match.index + match[0].length, word: correctedWord });
      knownCount += 1;
      changed = true;
    }

    for (const patch of patches.reverse()) {
      corrected = corrected.slice(0, patch.start) + patch.word + corrected.slice(patch.end);
    }
    return { text: corrected, knownCount, changed };
  }

  function analyzeAt(text, caret, smartMode = true) {
    const source = String(text);
    const offset = Math.max(0, Math.min(source.length, Number(caret) || 0));
    const tokens = [];
    wordPattern.lastIndex = 0;
    let match;
    while ((match = wordPattern.exec(source)) !== null) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        script: latinLetters.test(match[0]) ? 'latin' : 'persian'
      });
    }
    if (!tokens.length) return null;

    let tokenIndex = -1;
    let closestDistance = Infinity;
    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index];
      const distance = offset < token.start ? token.start - offset : offset > token.end ? offset - token.end : 0;
      if (distance < closestDistance || (distance === closestDistance && token.end <= offset)) {
        tokenIndex = index;
        closestDistance = distance;
      }
    }

    const script = tokens[tokenIndex].script;
    let first = tokenIndex;
    let last = tokenIndex;
    const canJoin = (left, right) => {
      if (left.script !== right.script) return false;
      const gap = source.slice(left.end, right.start);
      return gap.length <= 12 &&
        !/[\r\n.!?؟؛]/.test(gap) &&
        /^[\s,،:()[\]{}'"“”‘’'’\-–—]*$/.test(gap);
    };
    while (first > 0 && canJoin(tokens[first - 1], tokens[first])) first -= 1;
    while (last < tokens.length - 1 && canJoin(tokens[last], tokens[last + 1])) last += 1;

    const start = tokens[first].start;
    let end = tokens[last].end;
    const trailingPunctuation = source.slice(end).match(/^[,،:;؛.!?؟)\]}»'"”’]+/);
    if (trailingPunctuation) end += trailingPunctuation[0].length;
    const original = source.slice(start, end);
    const letterCount = tokens.slice(first, last + 1).reduce((total, token) => total + token.text.length, 0);
    if (letterCount < 3) return null;

    const direction = script === 'latin' ? 'fa' : 'en';
    const mapped = convert(original, direction);
    if (mapped === original) return null;
    const dictionary = direction === 'fa' ? persianWords : englishWords;
    const correction = correctKnownTypos(mapped, dictionary);
    const replacement = correction.text;
    wordPattern.lastIndex = 0;
    const mappedWords = [...replacement.matchAll(wordPattern)];
    const confidence = mappedWords.length ? correction.knownCount / mappedWords.length : 0;
    const suggestible = !smartMode ||
      (correction.knownCount > 0 && (mappedWords.length === 1 ? confidence === 1 : confidence >= 0.75));

    return {
      start,
      end,
      original,
      replacement,
      direction,
      wordCount: tokens.slice(first, last + 1).length,
      confidence,
      corrected: correction.changed,
      suggestible
    };
  }

  const api = Object.freeze({ convert, guessDirection, analyzeAt });
  globalThis.KeyFixKeyboard = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
