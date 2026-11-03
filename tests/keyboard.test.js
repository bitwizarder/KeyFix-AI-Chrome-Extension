const assert = require('node:assert/strict');
const test = require('node:test');
const keyboard = require('../keyboard.js');

test('converts an English-layout Persian phrase without trimming its whitespace', () => {
  assert.equal(keyboard.convert('  sghl o,fd?  ', 'fa'), '  سلام خوبی؟  ');
});

test('converts Persian-layout input back to an English phrase', () => {
  assert.equal(keyboard.convert('فاهس هس ش', 'en'), 'this is a');
});

test('suggests the complete Persian phrase around the caret', () => {
  const phrase = 'sghl o,fd?';
  const result = keyboard.analyzeAt(phrase, phrase.length, true);

  assert.equal(result.original, phrase);
  assert.equal(result.replacement, 'سلام خوبی؟');
  assert.equal(result.direction, 'fa');
  assert.equal(result.suggestible, true);
});

test('corrects a one-character typo in the converted Persian phrase', () => {
  const phrase = 'sghl ]ix,vd';
  const result = keyboard.analyzeAt(phrase, phrase.length, true);

  assert.equal(result.replacement, 'سلام چطوری');
  assert.equal(result.suggestible, true);
});

test('recognizes the existing multiword Persian example with punctuation', () => {
  const phrase = 'uhgd T trx lk t,kj';
  const result = keyboard.analyzeAt(phrase, phrase.length, true);

  assert.equal(result.replacement, 'عالی، فقط من فونت');
  assert.equal(result.suggestible, true);
});

test('suggests the complete English phrase when Persian layout was active', () => {
  const phrase = 'فاهس هس ش';
  const result = keyboard.analyzeAt(phrase, phrase.length, true);

  assert.equal(result.original, phrase);
  assert.equal(result.replacement, 'this is a');
  assert.equal(result.direction, 'en');
  assert.equal(result.suggestible, true);
});

test('corrects a repeated character after converting Persian-layout English', () => {
  const phrase = 'اثمممخ';
  const result = keyboard.analyzeAt(phrase, phrase.length, true);

  assert.equal(result.replacement, 'hello');
  assert.equal(result.suggestible, true);
});

test('keeps unrelated text and sentence boundaries outside the suggestion', () => {
  const text = 'sghl. o,fd?';
  const result = keyboard.analyzeAt(text, text.length, true);

  assert.equal(result.original, 'o,fd?');
  assert.equal(result.replacement, 'خوبی؟');
});

test('smart mode rejects unknown words while relaxed mode allows them', () => {
  const text = 'qzxvbnm';

  assert.equal(keyboard.analyzeAt(text, text.length, true).suggestible, false);
  assert.equal(keyboard.analyzeAt(text, text.length, false).suggestible, true);
});

test('the shortcut direction follows the dominant input script', () => {
  assert.equal(keyboard.guessDirection('sghl o,fd'), 'fa');
  assert.equal(keyboard.guessDirection('سلام خوبی'), 'en');
});
