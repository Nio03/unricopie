---
title: "Switch 2 games reach PC: emulators, recomps, and native ports"
date: 2026-11-04
summary: "Two weeks after the Switch 2 was hacked, Mario Kart World, Pokémon Pokopia, and Donkey Kong Bananza already run on PC and Mac, through emulation and native ports. Switch 2 entries join the catalog unlinked, to be safe, and the Switch 1 adds Super Mario Odyssey, Metroid Prime 4, Tomodachi Life, Xenoblade Chronicles 2, and nxnative."
kind: log
---

## Opened up in days

The Nintendo Switch 2 was hacked in late October, about sixteen months after launch: according to [Wccftech](https://wccftech.com/mario-kart-world-full-speed-pc-switch-2-emulator-eglantine-jailbreak/), a little over a week before October 31. What followed was very fast. Eden, the Switch emulator, gained experimental Switch 2 support through the eden-nx2 work. Eglantine came out of it: its repository was created on October 29, and according to the same report it already runs Mario Kart World at full speed on a capable PC, with Splatoon Raiders playable at a variable frame rate ([VideoCardz](https://videocardz.com/newz/mario-kart-world-reaches-60-fps-on-pc-with-experimental-switch-2-emulator) also reported Mario Kart World at 60 fps). In the following days came Lichii (October 31), Eden-NX2 (October 31), and Orchid (November 1), versions for PS5 and Android, while oboromi, a proof-of-concept Switch 2 emulator around since June 2025, kept going.

Emulators aren’t part of the catalog, so we don’t link them here. What does belong are projects that turn your own copy into a native program, and the Switch 2 already has its first ones.

## The first native Switch 2 games

The fastest route came through the Mac. [nxnative](/en/tool/nxnative/), which since October 13 runs Switch games directly on Apple chips, logged Donkey Kong Bananza’s first steps on a Mac on October 31: the game loop, the menu, and its first gameplay scene. The Mario Kart World ports grew on that base. [kartnative](/en/port/mario-kart-world-kartnative/), created on November 1, plays whole Grand Prix cups, Time Trials, and Free Roam at a steady 60 fps. With [switch2mac](/en/port/mario-kart-world-switch2mac/), from November 3, it plays start to finish at about 58 fps on an M1 Max.

Pokémon Pokopia already has three projects. [Pokopia Recomp](/en/recomp/pokemon-pokopia/) is a static recompilation for Windows: on November 2 it published two test builds, the second with DLSS, DLAA, and FSR 3, and so far it has been tested through the first area. [Pokopia Native](/en/port/pokemon-pokopia-pokopia-native/) builds a Mac app and an iPhone app, with its 1.0.0 from November 3. [OunceNative](/en/port/pokemon-pokopia-ouncenative/) is another nxnative fork for Mac, still in development.

On Windows there is also [DKB Recomp](/en/recomp/donkey-kong-bananza/), a static recompilation of Donkey Kong Bananza that builds on TotK Recomp. Its repository was created on November 1, and its README warns it isn’t playable yet: it reaches the tutorial cave, where you can already walk and punch.

## Why these entries have no link

The scene is moving carefully. On October 29, r/decomps banned links to any repository related to the Switch 2: ports, decomps, recomps, or emulators. The same day, r/emulators reported that ProsperoEden, a Switch emulator for PS5, had disappeared from GitHub after adding Switch 2 support. And the author of Power Moon Recomp (more on it below) explained on November 2 that GitHub closed their account as soon as they uploaded it. So far we haven’t found any Nintendo DMCA notices among the ones GitHub has published since October 20.

Our usual rule doesn’t change: we host nothing and only list projects that ask for your own copy of the game. To be safe, while things settle, Switch 2 entries join the catalog **unlinked**: they name the repository as text, but without a button. Each one will get its link once we’ve checked that its repository has no game code or data. The Switch 2 also has its own filter in the catalog now.

## Meanwhile, on the Switch 1

**Super Mario Odyssey.** [Power Moon Recomp](/en/recomp/super-mario-odyssey-zzzarathustra-dev/) was the week’s most upvoted post on r/decomps: a static recompilation on top of [LAS Recomp](/en/recomp/links-awakening-switch/) that, according to its README, can be finished on Windows and Linux. Version 0.2.0, from November 3, brought 120 fps with interpolated frames, ultrawide, and an end to the color banding in skies and fog. It lives on [GitLab](https://gitlab.com/zzzarathustra-dev/power-moon-recomp) since its author lost their GitHub account. Odyssey also has three more recompilations: by [Coz-0](/en/recomp/super-mario-odyssey-coz-0/), [nmqx](/en/recomp/super-mario-odyssey-nmqx/), and [toby-sym](/en/recomp/super-mario-odyssey-toby-sym/).

**Metroid Prime 4: Beyond** reached Linux and the Steam Deck on November 3 with a [recompilation](/en/recomp/metroid-prime-4-beyond/) that runs at a steady 60 fps on its author’s test machine ([GitHub](https://github.com/linuxopt/mp4-recomp)).

**Tomodachi Life: Living the Dream** released 1.0.0 of its [Windows recompilation](/en/recomp/tomodachi-life-living-the-dream/) on November 2; according to its README it plays start to finish, with 4K, ultrawide, and Mii exchange over the network ([GitHub](https://github.com/josiahg2502-glitch/TomodachiLife-recomp)). There is also a [Mac port](/en/port/tomodachi-life-living-the-dream/) built on nxnative.

**Xenoblade Chronicles 2** now has its [XC2 Recomp](/en/recomp/xenoblade-chronicles-2/), from the author of the [Xenoblade Chronicles X](/en/recomp/xenoblade-chronicles-x-definitive-edition/) one, with four releases on November 4 alone ([GitHub](https://github.com/jmars125/xc2-recomp)).

**Tears of the Kingdom** adds three more recompilations: [Weeping of the Empire](/en/recomp/the-legend-of-zelda-tears-of-the-kingdom-daniel-madrid-07/), with DLSS and in-game keyboard and mouse prompts, one [for Linux and the Steam Deck](/en/recomp/the-legend-of-zelda-tears-of-the-kingdom-muhammad1259-sigma/), and [ZuanCrisp’s](/en/recomp/the-legend-of-zelda-tears-of-the-kingdom-zuancrisp/). There’s also a [launcher](/en/tool/totk-launcher/) and two mod managers for TotK Recomp.

**And more:**
- [Astral Chain](/en/recomp/astral-chain-captainj-sparrow/), a second recompilation that plays start to finish;
- [Pokémon Brilliant Diamond](/en/recomp/pokemon-brilliant-diamond/), for Windows, Linux, Mac, iPhone, and iPad;
- [Pokémon Sword and Shield](/en/recomp/pokemon-sword-shield/);
- [Yo-kai Watch 4++](/en/recomp/yo-kai-watch-4-plus-plus/);
- a second recompilation of [Metroid Prime Remastered](/en/recomp/metroid-prime-remastered-drakolordx7/), made with [nxrecomp](/en/tool/nxrecomp/).

**The nxnative ecosystem.** nxnative has passed 12,000 stars on GitHub in three weeks ([GitHub](https://github.com/seedds/nxnative)). It grew out of [d2r-mobile](/en/port/diablo-ii-resurrected-jhaizhou-ops/), which pioneered the approach with the Switch version of Diablo II: Resurrected. Around it there are already:
- Mac apps that build and organize your games with no command line: [NX2Apple](/en/tool/nx2apple/), [LumaNX](/en/tool/lumanx/), [NX Play](/en/tool/nx-play/), [NX Library](/en/tool/nx-library/), [Cartridge](/en/tool/cartridge/), [nxnative-gui](/en/tool/nxnative-gui/), and [nxnative Easy](/en/tool/nxnative-easy/);
- Mac ports of [Octopath Traveler II](/en/port/octopath-traveler-ii/), [Final Fantasy Resonance](/en/port/final-fantasy-resonance/), and [Blade II](/en/port/blade-ii-the-return-of-evil/).

By another route, through MacNativeGames, [EA Sports FC 26](/en/port/ea-sports-fc-26/) also reached the Mac.

That’s 42 new entries: 36 Switch projects and 6 Switch 2 ones.
