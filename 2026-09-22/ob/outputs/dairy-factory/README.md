# La Vía Láctea · Academia de Producción

Videojuego educativo en español sobre logística de producción. Versión 2: **13 misiones, 4 áreas, una Academia con 25 conceptos y 6 logros**. Una máquina y hasta 3 máquinas paralelas idénticas. Actualización sobre el juego existente, con motor, puntuación y los 12 escenarios originales conservados.

## Jugar

1. Abre `dist/index.html` con un navegador moderno (Chrome, Edge, Firefox o Safari).
2. Pulsa **Comenzar mi primer turno**.
3. Arrastra los pedidos a la cola. También puedes seleccionar una tarjeta y pulsar una posición de destino.
4. Coloca todos los pedidos y pulsa **Iniciar producción**.

No hay instalación, servidor, cuenta ni conexión a Internet obligatorios. Todos los recursos son locales. El guardado depende de que el navegador permita `localStorage`; con archivos locales, su comportamiento puede variar entre navegadores. Si se bloquea, puedes jugar en la sesión y recibirás un aviso al guardar.

Si prefieres una dirección local estable y tienes Node instalado, ejecuta `node serve.cjs` desde esta carpeta y abre http://127.0.0.1:4173/. El servidor solo escucha en tu equipo; no publica el juego. Detenlo con Ctrl+C.

## Aprender mientras juegas

- **Lucía**, la jefa de planta, enseña los primeros pasos mediante acciones.
- **Cómo jugar esta misión** explica los controles y el objetivo en cada nivel.
- Cada misión tiene **3 pistas progresivas**. Usarlas reduce un poco los puntos, nunca las estrellas ni el acceso al siguiente nivel.
- Tras **45 segundos activos sin cambiar el plan**, aparece una invitación descartable a pedir ayuda. No hay tiempo límite ni revelación automática.
- **Ver respuesta paso a paso** construye una solución óptima en un Gantt visible. Explica cada llegada, espera, descanso, máquina y aporte al objetivo.
- Puedes avanzar, retroceder, reproducir o pausar la explicación. **Volver a mi plan** restaura tus colas originales. **Ahora me toca** inicia un intento nuevo.
- La demostración es práctica: no modifica récords ni desbloquea niveles. Después puedes reintentar libremente; no se conserva una penalización por haber estudiado la solución.
- El resultado explica el concepto y muestra tu objetivo frente al óptimo. **Ver solución** es siempre una elección del jugador.
- La **Academia de Producción** reúne nomenclatura, objetivos, estrategias y clasificación α | β | γ. Cada concepto tiene definición, ejemplo y uso. Los descubrimientos aparecen al llegar a su misión; todo el contenido puede consultarse libremente.
- Sus tres ejemplos de notación y el laboratorio de dos pedidos permiten experimentar sin puntos ni penalizaciones.
- Los enlaces contextuales abren la explicación sin perder tus colas; desde resultados también puedes volver al resultado.

## Controles

| Acción | Cómo hacerla |
|---|---|
| Asignar | Arrastra una tarjeta a la cola o selecciónala y pulsa «Colocar aquí». |
| Insertar | Arrastra antes de un pedido o selecciónalo y pulsa el signo + de destino. |
| Reordenar | Arrastra o utiliza las flechas ‹ y ›. |
| Cambiar máquina | Selecciona un pedido ya asignado y elige otra cola. |
| Retirar | Pulsa × bajo el pedido de la cola. |
| Consultar tiempos | Pulsa un bloque del Gantt. |
| Teclado | Tab para navegar; Enter/Espacio para activar; Escape cancela selección/cierra diálogos. |
| Simulación | Inicia, pausa, reanuda, cambia entre 1×/2×/4× o salta al resultado. |

En pantallas táctiles puedes arrastrar las tarjetas o usar selección y botones. Desliza fuera de las tarjetas para desplazar la página; el Gantt y las colas tienen desplazamiento horizontal.

## Campaña

