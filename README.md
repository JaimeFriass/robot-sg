# **Práctica 2 Sistemas Gráficos** *2017-2018*
## Robot

Diseño e implementación de un sistema gráfico basado en un objeto articulado usando  **THREE.js**.
[Enlace al juego](http://www.jaimefrias.es/robot/robot)

![](robot/imgs/robot_squeme.png?raw=true)

Consiste en un juego donde hay que pilotar a un robot evitando las colisiones con objetos volantes malos, que restan energía, y con buenos que dotan de energía y/o puntos. Estos se diferencian en su color:
 * Verdes. Darán vida al jugador de forma aleatoria. Poseen textura verde metálica. Aparecen un 20%.
 * Rojos. Quitarán vida al jugador. Son grises y metálicos.

La dificultad del juego aumentará en función de los puntos conseguidos y el tiempo transcurrido, diferenciandose tres niveles:
 * Fácil. Los objetos volantes vuelan lento.
 * Medio. Estos ahora volarán más rapido y quitarán más vida. Se llega consiguiendo 100 puntos.
 * Difícil. Ahora los objetos volantes irán aún más rapido y quitarán más vida. El jugador deberá de tener al menos 500 puntos.

El robot perderá vida al moverse adelante o atrás.

## Escenario
![](robot/imgs/mapa.png?raw=true)
Este consta de un pequeño parque con casas y árboles alrededor. Los Ovos aparecerán en una casa en frente del césped y volarán hasta el final del mapa detrás de los árboles. También hay dos farolas en las esquinas que proporcionan una iluminación amarilla pobre alrededor. 
Cuando el robot se sale de esta zona finalizará el juego. 
El mapa estará relleno de densa niebla para dificultar la vista y añadirle dificultad y ambiente al juego. 
El juego también posee sonido de ambiente.
Se puede alternar entre la cámara en primera persona, situada en el ojo del robot, y entre la de tercera persona, que el jugador puede mover con el ratón.

## Objetivo de las prácticas

### Sesion 1
 * Cabeza que gira automáticamente.
 * Conjunto cuerpo-cabeza que se balance.
 * Brazos se alargan.

### Sesión 2
 * Objetos voladores, buenos y malos.  :space_invader:
 * Colisiones entre objetos voladores y robot.
 * Perdida de energía con colisiones.  :battery:
 * Contabilización de puntos.

### Sesión 3
 * Interacción mediante teclado
 * Texturas en los materiales
 * Fuente de alimentación en el robot  :flashlight:
 * Vista subjetiva  :camera:

### Sesión 4
 * Añadido de dificultad conforme el tiempo o puntos.  :watch:
 * Mejoras opcionales.