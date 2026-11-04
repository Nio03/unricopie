---
title: "La Switch 2 llega al PC: emuladores, recomps y ports nativos"
date: 2026-11-04
summary: "En dos semanas desde el hackeo de la Switch 2, Mario Kart World, Pokémon Pokopia y Donkey Kong Bananza ya corren en PC y Mac, por emulación y por ports nativos. Las fichas de Switch 2 entran sin enlace por prudencia, y la Switch 1 suma Super Mario Odyssey, Metroid Prime 4, Tomodachi Life, Xenoblade Chronicles 2 y nxnative."
kind: log
---

## Abierta en días

La Nintendo Switch 2 se hackeó a finales de octubre, unos dieciséis meses después de su lanzamiento: según [Wccftech](https://wccftech.com/mario-kart-world-full-speed-pc-switch-2-emulator-eglantine-jailbreak/), poco más de una semana antes del 31 de octubre. Lo que vino después fue rapidísimo. Eden, el emulador de Switch, sumó un soporte experimental de Switch 2 con el trabajo de eden-nx2. De él salió Eglantine, cuyo repositorio se creó el 29 de octubre y que, según la misma nota, ya mueve Mario Kart World a velocidad completa en un PC capaz, con Splatoon Raiders jugable a una tasa variable ([VideoCardz](https://videocardz.com/newz/mario-kart-world-reaches-60-fps-on-pc-with-experimental-switch-2-emulator) también contó los 60 fps de Mario Kart World). En los días siguientes aparecieron Lichii (31 de octubre), Eden-NX2 (31 de octubre) y Orchid (1 de noviembre), versiones para PS5 y Android, y siguió oboromi, una prueba de concepto de emulador de Switch 2 que existe desde junio de 2025.

Los emuladores no entran en el catálogo, así que aquí no los enlazamos. Lo que sí entra son los proyectos que convierten tu propia copia en un programa nativo, y la Switch 2 ya tiene los primeros.

## Los primeros juegos de Switch 2 nativos

El camino más rápido llegó por Mac. [nxnative](/es/tool/nxnative/), que desde el 13 de octubre ejecuta juegos de Switch directamente en los chips de Apple, anotó el 31 de octubre los primeros pasos de Donkey Kong Bananza en un Mac: el bucle del juego, el menú y su primera escena jugable. Sobre esa base nacieron los ports de Mario Kart World. [kartnative](/es/port/mario-kart-world-kartnative/), creado el 1 de noviembre, juega copas enteras de Gran Premio, contrarreloj y el modo libre a 60 fps estables. Con [switch2mac](/es/port/mario-kart-world-switch2mac/), del 3 de noviembre, se juega de principio a fin a unos 58 fps en un M1 Max.

Pokémon Pokopia tiene ya tres proyectos. [Pokopia Recomp](/es/recomp/pokemon-pokopia/) es una recompilación estática para Windows: el 2 de noviembre publicó dos versiones de prueba, la segunda con DLSS, DLAA y FSR 3, y por ahora se ha probado hasta la primera zona. [Pokopia Native](/es/port/pokemon-pokopia-pokopia-native/) construye una app para Mac y otra para iPhone, con su 1.0.0 del 3 de noviembre. [OunceNative](/es/port/pokemon-pokopia-ouncenative/) es otro fork de nxnative para Mac, todavía en desarrollo.

En Windows también está [DKB Recomp](/es/recomp/donkey-kong-bananza/), una recompilación estática de Donkey Kong Bananza que parte de TotK Recomp. Su repositorio se creó el 1 de noviembre y su README avisa de que todavía no se puede jugar: llega a la cueva del tutorial, donde ya se camina y se golpea.

## Por qué estas fichas no llevan enlace

La escena se mueve con cuidado. El 29 de octubre, r/decomps prohibió enlazar cualquier repositorio relacionado con la Switch 2: ports, decomps, recomps o emuladores. Ese mismo día se contó en r/emulators que ProsperoEden, un emulador de Switch para PS5, había desaparecido de GitHub después de añadir soporte de Switch 2. Y el autor de Power Moon Recomp (lo contamos más abajo) explicó el 2 de noviembre que GitHub le cerró la cuenta en cuanto lo subió. Hasta hoy no hemos encontrado avisos DMCA de Nintendo entre los que GitHub publica desde el 20 de octubre.

Nuestra regla de siempre no cambia: no alojamos nada y solo listamos proyectos que piden tu propia copia del juego. Por prudencia, mientras se aclara la situación, las fichas de Switch 2 entran **sin enlace**: nombran el repositorio como texto, pero sin botón. Cada una recibirá su enlace cuando comprobemos que el repositorio no trae código ni datos del juego. La Switch 2 también tiene ya su propio filtro en el catálogo.

## Mientras tanto, en la Switch 1

**Super Mario Odyssey.** [Power Moon Recomp](/es/recomp/super-mario-odyssey-zzzarathustra-dev/) fue el post más votado de la semana en r/decomps: una recompilación estática sobre [LAS Recomp](/es/recomp/links-awakening-switch/) que, según su README, se termina entera en Windows y Linux. La 0.2.0, del 3 de noviembre, trajo 120 fps con fotogramas interpolados, ultrapanorámico y el fin de las bandas de color en cielos y niebla. Vive en [GitLab](https://gitlab.com/zzzarathustra-dev/power-moon-recomp) desde que su autor perdió la cuenta de GitHub. Odyssey tiene además otras tres recompilaciones: las de [Coz-0](/es/recomp/super-mario-odyssey-coz-0/), [nmqx](/es/recomp/super-mario-odyssey-nmqx/) y [toby-sym](/es/recomp/super-mario-odyssey-toby-sym/).

**Metroid Prime 4: Beyond** llegó a Linux y a la Steam Deck el 3 de noviembre con una [recompilación](/es/recomp/metroid-prime-4-beyond/) que, en el equipo de pruebas de su autor, se juega a 60 fps estables ([GitHub](https://github.com/linuxopt/mp4-recomp)).

**Tomodachi Life: Living the Dream** publicó el 2 de noviembre la 1.0.0 de su [recompilación para Windows](/es/recomp/tomodachi-life-living-the-dream/), que según su README se juega de principio a fin, con 4K, ultrapanorámico e intercambio de Miis por red ([GitHub](https://github.com/josiahg2502-glitch/TomodachiLife-recomp)). También hay un [port para Mac](/es/port/tomodachi-life-living-the-dream/) sobre nxnative.

**Xenoblade Chronicles 2** tiene ya su [XC2 Recomp](/es/recomp/xenoblade-chronicles-2/), del mismo autor que la de [Xenoblade Chronicles X](/es/recomp/xenoblade-chronicles-x-definitive-edition/), con cuatro versiones solo el 4 de noviembre ([GitHub](https://github.com/jmars125/xc2-recomp)).

**Tears of the Kingdom** suma tres recompilaciones más: [Weeping of the Empire](/es/recomp/the-legend-of-zelda-tears-of-the-kingdom-daniel-madrid-07/), con DLSS y teclas de teclado y ratón dentro del juego, una [para Linux y Steam Deck](/es/recomp/the-legend-of-zelda-tears-of-the-kingdom-muhammad1259-sigma/) y la de [ZuanCrisp](/es/recomp/the-legend-of-zelda-tears-of-the-kingdom-zuancrisp/). Además hay un [launcher](/es/tool/totk-launcher/) y dos gestores de mods para TotK Recomp.

**Y más:**
- [Astral Chain](/es/recomp/astral-chain-captainj-sparrow/), una segunda recompilación que se juega de principio a fin;
- [Pokémon Diamante Brillante](/es/recomp/pokemon-brilliant-diamond/), para Windows, Linux, Mac, iPhone y iPad;
- [Pokémon Espada y Escudo](/es/recomp/pokemon-sword-shield/);
- [Yo-kai Watch 4++](/es/recomp/yo-kai-watch-4-plus-plus/);
- una segunda recompilación de [Metroid Prime Remastered](/es/recomp/metroid-prime-remastered-drakolordx7/), hecha con [nxrecomp](/es/tool/nxrecomp/).

**El ecosistema de nxnative.** nxnative supera ya las 12.000 estrellas en GitHub en tres semanas ([GitHub](https://github.com/seedds/nxnative)). Parte de [d2r-mobile](/es/port/diablo-ii-resurrected-jhaizhou-ops/), que abrió el método con la versión de Switch de Diablo II: Resurrected. A su alrededor ya hay:
- apps para Mac que construyen y ordenan tus juegos sin línea de comandos: [NX2Apple](/es/tool/nx2apple/), [LumaNX](/es/tool/lumanx/), [NX Play](/es/tool/nx-play/), [NX Library](/es/tool/nx-library/), [Cartridge](/es/tool/cartridge/), [nxnative-gui](/es/tool/nxnative-gui/) y [nxnative Easy](/es/tool/nxnative-easy/);
- ports a Mac de [Octopath Traveler II](/es/port/octopath-traveler-ii/), [Final Fantasy Resonance](/es/port/final-fantasy-resonance/) y [Blade II](/es/port/blade-ii-the-return-of-evil/).

Por otro camino, con MacNativeGames, también llegó a Mac [EA Sports FC 26](/es/port/ea-sports-fc-26/).

Son 42 fichas nuevas: 36 de proyectos de Switch y 6 de Switch 2.