| Misión | Concepto | Objetivo | Óptimo verificado |
|---|---|---|---:|
| 1. Tu primer turno | Tutorial, una máquina | Cmax | 65 |
| 2. Pequeños primero | SPT | ΣCj | 170 |
| 3. Una promesa es una promesa | Fechas y tardanza | ΣTj | 15 |
| 4. Clientes que cuentan | Prioridades, WSPT | ΣwjCj | 495 |
| 5. El camión de las nueve | Disponibilidad | ΣCj | 300 |
| 6. Antes del café | Descanso no interrumpible | Cmax | 160 |
| 7. Quince minutos de ventaja | Llegadas + descanso | ΣTj | 0 |
| 8. La ruta del colegio | Prioridad + calendario | ΣwjTj | 40 |
| 9. Mejor en equipo | Dos máquinas | Cmax | 65 |
| 10. El equilibrio perfecto | Reparto de carga | Δ carga | 0 |
| 11. Tres líneas, cero excusas | Tres máquinas | Pedidos tardíos | 0 |
| 12. Maestría láctea | Limpiezas por máquina | ΣwjTj | 40 |
| 13. Examen del jefe de planta | Interpretar y resolver 1 &#124; rj &#124; ΣwjTj | ΣwjTj | 5 |

Los óptimos no revelan automáticamente sus secuencias durante el juego. Una estrella permite avanzar. Cada nivel conserva por separado el máximo puntaje, las máximas estrellas y el menor objetivo; pueden corresponder a intentos diferentes. Repetir una misión no acumula su puntaje una segunda vez.

## El desafío final

La misión 13 se desbloquea al completar la 12. Primero interpreta `1 | rj | ΣwjTj` mediante tres preguntas. Todas las respuestas reciben explicación; equivocarse permite continuar y no resta puntos. Después aparece una tabla con pj, rj, dj y wj y se programa un turno real de cinco pedidos. Hay 120 órdenes posibles; el óptimo es 5 min·peso. Completarlo fuera de práctica concede la insignia **Maestro de la Secuenciación**.

## Logros

Primer turno, Justo a tiempo, Producción perfecta, Sin ayuda, Estudiante aplicado y Maestro de la Secuenciación. Consultar cinco conceptos distintos concede Estudiante aplicado. Los logros son reconocimientos y no cambian la fórmula de puntos. La práctica no concede logros de producción.

## Arquitectura

```text
dairy-factory/
├── README.md
├── ACTUALIZACION.md            ← cambios de esta fase
├── VALIDACION.md               ← evidencia y límites de QA
├── serve.cjs                   ← servidor local opcional sin dependencias
├── tests/engine.test.cjs
├── tests/academy.test.cjs
├── tests/legacy-levels.json     ← contrato de los 12 escenarios previos
└── dist/                       ← sitio completo listo para copiar/publicar
    ├── index.html
    ├── styles.css              ← identidad y pantalla principal
    ├── game.css                ← juego y pantallas secundarias
    ├── learning.css            ← guía y adaptaciones de interacción
    ├── evolution.css           ← fábrica viva, Academia, examen y responsive
    ├── assets/factory.png      ← ilustración original generada
    └── js/
        ├── engine.js           ← funciones puras de scheduling y solver
        ├── levels.js           ← datos, mundos, pistas y lecciones
        ├── scoring.js          ← puntuación independiente
        ├── storage.js          ← progreso y preferencias locales
        ├── simulation.js       ← reloj visual y sonidos Web Audio
        ├── dragdrop.js         ← arrastre con Pointer Events
        ├── art.js              ← productos y escenas SVG originales
        ├── academy.js          ← contenido académico estructurado
        ├── academy-ui.js       ← Academia, laboratorio y preguntas
        ├── progress.js         ← conceptos descubiertos y seis logros
        └── app.js              ← vistas y controlador del juego
```

Se usan scripts clásicos encapsulados para funcionar incluso con `file://`, sin empaquetador ni dependencias. Los módulos matemáticos también se pueden cargar con `require` para pruebas. El motor no accede al DOM ni al almacenamiento.

### Modelo de programación

- Todos los tiempos son **minutos enteros desde las 08:00**. Pesos positivos.
- Una máquina procesa un solo pedido a la vez. Un pedido aparece como máximo una vez en las colas.
- `ready = max(fin previo de la máquina, rj)`.
- Se busca el primer intervalo continuo de duración `pj` que no atraviese descansos. Si no cabe, se desplaza después del descanso y se revisan los siguientes.
- Los intervalos son `[inicio, fin)`: terminar exactamente al comenzar un descanso es válido.
- La cola es una decisión del jugador: la máquina puede esperar a que llegue el siguiente pedido, aunque otro esté disponible.
- `Cj = fin`, `Fj = Cj − rj`, `Lj = Cj − dj`, `Tj = max(0, Lj)`.
- Las fechas son compromisos evaluados con tardanza, no restricciones que hagan inviable un pedido.
- Carga = suma de procesamiento. El balance incluye máquinas vacías.
- El ocio y la utilización se miden para todas las máquinas desde 0 hasta Cmax, descontando la unión de los descansos. No todo ese ocio es evitable.

