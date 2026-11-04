---
title: "Emular o recompilar la Switch 2"
date: 2026-11-04
summary: "Tres caminos llevan ya los juegos de Switch 2 al PC y al Mac: emularlos, ejecutar su código tal cual en un chip de Apple o recompilarlo. Cómo funciona cada uno, qué los frena y por qué se apoyan unos en otros."
kind: opinion
---

En dos semanas desde el hackeo de la Switch 2, sus juegos ya corren fuera de la consola por tres caminos distintos. [La crónica de esos días está en otra entrada](/es/blog/switch-2-en-pc/); esta explica qué hace cada camino y por qué los tres avanzan a la vez.

## El mismo ARM64, con piezas nuevas

Un juego de Switch 2 se parece mucho a uno de Switch: es un programa ARM64 para el mismo sistema operativo, Horizon. Las notas técnicas de Eglantine lo resumen así: 64 bits, un espacio de direcciones de 39 bits y seis núcleos. Las diferencias están en los detalles, y son las que frenan a todos:

- **Instrucciones nuevas.** El procesador admite extensiones de ARM que la primera Switch no usaba. En Mario Kart World, esas notas cuentan más de 114.000 instrucciones de autenticación de punteros, 37.560 cargas `LDAPR` y 24.718 operaciones atómicas que el traductor heredado de Eden no reconocía.
- **Una API gráfica nueva, NVN2.** Sucede a la NVN de la Switch, con llamadas nuevas para shaders de malla, sombreado de tasa variable o DLSS.
- **Otra GPU.** Los shaders están escritos para la arquitectura Ampere de NVIDIA (SM86), con instrucciones de warp y de tensor, y etapas de tareas y de mallas que la Switch no tenía.
- **Mucha memoria.** Pokémon Pokopia reserva 11 GB de espacio de direcciones, y Mario Kart World ocupa entre 11 y 12 GB mientras se juega en un Mac.

## Emular: Eglantine y Eden

Un emulador imita la consola entera mientras juegas. Eglantine viene de Eden, que a su vez viene de yuzu, y conserva sus dos motores para la CPU. En un PC x86, dynarmic traduce el código ARM64 del juego sobre la marcha. En una máquina ARM, puede ejecutarlo directamente. La GPU también se emula: los comandos que el juego manda a la gráfica Ampere, y sus shaders, se traducen a Vulkan durante la partida.

La ventaja es que un solo programa sirve, en principio, para cualquier juego. El precio es que todo ese trabajo se hace mientras juegas, así que hace falta un equipo potente: según su README, Eglantine mueve Mario Kart World a buena velocidad o a velocidad completa según el equipo, y Splatoon Raiders con un rendimiento variable. Los emuladores no entran en nuestro catálogo, por eso aquí no los enlazamos.

## Ejecutar tal cual: nxnative en los chips de Apple

Los chips de Apple también son ARM64, y eso abre un atajo. [nxnative](/es/tool/nxnative/) no traduce el código del juego: lo carga en memoria y lo deja correr directamente en el procesador. Solo reescribe las pocas instrucciones que el núcleo de Apple no admite, y las llamadas al sistema van a un programa que hace las veces de Horizon. Los gráficos de NVN se rehacen sobre Metal, y los shaders se traducen antes de jugar con el traductor de Ryujinx. El método lo abrió [d2r-mobile](/es/port/diablo-ii-resurrected-jhaizhou-ops/) con la versión de Switch de Diablo II: Resurrected.

Para la Switch 2, los forks de nxnative implementan NVN2 sobre Metal y traducen los shaders de Ampere. Con [kartnative](/es/port/mario-kart-world-kartnative/), los 11.567 shaders de Mario Kart World se traducen en la primera compilación, en unos 30 minutos, y el juego va a 60 fps estables en un Mac con M5 Pro. [switch2mac](/es/port/mario-kart-world-switch2mac/) lo juega de principio a fin a unos 58 fps en un M1 Max. Con [Pokopia Native](/es/port/pokemon-pokopia-pokopia-native/), Pokémon Pokopia llega incluso al iPhone, a 30 fps. Eso sí, la app solo arranca firmada con una cuenta de desarrollador de pago, porque Apple solo concede a esas apps el permiso para reservar tanta memoria.

El límite es doble. Solo funciona en chips de Apple, y cada port se ata a una versión exacta del juego: el de Mario Kart World admite la 1.0.0 y reconoce cada módulo por su identificador de compilación.

## Recompilar: DKB Recomp y Pokopia Recomp

Un PC con Windows no es ARM, así que el código hay que traducirlo sí o sí. La recompilación estática lo hace una sola vez, antes de jugar: convierte todo el programa ARM64 a C y lo compila como un ejecutable de x86-64. [DKB Recomp](/es/recomp/donkey-kong-bananza/) muestra bien el trabajo que eso supone con Donkey Kong Bananza:

- Traduce sus 180.061 funciones sin dejar ninguna instrucción sin resolver, después de añadir la autenticación de punteros y `LDAPR`, y compara el resultado con el emulador de CPU Unicorn.
- Responde a 700 llamadas de NVN2. Acepta 51 llamadas nuevas que todavía no ejecuta, como las de shaders de malla, sombreado de tasa variable o DLSS.
- Pasa a Vulkan las 4.820 etapas de shaders de Ampere de la primera escena 3D.

Aun así, su README avisa de que no se puede jugar todavía. [Pokopia Recomp](/es/recomp/pokemon-pokopia/) va algo más adelante: compila Pokémon Pokopia en tu PC en unos 7 minutos, prepara la caché de shaders en una o dos horas, y sus versiones de prueba se han jugado hasta la primera zona.

La ventaja de recompilar es que durante la partida no hay nada que traducir, y el juego se puede ampliar: Pokopia Recomp ya añade DLSS, DLAA y FSR 3. El precio, como con nxnative, es que cada juego y cada versión exigen su propio trabajo.

## Se apoyan unos en otros

Los tres caminos no compiten tanto como parece:

- DKB Recomp pasa los shaders de Ampere a Vulkan con la conversión que escribió Eglantine.
- kartnative aprendió cómo funcionan NVN2 y los shaders SM86 de los commits y notas públicas de Eglantine y de PokeDinner, un fork de Eglantine.
- OunceNative usa parches del traductor de PokeDinner.
- Por debajo de nxnative trabaja el traductor de shaders de Ryujinx.
- DKB Recomp, y en la Switch 1 las recompilaciones de Xenoblade Chronicles X y Astral Chain, parten de [TotK Recomp](/es/recomp/the-legend-of-zelda-tears-of-the-kingdom/).

Los emuladores levantan el mapa de la consola, y los ports nativos y las recompilaciones lo usan para construir un programa por juego.

## Lo que no cambia

Los tres caminos piden lo mismo: tu propia copia, volcada de tu propia Switch 2. Ninguno de los proyectos que hemos revisado trae nada del juego. Algunos, como switch2mac, ni siquiera necesitan claves, porque las herramientas de volcado de la Switch 2 ya entregan los archivos descifrados. Las fichas de Switch 2 del catálogo siguen sin enlace mientras se aclara la situación, como contamos en [la entrada anterior](/es/blog/switch-2-en-pc/).
