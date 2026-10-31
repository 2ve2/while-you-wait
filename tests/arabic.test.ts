import { expect, test } from 'claude-code/testing'

import { forTerminal, shape, stripHarakat, toVisual, wrap } from '../hooks/arabic'

const u = (...codes: number[]) => String.fromCharCode(...codes)

test('letters take their initial, medial and final forms', () => {
  expect(shape('بسم')).toBe(u(0xfe91, 0xfeb4, 0xfee2))
  expect(shape('الله')).toBe(u(0xfe8d, 0xfedf, 0xfee0, 0xfeea))
  expect(shape('شيء')).toBe(u(0xfeb7, 0xfef2, 0xfe80))
})

test('lam and alef become one ligature, harakat included', () => {
  expect(shape('لا')).toBe(u(0xfefb))
  expect(shape('لَا')).toBe(u(0xfefb) + 'َ')
  expect(shape('سلام')).toBe(u(0xfeb3, 0xfefc, 0xfee1))
})

test('a line is reversed with each haraka kept after its letter', () => {
  expect(toVisual(shape('بسم'))).toBe(u(0xfee2, 0xfeb4, 0xfe91))
  expect(toVisual('بَ م')).toBe('م بَ')
  expect(toVisual('سورة 112 (الإخلاص)')).toBe('(صالخإلا) 112 ةروس')
})

test('long text wraps by words and every line is the same width', () => {
  expect(wrap('aa bb cc', 5)).toEqual(['aa bb', 'cc'])
  const lines = forTerminal('لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ', 12)
  expect(lines.length).toBeGreaterThan(1)
  const cells = lines.map(l => Array.from(l).filter(c => !/[ً-ٰٟ]/.test(c)).length)
  expect(new Set(cells).size).toBe(1)
})

test('harakat are removed and the letters kept', () => {
  expect(stripHarakat('لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ')).toBe('لا حول ولا قوة إلا بالله')
})
