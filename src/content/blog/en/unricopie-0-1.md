---
title: "Unricopie 0.1: the Recompendium launcher"
date: 2026-11-11
summary: "The first version of Unricopie, the catalogue's launcher, is out: it installs 39 projects on Windows from their official release, checks your copy of the game, updates without losing your saves, and handles mods for Zelda 64: Recompiled and Banjo: Recompiled. It's free, open source and, for now, for Windows."
kind: log
---

## What it is

[Unricopie](/en/unricopie/) is the Recompendium launcher. It installs catalogue projects from the release their author publishes, checks your copy of the game, and gets it ready to play. It never ships games or builds its own versions: every project still needs your own legal copy, and Unricopie compares it with the versions each project asks for before putting it where the game looks for it.

On Windows, version 0.1 installs 39 catalogue projects, covering 42 games: 5 recomps and 34 ports. The rest stay in Explore with a link to the project, and we'll add more every week.

## What 0.1 does

- **Installs from the source:** downloads each project from its GitHub release and checks the download against GitHub's checksum.
- **Checks your copy:** stores it once in your library and never modifies it.
- **Updates and rolls back:** tells you when a project publishes a new version and installs it without touching your saves or settings. The previous version is kept, and you can go back to it.
- **The whole catalogue:** Explore has every entry, with console filters.
- **Thunderstore mods** for Zelda 64: Recompiled and Banjo: Recompiled: installed with what they need, kept in profiles, and ordered by dragging them. When two bring the same files, you pick which one wins. Your own are added by dropping them on the window, and each profile keeps its mods' settings, including the ones you change inside the game.
- **Portable:** with a `portable.txt` next to the program, everything stays in that folder.
- **Reports:** after an hour of play, or a day after you first open a version, Unricopie asks how it went. The answer is a GitHub form, already filled in, that you send yourself, and the totals show on each game's page inside Unricopie. "Doesn't start" can be marked right away.

## Download

Unricopie is downloaded from [its page](/en/unricopie/). It needs 64-bit Windows 10 or 11 and no account. Since it isn't signed yet, the first time Windows may warn that it doesn't recognise the app: "More info" and "Run anyway". The Linux version comes later.

The code is free software, under the GPL-3.0, and it's on [GitHub](https://github.com/Nio03/unricopie-launcher). The recipes that say how to install each game are downloaded from recompendium.com, so they're fixed and extended without a new release. Unricopie has no telemetry: it only connects to recompendium.com, GitHub and Thunderstore.

## On the site

- **New design:** the site now shares Unricopie's design, with each game's cover under its console's stripe, and three themes, Night, Day and High contrast, picked with the button at the top.
- **Three tabs to browse the catalog:** [Catalog](/en/) opens with shelves by type and by console, each with "See all"; [Projects](/en/proyectos/) shows all 1,641 entries one by one, with the filter column (type, console, status, and whether Unricopie installs it) and sorting by stars, name or activity; and [Games](/en/juegos/) gathers the 307 games with more than one project, each with its own page.
- **Clearer filters:** consoles are listed from A to Z, all of them in view.
- **Install with Unricopie:** entries Unricopie knows how to install carry its button, and have their own shelf and filter.
