export type Zikr = { ar: string; en: string; tr: string }

/** How a terminal gets the Arabic: as written, joined and reordered by the mod, or in Latin letters. */
export type Display = 'as-written' | 'reorder' | 'latin'

declare module 'claude-code' {
  interface PluginState {
    'while-you-wait': { index: number; displays: Record<string, Display>; asking: boolean }
  }
}
