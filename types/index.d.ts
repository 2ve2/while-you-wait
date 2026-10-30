export type Zikr = { ar: string; en: string }

declare module 'claude-code' {
  interface PluginState {
    'while-you-wait': { index: number }
  }
}
