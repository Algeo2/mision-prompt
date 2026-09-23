# Validación — La Vía Láctea v2

Fecha: 22 de septiembre de 2026. Ejecución local con Node 24 y navegador de vista previa integrado. No se realizaron cambios en el sitio público de referencia.

## Pruebas automatizadas

Comando, desde esta carpeta:

```sh
node --test tests/engine.test.cjs tests/academy.test.cjs
```

**20 pruebas aprobadas; 0 fallos.** Además, `node --check` verifica todos los scripts. No se necesitan paquetes adicionales.

La suite comprueba:

- Óptimos de las 13 misiones y factibilidad independiente: [65, 170, 15, 495, 300, 160, 0, 40, 65, 0, 0, 40, 5].
- Espera deliberada por disponibilidad, límites exactos de descansos, pausas encadenadas y procesamiento sin interrupciones.
- Relojes independientes, calendarios por máquina y carga de máquinas vacías.
- Diferencia entre lateness negativa y tardanza cero; terminar exactamente en la entrega es puntual.
- Rechazo de datos/colas inválidos y modos no implementados; evaluación parcial.
- Puntuación con óptimo cero; fechas ocultas sin penalización; pistas sin pérdida de estrellas; demostraciones sin récords.
- Guardado de récords independientes, prevención de acumulación por repetir y respaldo en memoria si el almacenamiento falla.
- Inserción paso a paso de las soluciones de las 13 misiones, que reproduce sus calendarios completos.
- Integridad de los primeros 12 escenarios y hashes idénticos del motor y la puntuación.
- Estructura de las 25 fichas, calificación del examen, migración del progreso y condiciones de logros.
- Cálculo explícito del examen final: 120 candidatos, finalizaciones [20, 30, 45, 70, 105] y objetivo 5.

## Comprobaciones en navegador

La vista previa se sirvió en `http://127.0.0.1:4173/`. El progreso previo de las misiones 1–6 se conservó al cargar la actualización. En esta fase se simularon y finalizaron las misiones 7–13. Las misiones 1–6 habían sido recorridas durante la construcción original y todas se vuelven a verificar matemáticamente en la suite actual.

| Flujo | Resultado observado |
|---|---|
| Academia y navegación de categorías | Fichas, ejemplos y laboratorio operativos. |
| Consultar cinco conceptos distintos | Logro Estudiante aplicado; sin alteración de puntos. |
| Laboratorio SPT | Orden corto primero: 10 + 40 = 50; mismo cierre a las 08:40. |
| Inicio y pausa de producción | Reloj, estados de máquinas/pedidos y botón Reanudar coherentes. |
| Misiones 7–12 con planes óptimos | Tres estrellas; objetivos y puntajes coinciden con el motor. |
| Concepto abierto desde resultados | Cerrar con Escape restaura el resultado anterior. |
| Examen con 0 de 3 aciertos | Explica los tres errores y permite continuar a producción. |
| Examen, tabla y objetivo | Datos formales presentes; secuencia óptima alcanza 5 min·peso. |
| Graduación | Tres estrellas, 8.300 puntos e insignia especial. |
| Recarga de página | 13 misiones completadas y seis logros conservados en la sesión de QA. |
| Arrastre desde el SVG de un producto | Pedido insertado correctamente en la cola. |
| Selección con Espacio y colocación por botón | Operativa. |
| Respuesta guiada y restauración | Explicación coherente; se recupera la cola original J1 → J2. |
| Ayuda contextual durante el turno | Conserva el orden de cinco pedidos del examen. |
| Tamaños de escritorio, 768 × 1024 y 390 × 844 | Sin desbordamiento horizontal de página en las vistas revisadas; controles accesibles. |
| Consola de la vista previa | Sin errores ni advertencias registrados durante el recorrido. |

## Alcance y límites

- La apertura `file://` fue bloqueada por la política de seguridad del navegador de pruebas y no se verificó visualmente. La distribución usa scripts clásicos, rutas relativas y recursos locales, sin peticiones de red; el flujo verificado es HTTP local. Se incluye `serve.cjs` como opción reproducible.
- No se ha efectuado una matriz de pruebas en todos los navegadores ni una prueba física en tableta táctil. El arrastre usa Pointer Events y hay alternativa por selección y botones.
- El progreso pertenece al navegador y al origen. Cambiar del archivo local al sitio publicado no migra automáticamente los datos. Los datos de la sesión de QA no están incluidos en el ZIP.
- Se conserva compatibilidad con el progreso de este proyecto bajo `dairy-factory-v1`; no se presupone compatibilidad con versiones externas que hayan modificado su formato.
- Flow Shop, Job Shop y precedencias se enseñan como ampliaciones; no se presentan como modos jugables ya implementados.
