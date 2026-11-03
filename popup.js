const $ = id => document.getElementById(id);
const source = $('source'), result = $('result'), notice = $('notice');
const keyboard = globalThis.KeyFixKeyboard;

function run(direction = null) {
  const value = source.value;
  if (!value.trim()) { notice.textContent = 'اول متن رو وارد کن.'; result.value = ''; return; }
  const dir = direction || keyboard.guessDirection(value);
  result.value = keyboard.convert(value, dir);
  notice.textContent = dir === 'fa' ? 'متن به چیدمان فارسی تبدیل شد.' : 'متن به چیدمان انگلیسی تبدیل شد.';
}
$('convert').addEventListener('click', () => run());
$('swap').addEventListener('click', () => {
  if (!source.value.trim()) { notice.textContent = 'اول متن رو وارد کن.'; return; }
  const inferred = keyboard.guessDirection(source.value);
  run(inferred === 'fa' ? 'en' : 'fa');
});
$('copy').addEventListener('click', async () => {
  if (!result.value) { notice.textContent = 'چیزی برای کپی کردن نیست.'; return; }
  try { await navigator.clipboard.writeText(result.value); notice.textContent = 'نتیجه کپی شد ✓'; }
  catch { result.focus(); result.select(); notice.textContent = 'متن انتخاب شد؛ Ctrl+C رو بزن.'; }
});
chrome.storage.sync.get({ suggestions: true, smartMode: true }, data => {
  $('suggestions').checked = data.suggestions;
  $('smartMode').checked = data.smartMode;
});
$('suggestions').addEventListener('change', e => {
  chrome.storage.sync.set({ suggestions: e.target.checked });
  notice.textContent = e.target.checked ? 'پیشنهادهای هنگام تایپ فعال شد.' : 'پیشنهادهای هنگام تایپ غیرفعال شد.';
});
$('smartMode').addEventListener('change', e => {
  chrome.storage.sync.set({ smartMode: e.target.checked });
  notice.textContent = e.target.checked ? 'حالت تشخیص دقیق‌تر فعال شد.' : 'پیشنهادهای بیشتری برای هر دو زبان نمایش داده می‌شود.';
});
