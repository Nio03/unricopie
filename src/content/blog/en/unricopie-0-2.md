---
title: "Unricopie 0.2: Linux, a command line, and your copies from a folder"
date: 2026-11-21
summary: "Unricopie 0.2 comes to Linux, works from the command line (Steam shortcuts included), finds your copies in a folder, installs any published version, and checks more things before installing and before starting a game."
kind: log
---

## What's in 0.2

- **Linux:** an AppImage and a tar.gz for x86-64 with glibc 2.35 or newer. Games shipped as AppImages start even without FUSE, and if a game is missing a system library, Unricopie says which one and how to install it on your distribution.
- **Command line:** `unricopie list`, `install`, `update`, `versions`, `copies`, `launch`, `path`, `add` and `remove-added`. `launch` waits until the game closes, so you can add a game to Steam as a non-Steam game, or to Playnite or ES-DE.
- **Your copies:** in Settings, "Search a folder…" looks for your ROMs and ISOs and keeps the ones that match what each project asks for. Only the exact hash counts, never the file name, and you choose which ones to keep.
- **Does it need your copy?** The "What you need" tab says whether the game reads your copy every time you open it or only the first time, to build its own files, and how much disk space it takes.
- **Any version:** the Versions tab lists each project's published releases, and you can install an older one or switch to it. The one you had is kept with your saves.
- **Checks:** free disk space before downloading; your own Microsoft Defender scanning the download before it's unpacked; the Visual C++ runtime and Vulkan before starting a game.
- **Adding a GitHub project:** in Settings, "Add a GitHub project" installs a repository that isn't in the catalog yet, with the same checks as always. It's marked "Not reviewed", since Unricopie doesn't know whether it works or what it needs.
- **More games:** 20 new recipes, including Shadow the Hedgehog, Conker's Bad Fur Day Reloaded, Luigi's Mansion, Wind Waker HD, Monster Hunter Portable 3rd, Donkey Kong Country, Killzone Shadow Fall and Driveclub. Unricopie installs 96 projects on Windows and 68 on Linux, and the new recipes reach 0.1 too.
- **macOS, on the way:** Unricopie can already open Mac apps; it needs testing on real Macs before its version comes out.

## Download

Get Unricopie from [its page](/en/unricopie/). It's free, open source (GPL-3.0), and needs no account. If you have 0.1, it tells you there's a new version.
