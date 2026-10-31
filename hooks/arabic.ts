// Most terminals neither join Arabic letters nor lay text out right to left. For those, Arabic is
// drawn pre-shaped (each letter swapped for its joined presentation form) and in visual order
// (each line reversed), which every terminal then prints as written.

const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۤۧۨ-ۭ]/
const TATWEEL = 'ـ'

// Letters that join on both sides: isolated, final, initial and medial forms are base, +1, +2, +3.
const DUAL: Record<string, number> = {
  'ئ': 0xfe89, 'ب': 0xfe8f, 'ت': 0xfe95, 'ث': 0xfe99, 'ج': 0xfe9d, 'ح': 0xfea1, 'خ': 0xfea5,
  'س': 0xfeb1, 'ش': 0xfeb5, 'ص': 0xfeb9, 'ض': 0xfebd, 'ط': 0xfec1, 'ظ': 0xfec5, 'ع': 0xfec9,
  'غ': 0xfecd, 'ف': 0xfed1, 'ق': 0xfed5, 'ك': 0xfed9, 'ل': 0xfedd, 'م': 0xfee1, 'ن': 0xfee5,
  'ه': 0xfee9, 'ي': 0xfef1,
}

// Letters that join only to the letter before them: isolated and final forms are base and +1.
const RIGHT: Record<string, number> = {
  'آ': 0xfe81, 'أ': 0xfe83, 'ؤ': 0xfe85, 'إ': 0xfe87, 'ا': 0xfe8d, 'ة': 0xfe93, 'د': 0xfea9,
  'ذ': 0xfeab, 'ر': 0xfead, 'ز': 0xfeaf, 'و': 0xfeed, 'ى': 0xfeef, 'ٱ': 0xfb50,
}

// Letters that never join.
const ISOLATED: Record<string, number> = { 'ء': 0xfe80 }

// Lam followed by an alef is one ligature, which joins only to the letter before it.
const LAM_ALEF: Record<string, number> = { 'آ': 0xfef5, 'أ': 0xfef7, 'إ': 0xfef9, 'ا': 0xfefb }

const MIRRORED: Record<string, string> = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '«': '»', '»': '«' }

type Unit = { base: string; marks: string; ligature?: number }

const joinsBefore = (u: Unit) => u.ligature !== undefined || u.base in DUAL || u.base in RIGHT || u.base === TATWEEL
const joinsAfter = (u: Unit) => u.ligature === undefined && (u.base in DUAL || u.base === TATWEEL)

/** Removes harakat and other marks, which terminals draw taller than a row so they spill into the row above. */
export function stripHarakat(text: string): string {
  return Array.from(text)
    .filter(c => !MARKS.test(c))
    .join('')
}

/** Swaps each Arabic letter for the presentation form its neighbours call for, keeping logical order. */
export function shape(text: string): string {
  const units: Unit[] = []
  for (const c of text) {
    const last = units[units.length - 1]
    if (MARKS.test(c) && last) {
      last.marks += c
    } else if (last && last.base === 'ل' && last.ligature === undefined && c in LAM_ALEF) {
      last.ligature = LAM_ALEF[c]
    } else {
      units.push({ base: c, marks: '' })
    }
  }

  return units
    .map((u, i) => {
      const before = units[i - 1]
      const after = units[i + 1]
      const joinsPrev = before !== undefined && joinsAfter(before) && joinsBefore(u)
      const joinsNext = after !== undefined && joinsAfter(u) && joinsBefore(after)
      let glyph = u.base
      if (u.ligature !== undefined) {
        glyph = String.fromCharCode(u.ligature + (joinsPrev ? 1 : 0))
      } else if (u.base in DUAL) {
        glyph = String.fromCharCode(DUAL[u.base]! + (joinsPrev ? (joinsNext ? 3 : 1) : joinsNext ? 2 : 0))
      } else if (u.base in RIGHT) {
        glyph = String.fromCharCode(RIGHT[u.base]! + (joinsPrev ? 1 : 0))
      } else if (u.base in ISOLATED) {
        glyph = String.fromCharCode(ISOLATED[u.base]!)
      }
      return glyph + u.marks
    })
    .join('')
}

/** Reverses a right-to-left line for display, keeping marks after their letter and Latin or digit runs in order. */
export function toVisual(line: string): string {
  const tokens = line.match(/[A-Za-z0-9][A-Za-z0-9.,:'%-]*[A-Za-z0-9%]|[A-Za-z0-9]|.[ؐ-ًؚ-ٰٟۖ-ۭ]*/gu) ?? []

  return tokens
    .reverse()
    .map(t => MIRRORED[t] ?? t)
    .join('')
}

const width = (s: string) => Array.from(s).filter(c => !MARKS.test(c)).length

/** Breaks shaped text into lines of at most `columns` cells, in logical order. */
export function wrap(text: string, columns: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line && width(line) + 1 + width(word) > columns) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)

  return lines
}

/**
 * The lines to draw for an Arabic text in a terminal that does no shaping or bidi: shaped,
 * wrapped to `columns`, each reversed, and padded on the left so the block reads from the right.
 */
export function forTerminal(text: string, columns: number): string[] {
  const lines = wrap(shape(text), Math.max(columns, 10)).map(toVisual)
  const widest = Math.max(...lines.map(width))

  return lines.map(l => ' '.repeat(widest - width(l)) + l)
}
