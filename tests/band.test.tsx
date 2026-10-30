import { expect, test } from 'claude-code/testing'

import { AZKAR } from '../hooks/azkar'

const band = (isWorking: boolean) =>
  ({
    plugin: 'while-you-wait',
    component: 'AbovePrompt',
    requestId: 'band',
    props: { hasSurvey: false, isWorking, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
  }) as const

test('a zikr shows only while Claude is working, on every surface', async ($, on) => {
  // Nothing sits beneath the plugin: each hook here stands for the engine.
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const working = await $.ui.mount({ ...band(true), surface })
    expect((await working.find({ type: 'Text', text: /📿/ }))?.text).toContain(AZKAR[0]!.ar)
    await working.unmount()

    const idle = await $.ui.mount({ ...band(false), surface })
    expect(await idle.find({ type: 'Text', text: /📿/ })).toBeUndefined()
    await idle.unmount()
  }
})

test('each wait starts on the zikr after the last one shown', async ($, on) => {
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))

  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.turn.start({ text: 'hi', turnId: 't1' })
  await $.turn.complete({ turnId: 't1', reason: 'answer', answer: '', durationMs: 1, isAborted: false } as never)

  const ui = await $.ui.mount({ ...band(true), surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /📿/ }))?.text).toContain(AZKAR[1]!.ar)
  await ui.unmount()
})
