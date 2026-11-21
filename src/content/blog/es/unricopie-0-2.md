---
title: "Unricopie 0.2: Linux, línea de comandos y tus copias en una carpeta"
date: 2026-11-21
summary: "La 0.2 de Unricopie llega a Linux, se maneja desde la línea de comandos (también para añadir juegos a Steam), busca tus copias en una carpeta, instala cualquier versión publicada y comprueba más cosas antes de instalar y de abrir un juego."
kind: log
---

## Qué trae la 0.2

- **Linux:** AppImage y tar.gz para x86-64 con glibc 2.35 o posterior. Las AppImage de los juegos se abren aunque el sistema no tenga FUSE, y si a un juego le falta una librería del sistema, Unricopie dice cuál y cómo instalarla en tu distribución.
- **Línea de comandos:** `unricopie list`, `install`, `update`, `versions`, `copies`, `launch`, `path`, `add` y `remove-added`. `launch` espera a que el juego se cierre, así que sirve para añadir un juego a Steam como juego externo, o a Playnite o ES-DE.
- **Tus copias:** en Ajustes, «Buscar en una carpeta…» busca tus ROM e ISO y guarda las que coinciden con lo que pide cada proyecto. Solo cuenta el hash exacto, nunca el nombre del archivo, y tú eliges cuáles guardar.
- **¿Necesita tu copia?:** la pestaña «Qué necesitas» dice si el juego lee tu copia cada vez que lo abres o solo la primera, para generar sus propios archivos, y cuánto ocupa en disco.
- **Cualquier versión:** la pestaña Versiones lista las versiones publicadas de cada proyecto, y puedes instalar una anterior o pasar a ella. La que tenías queda guardada con tus partidas.
- **Comprobaciones:** antes de bajar, el espacio libre; antes de descomprimir, el análisis de la descarga con el Microsoft Defender de tu equipo; antes de abrir un juego, el Visual C++ y Vulkan.
- **Añadir un proyecto de GitHub:** en Ajustes, «Añadir un proyecto de GitHub» instala un repositorio que todavía no está en el catálogo, con las mismas comprobaciones de siempre. Queda marcado como «Sin revisar», porque Unricopie no sabe si funciona ni qué necesita.
- **Más juegos:** 20 recetas nuevas, entre ellas Shadow the Hedgehog, Conker's Bad Fur Day Reloaded, Luigi's Mansion, Wind Waker HD, Monster Hunter Portable 3rd, Donkey Kong Country, Killzone Shadow Fall y Driveclub. Unricopie instala 96 proyectos en Windows y 68 en Linux, y las recetas nuevas también le llegan a la 0.1.
- **macOS, en camino:** Unricopie ya sabe abrir las apps de Mac; falta probarlo en equipos reales antes de publicar su versión.

## Descarga

Unricopie se baja desde [su página](/es/unricopie/). Es gratis, de código libre (GPL-3.0) y no pide cuenta. Si ya tienes la 0.1, te avisa de que hay una versión nueva.
