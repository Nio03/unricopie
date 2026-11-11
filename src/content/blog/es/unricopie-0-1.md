---
title: "Unricopie 0.1: el launcher de Recompendium"
date: 2026-11-11
summary: "Sale la primera versión de Unricopie, el launcher del catálogo: instala 39 proyectos en Windows desde su versión oficial, comprueba tu copia del juego, actualiza sin perder partidas y maneja los mods de Zelda 64: Recompiled y Banjo: Recompiled. Es gratis, de código abierto y, por ahora, para Windows."
kind: log
---

## Qué es

[Unricopie](/es/unricopie/) es el launcher de Recompendium. Instala los proyectos del catálogo desde la versión que publica su autor, comprueba tu copia del juego y lo deja listo para jugar. Nunca reparte juegos ni compila versiones propias: cada proyecto sigue necesitando tu propia copia legal, y Unricopie la compara con las versiones que pide cada proyecto antes de dejarla donde el juego la busca.

En Windows, la 0.1 instala 39 proyectos del catálogo, de 42 juegos: 5 recomps y 34 ports. Los demás siguen en Explorar con su enlace al proyecto, y sumaremos más cada semana.

## Qué hace la 0.1

- **Instala desde la fuente:** baja cada proyecto de su release en GitHub y comprueba la descarga con la suma que da GitHub.
- **Comprueba tu copia:** la guarda una sola vez en tu biblioteca y no la modifica.
- **Actualiza y vuelve atrás:** avisa cuando un proyecto saca versión nueva y la instala sin tocar tus partidas ni tus ajustes. La versión de antes queda guardada, y se puede volver a ella.
- **Todo el catálogo:** en Explorar están todas las fichas, con filtros por consola.
- **Mods de Thunderstore** para Zelda 64: Recompiled y Banjo: Recompiled: se instalan con lo que necesitan, se separan en perfiles y se ordenan arrastrándolos. Si dos traen los mismos archivos, eliges cuál gana. Los tuyos se suman soltándolos en la ventana, y cada perfil guarda los ajustes de sus mods, también los que cambias dentro del juego.
- **Portable:** con un `portable.txt` junto al programa, todo queda en esa carpeta.
- **Opiniones:** después de una hora de juego, o un día después de abrir una versión, Unricopie pregunta cómo te fue. La respuesta es un formulario de GitHub ya relleno que envías tú, y la suma de todas sale en la página de cada juego, dentro de Unricopie. «No arranca» se puede marcar desde el principio.

## Descarga

Unricopie se baja desde [su página](/es/unricopie/). Pide Windows 10 u 11 de 64 bits y no pide cuenta. Como todavía no está firmado, la primera vez Windows puede avisar de que no reconoce la aplicación: «Más información» y «Ejecutar de todas formas». La versión para Linux llega después.

El código es libre, con licencia GPL-3.0, y está en [GitHub](https://github.com/Nio03/unricopie-launcher). Las recetas que dicen cómo instalar cada juego se bajan de recompendium.com, así que se corrigen y se amplían sin sacar otra versión. Unricopie no tiene telemetría: solo se conecta a recompendium.com, a GitHub y a Thunderstore.

## En el sitio

- **Diseño nuevo:** el sitio tiene el mismo diseño que Unricopie, con la portada de cada juego bajo la franja de su consola, y tres temas, Noche, Día y Alto contraste, que se eligen con el botón de arriba.
- **Tres pestañas para recorrer el catálogo:** [Catálogo](/es/) abre con estantes por tipo y por consola, cada uno con «Ver todos»; [Proyectos](/es/proyectos/) muestra las 1641 fichas una a una, con la columna de filtros (tipo, consola, estado y si la instala Unricopie) y el orden por estrellas, nombre o actividad; y [Juegos](/es/juegos/) reúne los 307 juegos con más de un proyecto, cada uno con su página.
- **Filtros más claros:** las consolas van de la A a la Z, todas a la vista.
- **Instalar con Unricopie:** las fichas que Unricopie sabe instalar llevan su botón, y tienen su propio estante y su filtro.
