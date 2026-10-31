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

## Show azkar all the time

By default the band shows only while Claude is working. To keep it above the prompt all the time, changing every 10 seconds, run `/config` and set **Show azkar** to `always`. Collapse it any time with the `[-]` at its right edge.

## Change the adhkar

The list is in `hooks/azkar.ts`, one `{ ar, en, tr }` entry per zikr (Arabic, meaning, and Latin letters). Add, remove, or reorder entries, or translate the `en` lines into your own language. To change how long each zikr stays, edit `SECONDS_PER_ZIKR` in `hooks/register.tsx`.

## Arabic in your terminal

Terminals draw Arabic differently: some join the letters and write right to left on their own, others don't. So the first time While You Wait runs in a terminal it doesn't know, it shows a short phrase two ways and asks which one reads correctly:

- **1**: the Arabic as written, for terminals that handle Arabic themselves
- **2**: the Arabic joined and reordered by the mod, for terminals that show it left to right or unjoined
- **Neither**: the zikr in Latin letters (*Subhan Allahi wa bihamdihi*), for terminals that can't show Arabic at all

Click your choice, or press `ctrl+x` `tab` and then `1`, `2` or `3`. It's remembered for that terminal, on any computer and operating system. To choose again, for example after changing your terminal's font, run `/azkar-arabic`. macOS Terminal and Orca are already known, and the desktop app and VS Code's Claude panel always show Arabic correctly.

In terminals the adhkar are shown without harakat, because terminals draw stacked marks taller than a line and they spill into the line above. To keep them anyway, set **Harakat in the terminal** to `show` in `/config`.

## Coming later

Quran pages, a page of the book you are reading, and a tap-to-count tasbih.

## License

MIT
