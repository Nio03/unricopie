---
title: "Emulating or recompiling the Switch 2"
date: 2026-11-04
summary: "Three routes already bring Switch 2 games to PC and Mac: emulating them, running their code as is on an Apple chip, or recompiling it. How each one works, what holds it back, and why they lean on each other."
kind: opinion
---

Two weeks after the Switch 2 was hacked, its games already run outside the console by three different routes. [The chronicle of those days is in another post](/en/blog/switch-2-en-pc/); this one explains what each route does and why all three are moving at once.

## The same ARM64, with new parts

A Switch 2 game looks a lot like a Switch one: an ARM64 program for the same operating system, Horizon. Eglantine’s technical notes sum it up: 64-bit, a 39-bit address space, and six cores. The differences are in the details, and they’re what holds everyone back:

- **New instructions.** The processor supports ARM extensions the first Switch didn’t use. In Mario Kart World, those notes count over 114,000 pointer-authentication instructions, 37,560 `LDAPR` loads, and 24,718 atomic operations that the translator inherited from Eden didn’t recognize.
- **A new graphics API, NVN2.** It succeeds the Switch’s NVN, with new calls for mesh shaders, variable-rate shading, or DLSS.
- **Another GPU.** The shaders are written for NVIDIA’s Ampere architecture (SM86), with warp and tensor instructions and task and mesh stages the Switch didn’t have.
- **A lot of memory.** Pokémon Pokopia reserves 11 GB of address space, and Mario Kart World takes 11 to 12 GB while playing on a Mac.

## Emulating: Eglantine and Eden

An emulator imitates the whole console while you play. Eglantine comes from Eden, which in turn comes from yuzu, and keeps both of its CPU engines. On an x86 PC, dynarmic translates the game’s ARM64 code on the fly. On an ARM machine, it can run it directly. The GPU is emulated too: the commands the game sends to the Ampere graphics chip, and its shaders, are translated to Vulkan during play.

The upside is that one program works, in principle, for any game. The cost is that all that work happens while you play, so it takes a powerful machine: according to its README, Eglantine runs Mario Kart World at decent or full speed depending on the hardware, and Splatoon Raiders with variable performance. Emulators aren’t part of our catalog, so we don’t link them here.

## Running it as is: nxnative on Apple chips

Apple’s chips are ARM64 too, and that opens a shortcut. [nxnative](/en/tool/nxnative/) doesn’t translate the game’s code: it loads it into memory and lets it run directly on the processor. It only rewrites the few instructions Apple’s kernel doesn’t allow, and system calls go to a program that stands in for Horizon. NVN graphics are rebuilt on Metal, and shaders are translated before play with Ryujinx’s translator. The approach was pioneered by [d2r-mobile](/en/port/diablo-ii-resurrected-jhaizhou-ops/), with the Switch version of Diablo II: Resurrected.

For the Switch 2, nxnative’s forks implement NVN2 on Metal and translate the Ampere shaders. With [kartnative](/en/port/mario-kart-world-kartnative/), Mario Kart World’s 11,567 shaders are translated in the first build, in about 30 minutes, and the game runs at a steady 60 fps on an M5 Pro Mac. [switch2mac](/en/port/mario-kart-world-switch2mac/) plays it start to finish at about 58 fps on an M1 Max. With [Pokopia Native](/en/port/pokemon-pokopia-pokopia-native/), Pokémon Pokopia even reaches the iPhone, at 30 fps. The catch: the app only starts when signed with a paid developer account, because Apple only grants such apps the permission to reserve that much memory.

The limit is twofold. It only works on Apple chips, and each port is tied to an exact version of the game: the Mario Kart World one supports 1.0.0 and recognizes each module by its build ID.

## Recompiling: DKB Recomp and Pokopia Recomp

A Windows PC isn’t ARM, so the code has to be translated no matter what. Static recompilation does it once, before play: it turns the whole ARM64 program into C and compiles it as an x86-64 executable. [DKB Recomp](/en/recomp/donkey-kong-bananza/) shows how much work that takes with Donkey Kong Bananza:

- It translates all 180,061 functions with no instruction left unresolved, after adding pointer authentication and `LDAPR`, and checks the result against the Unicorn CPU emulator.
- It answers 700 NVN2 calls. It accepts 51 new calls it doesn’t execute yet, such as those for mesh shaders, variable-rate shading, or DLSS.
- It brings the first 3D scene’s 4,820 Ampere shader stages to Vulkan.

Even so, its README warns that it isn’t playable yet. [Pokopia Recomp](/en/recomp/pokemon-pokopia/) is a bit further along: it compiles Pokémon Pokopia on your PC in about 7 minutes, builds the shader cache in one to two hours, and its test builds have been played through the first area.

The upside of recompiling is that there’s nothing to translate during play, and the game can be extended: Pokopia Recomp already adds DLSS, DLAA, and FSR 3. The cost, as with nxnative, is that each game and each version needs its own work.

## They lean on each other

The three routes don’t compete as much as it seems:

- DKB Recomp brings the Ampere shaders to Vulkan with the lowering that Eglantine wrote.
- kartnative learned how NVN2 and SM86 shaders work from the public commits and notes of Eglantine and of PokeDinner, a fork of Eglantine.
- OunceNative uses patches from PokeDinner’s shader translator.
- Underneath nxnative runs Ryujinx’s shader translator.
- DKB Recomp, and on the Switch 1 the Xenoblade Chronicles X and Astral Chain recompilations, build on [TotK Recomp](/en/recomp/the-legend-of-zelda-tears-of-the-kingdom/).

Emulators chart the console, and native ports and recompilations use that map to build one program per game.

## What doesn’t change

All three routes ask for the same thing: your own copy, dumped from your own Switch 2. None of the projects we’ve reviewed carries anything from the game. Some, like switch2mac, don’t even need keys, because Switch 2 dumping tools already hand over the decrypted files. The catalog’s Switch 2 entries stay unlinked while things settle, as we explained in [the previous post](/en/blog/switch-2-en-pc/).
