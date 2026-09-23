# Actualización de La Vía Láctea — 22 de septiembre de 2026

La versión 2 continúa el proyecto existente. La versión publicada indicada por el usuario se revisó como referencia visual y funcional. Los cambios están implementados en esta carpeta; no se ha sustituido la versión pública.

## Archivos y componentes

| Archivo | Cambio |
|---|---|
| `dist/js/art.js` | Nuevo catálogo de SVG originales: leche, queso, yogurt, mantequilla, helado, chocolate, tanques, máquina, camión, cajas, trabajador, Academia e insignia. |
| `dist/evolution.css` | Nueva identidad La Vía Láctea, navegación, recorrido de fábrica, animaciones breves, Academia, examen y adaptaciones de tableta/móvil. |
| `dist/js/academy.js` | 25 conceptos estructurados en cuatro categorías, tres ejemplos interactivos, textos cotidianos y preguntas del examen. |
| `dist/js/academy-ui.js` | Vistas de Academia, fichas, laboratorio para comparar dos órdenes y evaluación explicada de nomenclatura. |
| `dist/js/progress.js` | Descubrimientos, consultas y seis logros derivados del progreso. |
| `dist/js/app.js` | Integra dibujos, fábrica en vivo, instrucciones naturales, enlaces contextuales, Gantt y resultados gráficos, examen y graduación. |
| `dist/js/levels.js` | Añade una cuarta área y la misión 13; conserva los primeros 12 escenarios íntegros. |
| `dist/js/storage.js` | Migración aditiva con la misma clave y versión; consultas, descubrimientos y condiciones de logros. |
| `dist/index.html` | Identidad, metadatos y carga de los módulos nuevos. |
| `tests/engine.test.cjs` | Amplía a 13 la verificación exhaustiva de óptimos y de respuesta guiada. |
| `tests/academy.test.cjs`, `tests/legacy-levels.json` | Regresión de código/datos previos, Academia, examen, migración y logros. |
| `README.md`, `VALIDACION.md`, `serve.cjs` | Instrucciones actualizadas, evidencia de pruebas y servidor local opcional. |

## Jugar y aprender

Las misiones 1–12 presentan una situación y un objetivo cotidiano. Las tarjetas dicen «Tarda», «Disponible desde», «Entrega» y «Prioridad». Los tooltips relacionan esos términos con las variables. La nomenclatura formal se consulta en la Academia, en las explicaciones voluntarias o en el desglose de resultados.

Se preservan las tres pistas de cada misión y la solución dinámica: avance, retroceso, reproducción, pausa y restauración del plan propio. Tras 45 segundos activos sin cambios aparece una invitación a pedir ayuda. No hay límite de tiempo. Consultar la Academia no penaliza; una solución resuelta se marca como práctica. Un intento nuevo permite volver a competir.

La Academia contiene:

- **Nomenclatura:** Jj, pj, rj, dj, wj, Cj, Fj, Lj y Tj.
- **Objetivos:** Cmax, ΣCj, ΣwjCj, ΣTj, ΣwjTj, ΣUj y diferencia de carga.
- **Estrategias:** SPT, EDD y WSPT, con sus condiciones de validez. EDD no se presenta como óptima para tardanza total.
- **Clasificación:** α, β y γ, Flow Shop, Job Shop y precedencias. Los modos aún no implementados se identifican como futuros.

Cada ficha incluye símbolo, nombre, significado, ejemplo y contexto de uso. Las consultas quedan registradas. Los conceptos se marcan como descubiertos al llegar a sus misiones, sin impedir su estudio anticipado. El laboratorio compara 10 + 40 frente a 30 + 40 para mostrar por qué la suma de finalizaciones y el fin de producción son indicadores diferentes.

## Examen del jefe de planta

La misión 13 presenta `1 | rj | ΣwjTj`. Tres preguntas comprueban entorno, disponibilidad y objetivo. Las explicaciones aparecen tanto para aciertos como para errores; después se puede repasar o continuar. Ninguna respuesta bloquea indefinidamente ni reduce la puntuación.

La segunda parte conserva la mecánica real de colas, simulación y evaluación. Cinco pedidos tienen duraciones [20, 15, 35, 25, 10], disponibilidades [0, 20, 0, 35, 10], entregas [55, 50, 100, 75, 40] y pesos [2, 4, 1, 3, 2]. No hay pausas añadidas que contradigan la notación.

El solver compara los 120 órdenes. Un óptimo es J1 → J5 → J2 → J4 → J3, con finalizaciones 20, 30, 45, 70 y 105; solo J3 tiene 5 minutos de tardanza y peso 1. El objetivo es **5 min·peso**, con tres estrellas y 8.300 puntos sin pistas. Se otorga la insignia Maestro de la Secuenciación al completar el turno fuera de práctica.

## Presentación visual

Productos reconocibles y consistentes en tarjetas, colas, Gantt y resultados; mapa por áreas unido por recorridos; tanques, tuberías y transporte; luces y movimiento de máquina en producción; avisos de entrega cercana o tardía; productos completados en despacho. Se conserva la ilustración original de portada. El movimiento decorativo puede desactivarse y respeta la preferencia del sistema.

Las pantallas se adaptan a escritorio y tableta. En móvil se simplifica la decoración; colas, tablas y Gantt conservan su información mediante desplazamiento horizontal local.

## Lo que se preservó

`engine.js` y `scoring.js` permanecen idénticos byte a byte. Los datos de las misiones 1–12 coinciden con su copia de referencia. Se conservan Single Machine, Parallel Identical Machines, calendarios, disponibilidad, no interrupción, métricas, búsqueda exacta, umbrales de estrellas, puntos, pistas, simulación y arrastre con alternativa de teclado/clic.

El almacenamiento sigue usando `dairy-factory-v1`. Se añaden campos sin sustituir los anteriores. Los mejores puntos, estrellas y objetivo siguen guardándose de forma independiente y los reintentos no acumulan puntos duplicados. Los logros son informativos y no modifican la puntuación.

Las pruebas y sus límites se detallan en `VALIDACION.md`.
