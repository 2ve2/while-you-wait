import { expect, mock, test } from 'claude-code/testing'

import { stripHarakat } from '../hooks/arabic'
import { AZKAR } from '../hooks/azkar'

const band = (isWorking: boolean) =>
  ({
    plugin: 'while-you-wait',
    component: 'AbovePrompt',
    requestId: 'band',
    props: { hasSurvey: false, isWorking, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
  }) as const

const zikrText = async (ui: { find: (q: { type: 'Text'; text: RegExp }) => Promise<{ text?: string } | undefined> }) =>
  (await ui.find({ type: 'Text', text: /📿/ }))?.text

test('a zikr shows only while Claude is working, on every surface', async ($, on) => {
  mock.env(on, { TERM_PROGRAM: 'Apple_Terminal' })
  // Nothing sits beneath the plugin: each hook here stands for the engine.
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const working = await $.ui.mount({ ...band(true), surface })
    // Terminal.app lays out Arabic itself; the terminal drops harakat by default, other surfaces keep them.
    expect(await zikrText(working)).toContain(surface === 'terminal' ? stripHarakat(AZKAR[0]!.ar) : AZKAR[0]!.ar)
    await working.unmount()

    const idle = await $.ui.mount({ ...band(false), surface })
    expect(await idle.find({ type: 'Text', text: /📿/ })).toBeUndefined()
    await idle.unmount()
  }
})

test('each wait starts on the zikr after the last one shown', async ($, on) => {
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: { command: 'azkar-arabic' } }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.turn.start({ text: 'hi', turnId: 't1' })
  await $.turn.complete({ turnId: 't1', reason: 'answer', answer: '', durationMs: 1, isAborted: false } as never)

  const ui = await $.ui.mount({ ...band(true), surface: 'desktop' })
  expect(await zikrText(ui)).toContain(AZKAR[1]!.ar)
  await ui.unmount()
})

test('an unknown terminal asks once, and choosing 2 shows the zikr reordered from then on', async ($, on) => {
  mock.env(on, { TERM_PROGRAM: 'SomeNewTerminal' })
  mock.store(on)

  const ui = await $.ui.mount({ ...band(true), surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /which line reads correctly/ })).toBeDefined()
  await ui.press({ key: 'reorder' })
  await ui.unmount()

  const after = await $.ui.mount({ ...band(true), surface: 'terminal' })
  const zikr = await zikrText(after)
  // Presentation forms only, none of the logical letters.
  expect(zikr).toMatch(/[ﹰ-﻿]/)
  expect(zikr).not.toMatch(/[ء-ي]/)
  expect(await after.find({ type: 'Text', text: /which line reads correctly/ })).toBeUndefined()
  await after.unmount()
})

test('choosing Neither shows the zikr in Latin letters', async ($, on) => {
  mock.env(on, { TERM_PROGRAM: 'SomeNewTerminal' })
  mock.store(on)

  const ui = await $.ui.mount({ ...band(true), surface: 'terminal' })
  await ui.press({ key: 'latin' })
  expect(await zikrText(ui)).toContain(AZKAR[0]!.tr)
  await ui.unmount()
})

test('the command asks again, even while Claude is idle', async ($, on) => {
  mock.env(on, { TERM_PROGRAM: 'Apple_Terminal' })
  mock.store(on)
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  const before = await $.ui.mount({ ...band(false), surface: 'terminal' })
  expect(await before.find({ type: 'Text', text: /which line reads correctly/ })).toBeUndefined()
  await before.unmount()

  const ran = await $.command.run({ command: 'azkar-arabic' })
  expect(ran.text).toContain('Apple_Terminal')

  const after = await $.ui.mount({ ...band(false), surface: 'terminal' })
  expect(await after.find({ type: 'Text', text: /which line reads correctly/ })).toBeDefined()
  await after.press({ key: 'as-written' })
  expect(await after.find({ type: 'Text', text: /which line reads correctly/ })).toBeUndefined()
  await after.unmount()
})

test('harakat stay in the terminal when the setting asks for them', { options: { terminal_harakat: 'show' } }, async ($, on) => {
  mock.env(on, { TERM_PROGRAM: 'Apple_Terminal' })

  const ui = await $.ui.mount({ ...band(true), surface: 'terminal' })
  expect(await zikrText(ui)).toContain(AZKAR[0]!.ar)
  await ui.unmount()
})

test('with Show azkar set to always, the zikr shows while Claude is idle too', { options: { show_azkar: 'always' } }, async ($, on) => {
  mock.env(on, { TERM_PROGRAM: 'Apple_Terminal' })

  const ui = await $.ui.mount({ ...band(false), surface: 'terminal' })
  expect(await zikrText(ui)).toContain(stripHarakat(AZKAR[0]!.ar))
  await ui.unmount()
})

test('with Show azkar set to always, the zikr changes while Claude is idle', { options: { show_azkar: 'always' } }, async ($, on) => {
  mock.env(on, { TERM_PROGRAM: 'Apple_Terminal' })
  const clock = mock.clock(on)
  mock.store(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: { command: 'azkar-arabic' } }))
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  await clock.advance(10_000)

  const ui = await $.ui.mount({ ...band(false), surface: 'terminal' })
  expect(await zikrText(ui)).toContain(stripHarakat(AZKAR[1]!.ar))
  await ui.unmount()
})

test('Seconds per zikr sets how long each zikr stays while Claude works', { options: { seconds_per_zikr: '30' } }, async ($, on) => {
  const clock = mock.clock(on)
  mock.store(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: { command: 'azkar-arabic' } }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.turn.start({ text: 'hi', turnId: 't1' })

  // The default 10 seconds pass and the zikr the wait started on is still showing.
  await clock.advance(10_000)
  const early = await $.ui.mount({ ...band(true), surface: 'desktop' })
  expect(await zikrText(early)).toContain(AZKAR[1]!.ar)
  await early.unmount()

  await clock.advance(20_000)
  const later = await $.ui.mount({ ...band(true), surface: 'desktop' })
  expect(await zikrText(later)).toContain(AZKAR[2]!.ar)
  await later.unmount()
})
