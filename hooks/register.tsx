import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import { AZKAR } from './azkar'

const SECONDS_PER_ZIKR = 10

// Which zikr is showing; also kept in $.store so the next wait, even in a new session, picks up after it.
const index = atom({ plugin: 'while-you-wait', key: 'index' } as const, 0)

async function advance($: EngineInterface) {
  const next = (await read($, index)) + 1
  await update($, index, () => next)
  await $.store.set('index', next)
}

export const register: Register = on => {
  let timer: Timer | undefined

  on('session.start', async ($, e, next) => {
    const saved = Number((await $.store.get('index')) ?? 0)
    await update($, index, () => saved)

    return next(e)
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
    if (!e.props.isWorking || e.props.hasSurvey) {
      return next(e)
    }

    const i = await read($, index)
    const zikr = AZKAR[((i % AZKAR.length) + AZKAR.length) % AZKAR.length]!
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        <Text color="success" weight="bold">
          📿 {zikr.ar}
        </Text>
        <Text dimColor>{zikr.en}</Text>
      </Box>
    )
  })
}