### Solución y puntuación

El solver enumera permutaciones y particiones ordenadas entre máquinas: `n! × C(n+m−1,m−1)`. El máximo de la campaña es **20.160 candidatos** (6 pedidos, 3 máquinas). Evalúa calendarios completos y conserva un óptimo, que puede no ser único. La búsqueda admite espera deliberada por un pedido todavía no disponible. Para el tamaño admitido, no usa un benchmark heurístico.

La API restringe la búsqueda a un máximo de 7 pedidos en una máquina o 6 en hasta 3 máquinas. Los escenarios mayores necesitan otro algoritmo o un benchmark explícito; no se ejecuta fuerza bruta sin límite.

`playerScore` es el valor del objetivo del jugador, `optimalScore` es el óptimo matemático y `points` es la puntuación lúdica. Son conceptos diferentes.

```text
calidad = max(0, min(1, 1 − (playerScore − optimalScore) / escala))
escala = Σpj; en objetivos ponderados, Σwjpj; para contar tardíos, n
3 estrellas: calidad ≥ 0,98
2 estrellas: calidad ≥ 0,80
1 estrella: plan completo y factible
```

Esta medida también funciona cuando el óptimo es cero. No representa utilización de máquinas ni cociente óptimo/resultado.

Puntos: 1.000 por completar + hasta 5.000 por calidad + hasta 1.000 por puntualidad + 500 por no usar pistas + 1.000 por el óptimo − 100 por pista. En misiones que aún no enseñan fechas, los 1.000 de entrega son un **bono de iniciación fijo**: ninguna fecha oculta perjudica al jugador. La primera pista también elimina el bono de 500 por jugar sin pistas; el desglose es visible en resultados. Máximo: 8.500 por nivel.

### Agregar niveles y modos

`levels.js` define las misiones mediante objetos con `id`, `world`, `mode`, `machines`, `objective`, `jobs`, `breaks`, `show`, `mission`, `hints`, `lesson`, `abilities` y `events`. El constructor `jobs()` añade la presentación de cada producto.

Para ampliar la campaña actualiza los IDs de `worlds` y el contenido académico asociado. Los totales de interfaz, la validación WebMCP y el almacenamiento toman el número de niveles desde `levels`. El logro de graduación y el título del examen están ligados explícitamente a la misión 13; revísalos si amplías la campaña. el **motor matemático no necesita reescribirse** para otro nivel con los modos actuales.

`registerMode(mode, decoder)` es el punto de extensión del motor. Flow Shop y Job Shop requerirán un modelo de operaciones con precedencias, validación por operación, control de rutas y un solver propio; **no están simulados como si fueran máquinas paralelas**. Habilidades, setups, eventos y desafíos aleatorios no se implementaron en esta primera versión. Sus campos se reservan en el modelo y su incorporación debe recalcular el benchmark con las mismas condiciones del jugador.

### WebMCP opcional

Si el navegador ofrece `document.modelContext`, el juego registra `read_factory_state`, `start_factory_mission` y `stage_factory_queues`. Comparten estado, validación y acciones con la interfaz. En otros navegadores se omiten sin afectar el juego. No se realizan solicitudes externas ni se publican datos.

## Pruebas

Con Node instalado, desde esta carpeta:

```sh
node --test tests/engine.test.cjs tests/academy.test.cjs
```

El juego no requiere Node para ejecutarse. Consulta `VALIDACION.md` para el alcance de las pruebas.

## Compatibilidad del progreso

Se mantiene la clave `dairy-factory-v1` y la versión 1. Los campos nuevos se incorporan sin borrar puntuaciones, estrellas, intentos o ajustes. Los logros que necesitan datos que antes no se guardaban (puntualidad y tres estrellas sin pistas) se acreditan en nuevos intentos; no se inventan a partir de récords antiguos. Conservar el mismo origen y navegador conserva el progreso.

## Publicar posteriormente en GitHub Pages

La carpeta `dist` ya contiene la versión distribuible; no necesita build. Copia **su contenido** a la raíz del repositorio que publicarás, conserva la carpeta `assets` y los scripts y habilita GitHub Pages para esa rama y carpeta. También puedes copiarlo a `docs` y usar esa carpeta como origen. Todas las rutas de recursos son relativas, por lo que funcionan en una subruta de repositorio.

El progreso es propio de cada navegador y origen. El progreso local de `file://` o de una vista previa no se transfiere automáticamente al sitio publicado. No se ha creado un repositorio ni publicado el juego en una cuenta externa.
