import { expect, test } from 'claude-code/testing'

import { shape, stripHarakat } from '../hooks/arabic'
import { AZKAR } from '../hooks/azkar'

// Arabic letters as typed, before shaping. The Arabic comma is left out: it has no joined forms.
const LOGICAL_LETTER = /[؀-؋؍-ۿ]/

test('every zikr has its Arabic, its meaning and its Latin letters', () => {
  for (const zikr of AZKAR) {
    expect(zikr.ar.trim()).not.toBe('')
    expect(zikr.en.trim()).not.toBe('')
    expect(zikr.tr.trim()).not.toBe('')
    // The Arabic line holds only Arabic, and the Latin line only Latin, so neither is pasted into the other.
    expect(zikr.ar).toMatch(/^[؀-ۿ ]+$/)
    expect(zikr.tr).toMatch(/^[A-Za-z' ,.-]+$/)
  }
})

test('no zikr is listed twice', () => {
  const texts = AZKAR.map(zikr => stripHarakat(zikr.ar))
  expect(new Set(texts).size).toBe(texts.length)
})

test('every letter of every zikr has joined forms for terminals that need them', () => {
  // A letter missing from the shaping tables in hooks/arabic.ts would stay unjoined in those terminals.
  for (const zikr of AZKAR) {
    const unshaped = Array.from(shape(stripHarakat(zikr.ar))).filter(c => LOGICAL_LETTER.test(c))
    expect({ zikr: zikr.tr, unshaped }).toEqual({ zikr: zikr.tr, unshaped: [] })
  }
})
