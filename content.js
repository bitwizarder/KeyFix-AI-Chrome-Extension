(() => {
  if (window.__keyfixAIInstalled) return;
  window.__keyfixAIInstalled = true;

  const keyboard = globalThis.KeyFixKeyboard;
  if (!keyboard) throw new Error('KeyFix keyboard mapping did not load.');
  const locale = globalThis.KeyFixLocale;
  if (!locale) throw new Error('KeyFix language translations did not load.');

  let enabled = true;
  let smartMode = true;
  let language = locale.getDefaultLanguage();
  let timer = null;
  let bubble = null;
  let dismissedSignature = '';

  chrome.storage.sync.get({ suggestions: true, smartMode: true, language: null }, data => {
    enabled = data.suggestions;
    smartMode = data.smartMode;
    language = locale.resolveLanguage(data.language);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.suggestions) {
      enabled = changes.suggestions.newValue;
      if (!enabled) hide();
    }
    if (changes.smartMode) smartMode = changes.smartMode.newValue;
    if (changes.language) {
      language = locale.resolveLanguage(changes.language.newValue);
      hide();
    }
  });

  const controlSelector = 'textarea,input:not([type]),input[type=text],input[type=search],input[type=email],input[type=url],input[type=tel]';
  function getEditable(target) {
    if (!target || target.nodeType !== 1) return null;
    if (target.matches(controlSelector) && !target.matches('input[type=password],input[type=number],input[readonly],input[disabled],textarea[readonly],textarea[disabled]')) return target;
    const root = target.closest('[contenteditable="true"],[contenteditable="plaintext-only"],[role="textbox"]');
    if (root && !root.matches('[aria-disabled="true"],[aria-readonly="true"]')) return root;
    return null;
  }
  function isControl(el) { return el.matches(controlSelector); }
  function getTextModel(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let text = '';
    let node;
    while ((node = walker.nextNode())) {
      const value = node.textContent || '';
      if (!value) continue;
      nodes.push({ node, start: text.length, end: text.length + value.length });
      text += value;
    }
    return {
      text,
      offsetOf(container, offset) {
        if (container.nodeType === Node.TEXT_NODE) {
          const item = nodes.find(entry => entry.node === container);
          return item ? item.start + offset : null;
        }
        const range = document.createRange();
        range.selectNodeContents(root);
        range.setEnd(container, offset);
        return range.toString().length;
      },
      pointAt(offset, bias) {
        for (let index = 0; index < nodes.length; index += 1) {
          const item = nodes[index];
          if (offset > item.start && offset < item.end) {
            return { node: item.node, offset: offset - item.start };
          }
          if (offset === item.start && bias === 'right') {
            return { node: item.node, offset: 0 };
          }
          if (offset === item.end && bias === 'left') {
            return { node: item.node, offset: item.end - item.start };
          }
        }
        return null;
      }
    };
  }
  function getCandidate(el) {
    if (isControl(el)) {
      const value = el.value || '';
      const caret = typeof el.selectionStart === 'number' ? el.selectionStart : value.length;
      if (typeof el.selectionEnd === 'number' && el.selectionEnd !== caret) return null;
      const analysis = keyboard.analyzeAt(value, caret, smartMode);
      if (!analysis) return null;
      return { el, kind: 'control', ...analysis, sourceText: value };
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return null;
    const caretRange = selection.getRangeAt(0);
    if (!el.contains(caretRange.startContainer)) return null;
    const model = getTextModel(el);
    const caret = model.offsetOf(caretRange.startContainer, caretRange.startOffset);
    if (caret === null) return null;
    const analysis = keyboard.analyzeAt(model.text, caret, smartMode);
    if (!analysis) return null;
    const start = model.pointAt(analysis.start, 'right');
    const end = model.pointAt(analysis.end, 'left');
    if (!start || !end) return null;
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    return { el, kind: 'editable', range, ...analysis, sourceText: model.text };
  }
  function shouldSuggest(candidate) {
    return candidate.suggestible;
  }
  function hide() {
    if (bubble) bubble.remove();
    bubble = null;
  }
  function applyCandidate(candidate) {
    const el = candidate.el;
    if (!el.isConnected) { hide(); return; }
    if (candidate.kind === 'control') {
      const current = el.value || '';
      if (current.slice(candidate.start, candidate.end) !== candidate.original) { hide(); return; }
      el.focus({ preventScroll: true });
      el.setRangeText(candidate.replacement, candidate.start, candidate.end, 'preserve');
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertReplacementText', data: candidate.replacement }));
      hide();
      return;
    }
    const range = candidate.range;
    if (!range || range.toString() !== candidate.original) { hide(); return; }
    el.focus({ preventScroll: true });
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    range.deleteContents();
    const textNode = document.createTextNode(candidate.replacement);
    range.insertNode(textNode);
    const caret = document.createRange();
    caret.setStartAfter(textNode); caret.collapse(true);
    selection.removeAllRanges(); selection.addRange(caret);
    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertReplacementText', data: candidate.replacement }));
    hide();
  }
  function createBubble(candidate, signature) {
    hide();
    bubble = document.createElement('div');
    bubble.id = 'keyfix-suggestion';
    bubble.setAttribute('role', 'status');
    const icon = document.createElement('span'); icon.className = 'kf-icon'; icon.textContent = '✦';
    const copy = document.createElement('span'); copy.className = 'kf-copy';
    const strings = locale.messages[language];
    bubble.lang = language;
    bubble.dir = language === 'fa' ? 'rtl' : 'ltr';
    const title = document.createElement('span'); title.className = 'kf-title'; title.textContent = strings.suggestionTitle;
    const preview = document.createElement('span'); preview.className = 'kf-preview'; preview.textContent = candidate.replacement;
    copy.append(title, preview);
    const apply = document.createElement('button'); apply.className = 'kf-apply'; apply.type = 'button';
    apply.textContent = candidate.wordCount > 1 ? strings.fixPhrase : strings.fix;
    const dismiss = document.createElement('button'); dismiss.className = 'kf-dismiss'; dismiss.type = 'button'; dismiss.setAttribute('aria-label', strings.dismiss); dismiss.textContent = '×';
    apply.addEventListener('mousedown', e => e.preventDefault());
    dismiss.addEventListener('mousedown', e => e.preventDefault());
    apply.addEventListener('click', () => applyCandidate(candidate));
    dismiss.addEventListener('click', () => { dismissedSignature = signature; hide(); });
    bubble.append(icon, copy, apply, dismiss);
    document.documentElement.appendChild(bubble);
    const r = candidate.el.getBoundingClientRect();
    const width = bubble.offsetWidth, height = bubble.offsetHeight;
    const left = Math.max(10, Math.min(window.innerWidth - width - 10, r.left));
    let top = r.bottom + 7;
    if (top + height > window.innerHeight - 8) top = r.top - height - 7;
    top = Math.max(8, Math.min(window.innerHeight - height - 8, top));
    bubble.style.left = left + 'px';
    bubble.style.top = top + 'px';
  }
  document.addEventListener('input', event => {
    const el = getEditable(event.target);
    clearTimeout(timer);
    hide(); // Never leave a stale suggestion after the user changes the text.
    if (!enabled || !el) return;
    timer = setTimeout(() => {
      if (!enabled || !el.isConnected) return;
      const candidate = getCandidate(el);
      if (!candidate || !shouldSuggest(candidate)) { hide(); return; }
      const signature = `${candidate.direction}|${candidate.original}|${candidate.sourceText.slice(-48)}`;
      if (signature === dismissedSignature) return;
      createBubble(candidate, signature);
    }, 500);
  }, true);
  document.addEventListener('pointerdown', event => {
    if (bubble && !bubble.contains(event.target)) hide();
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hide();
  }, true);
  document.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);

  function convertSelectionOrWord() {
    const el = getEditable(document.activeElement);
    if (el && isControl(el)) {
      const value = el.value || '';
      let start = el.selectionStart ?? 0, end = el.selectionEnd ?? 0;
      if (start === end) {
        const candidate = getCandidate(el);
        if (!candidate) return;
        start = candidate.start; end = candidate.end;
      }
      const selected = value.slice(start, end);
      if (!selected) return;
      const converted = keyboard.convert(selected, keyboard.guessDirection(selected));
      el.focus({ preventScroll: true });
      el.setRangeText(converted, start, end, 'end');
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertReplacementText', data: converted }));
      hide(); return;
    }
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.toString()) {
      const selected = selection.toString();
      document.execCommand('insertText', false, keyboard.convert(selected, keyboard.guessDirection(selected)));
      hide(); return;
    }
    const edit = getEditable(document.activeElement);
    if (edit) {
      const candidate = getCandidate(edit);
      if (candidate) {
        applyCandidate(candidate);
      }
    }
  }
  chrome.runtime.onMessage.addListener(message => {
    if (message?.type === 'KEYFIX_CONVERT_SELECTION') convertSelectionOrWord();
  });
})();
