import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { Display } from '../types'
import { forTerminal, stripHarakat } from './arabic'
import { AZKAR } from './azkar'

const SECONDS_PER_ZIKR = 10
const SAMPLE = 'سبحان الله وبحمده'

// Terminals checked by eye to lay out Arabic themselves. Any other terminal asks once which display reads right.
const KNOWN: Record<string, Display> = { Apple_Terminal: 'as-written', Orca: 'as-written' }

// Which zikr is showing; also kept in $.store so the next wait, even in a new session, picks up after it.
const index = atom({ plugin: 'while-you-wait', key: 'index' } as const, 0)
// The display each terminal's person picked, by terminal name; also kept in $.store.
const displays = atom({ plugin: 'while-you-wait', key: 'displays' } as const, {})
// True after the check command, so the band asks again even while Claude is idle.
const asking = atom({ plugin: 'while-you-wait', key: 'asking' } as const, false)

async function advance($: EngineInterface) {
  const next = (await read($, index)) + 1
  await update($, index, () => next)
  await $.store.set('index', next)
}

async function terminalName($: EngineInterface) {
  return (
    (await $.env.get('TERM_PROGRAM')) ||
    ((await $.env.get('WT_SESSION')) && 'Windows Terminal') ||
    ((await $.env.get('KONSOLE_VERSION')) && 'Konsole') ||
    ((await $.env.get('VTE_VERSION')) && 'VTE') ||
    ((await $.env.get('KITTY_WINDOW_ID')) && 'kitty') ||
    ((await $.env.get('ALACRITTY_WINDOW_ID')) && 'Alacritty') ||
    'unknown'
  )
}

async function choose($: EngineInterface, display: Display) {
  const name = await terminalName($)
  const chosen = { ...(await read($, displays)), [name]: display }
  await update($, displays, () => chosen)
  await update($, asking, () => false)
  await $.store.set('displays', chosen)
}

export const register: Register = (on, options) => {
  let timer: Timer | undefined

  on('session.start', async ($, e, next) => {
    const saved = Number((await $.store.get('index')) ?? 0)
    await update($, index, () => saved)
    const chosen = ((await $.store.get('displays')) ?? {}) as Record<string, Display>
    await update($, displays, () => chosen)
    await $.command.register({
      name: 'azkar-arabic',
      description: 'Choose again how While You Wait shows Arabic in this terminal',
    })

    return next(e)
  })

  on('command.run', { command: 'azkar-arabic' }, async $ => {
    const name = await terminalName($)
    const { [name]: _, ...rest } = await read($, displays)
    await update($, displays, () => rest)
    await $.store.set('displays', rest)
    await update($, asking, () => true)

    return { text: `While You Wait will ask above the prompt which Arabic display reads correctly in ${name}.` }
  })

  on('turn.start', async ($, e, next) => {
    // Subagents' turns start and end inside the main turn; only the main turn counts as waiting.
    if (e.agentId === undefined && timer === undefined) {
      await advance($)
      timer = $.clock.every(SECONDS_PER_ZIKR * 1000, () => void advance($))
    }

    return next(e)
  })

  on('turn.complete', ($, e, next) => {
    if (e.agentId === undefined) {
      timer?.cancel()
      timer = undefined
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const isAsking = await read($, asking)
    if ((!e.props.isWorking && !isAsking) || e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const columns = e.props.bodyColumns - 3
    // The desktop app, VS Code's panel and mobile always lay out Arabic correctly.
    const name = e.surface === 'terminal' ? await terminalName($) : undefined
    const display = name === undefined ? 'as-written' : (await read($, displays))[name] ?? KNOWN[name]

    if (display === undefined || isAsking) {
      return (
        <Box flexDirection="column">
          <Text weight="bold">📿 While You Wait: which line reads correctly in this terminal?</Text>
          <Text>1 {SAMPLE}</Text>
          <Text>2 {forTerminal(SAMPLE, columns)[0]}</Text>
          <Box>
            <Button key="as-written" hotkey="1" label="1 reads correctly" onPress={() => choose($, 'as-written')} />
            <Button key="reorder" hotkey="2" label="2 reads correctly" onPress={() => choose($, 'reorder')} />
            <Button key="latin" hotkey="3" label="Neither" onPress={() => choose($, 'latin')} />
          </Box>
          <Text dimColor>Click one, or press ctrl+x tab then 1, 2 or 3. /azkar-arabic asks again later.</Text>
        </Box>
      )
    }

    const i = await read($, index)
    const zikr = AZKAR[((i % AZKAR.length) + AZKAR.length) % AZKAR.length]!
    const text = name !== undefined && options.terminal_harakat !== 'show' ? stripHarakat(zikr.ar) : zikr.ar
    const lines =
      display === 'latin'
        ? [`📿 ${zikr.tr}`]
        : display === 'reorder'
          ? // Reordered lines read from the right, so the bead goes at the right end of the first line.
            forTerminal(text, columns).map((line, n) => line + (n === 0 ? ' 📿' : '   '))
          : [`📿 ${text}`]

    return (
      <Box flexDirection="column">
        {lines.map(line => (
          <Text color="success" weight="bold">
            {line}
          </Text>
        ))}
        <Text dimColor>{zikr.en}</Text>
      </Box>
    )
  })
}
