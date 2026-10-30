# While You Wait

Turn the time you spend waiting on Claude Code into dhikr.

While Claude is working, a zikr appears above the prompt, in Arabic with its English meaning, and a new one shows every 10 seconds so you can repeat each one as it passes. When Claude finishes, it disappears. The next time you wait, it continues from where you left off, even in a new session.

```
📿 سُبْحَانَ اللهِ وَبِحَمْدِهِ
Glory be to Allah and praise be to Him
```

It changes nothing in your settings or your status line, and it works in the terminal, the desktop app, and VS Code.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install while-you-wait --marketplace nouraraar91/while-you-wait
```

Answer `y` to add the marketplace, then press Enter to install it for your user. It starts working right away.

From a shell instead:

```
claude plugin install while-you-wait --marketplace nouraraar91/while-you-wait
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `nouraraar91/while-you-wait`, then Add plugin.

## Change the adhkar

The list is in `hooks/azkar.ts`, one `{ ar, en }` entry per zikr. Add, remove, or reorder entries, or translate the `en` lines into your own language. To change how long each zikr stays, edit `SECONDS_PER_ZIKR` in `hooks/register.tsx`.

## Coming later

Quran pages, a page of the book you are reading, and a tap-to-count tasbih.

## License

MIT
