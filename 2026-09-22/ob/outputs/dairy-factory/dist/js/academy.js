(function(root){
  'use strict';
  const categories=[{id:'variables',name:'El idioma de los pedidos',short:'Nomenclatura',icon:'product'},{id:'objectives',name:'Qué queremos mejorar',short:'Objetivos',icon:'medal'},{id:'strategies',name:'Ideas para decidir',short:'Estrategias',icon:'machine'},{id:'notation',name:'Leer un problema',short:'α | β | γ',icon:'academy'}];
  const entries=[];
  function add(category,id,symbol,name,simpleName,definition,example,when,unlockedAt){entries.push({category,id,symbol,name,simpleName,definition,example,when,unlockedAt});}
  add('variables','job','Jj','Job','Un pedido de la fábrica','Un trabajo que debemos producir. El subíndice j identifica el pedido.','J3 puede ser un lote de yogurt, aunque J1 sea leche.','Para distinguir pedidos, datos y resultados.',1);
  add('variables','processing-time','pj','Processing Time','Tiempo de producción','Minutos de ocupación de la máquina para procesar el pedido. No incluye su espera ni un setup separado.','Si J3 necesita 25 min, p3 = 25.','Para estimar cuánto cabe en una ventana de trabajo.',1);
  add('variables','release-date','rj','Release Date','Disponible desde','Primer momento en que un trabajo puede comenzar. Se mide desde el inicio del turno.','r2 = 30 significa que J2 está disponible a las 08:30 si abrimos a las 08:00.','Cuando la materia prima o el pedido llegan durante la jornada.',5);
  add('variables','due-date','dj','Due Date','Entrega prometida','Momento comprometido con el cliente. En esta campaña una entrega tardía es válida, pero afecta al objetivo de puntualidad.','d2 = 60 significa entrega prometida a las 09:00.','Para evaluar compromisos de entrega.',3);
  add('variables','weight','wj','Weight','Importancia del pedido','Peso positivo que multiplica la finalización o la tardanza según el objetivo. No son las estrellas que ganas.','Con wj = 3, 5 min de tardanza aportan 15 min·peso a ΣwjTj.','Cuando el impacto de esperar o llegar tarde cambia entre clientes.',4);
  add('variables','completion','Cj','Completion Time','Hora de finalización','Tiempo desde el origen del turno hasta que termina el trabajo.','Acaba a las 09:10: Cj = 70, aunque haya llegado más tarde.','Para medir finalizaciones desde un mismo origen.',1);
  add('variables','flow','Fj = Cj − rj','Flow Time','Tiempo dentro del sistema','Tiempo desde que el pedido está disponible hasta que acaba. Incluye espera y procesamiento.','Si Cj = 70 y rj = 30, Fj = 40 min.','Para medir cuánto permanece el pedido en el sistema.',5);
  add('variables','lateness','Lj = Cj − dj','Lateness','Diferencia frente a la promesa','Puede ser negativa (anticipación), cero (exacto) o positiva (retraso).','Cj = 50 y dj = 60 → Lj = −10. Si Cj = 75 → Lj = 15.','Para distinguir adelantos de retrasos; no confundir con tardanza.',3);
  add('variables','tardiness','Tj = max(0, Cj − dj)','Tardiness','Solo el retraso','Nunca es negativa. Entregar antes no resta tardanza a otros pedidos.','Si Cj = 50 y dj = 60, Tj = 0; si Cj = 75, Tj = 15.','Para sumar o penalizar únicamente entregas tardías.',3);
  add('objectives','makespan','Cmax = max Cj','Makespan','Terminar toda la producción','Momento de finalización del último pedido. Lo queremos lo más pequeño posible.','Si una línea acaba al minuto 60 y otra al 80, Cmax = 80.','Para cerrar la producción pronto o liberar la planta.',1);
  add('objectives','total-completion-time','ΣCj','Total Completion Time','Terminar pronto, en conjunto','Suma los momentos de finalización de todos los trabajos. Con número fijo de trabajos equivale a minimizar su promedio.','C1 = 10 y C2 = 40 → ΣCj = 50. Otro orden con 30 y 40 suma 70.','Cuando importa atender pronto al conjunto de pedidos.',2);
  add('objectives','weighted-completion','ΣwjCj','Weighted Completion Time','Atender según el impacto','Suma las finalizaciones multiplicadas por la importancia de cada trabajo.','C1 = 10, w1 = 3; C2 = 40, w2 = 1 → 3×10 + 1×40 = 70.','Cuando esperar tiene un coste distinto según el cliente.',4);
  add('objectives','total-tardiness','ΣTj','Total Tardiness','Reducir los minutos de retraso','Suma los minutos tardíos. Un adelanto nunca compensa una tardanza.','Retrasos de 0, 10 y 5 min → ΣTj = 15.','Cuando interesa reducir el retraso acumulado.',3);
  add('objectives','weighted-tardiness','ΣwjTj','Weighted Tardiness','Proteger entregas importantes','Penaliza el retraso según la importancia del pedido.','T1 = 10, w1 = 4; T2 = 5, w2 = 1 → 40 + 5 = 45.','Cuando las consecuencias de llegar tarde difieren entre clientes.',8);
  add('objectives','late-jobs','ΣUj','Number of Tardy Jobs','Más clientes a tiempo','Uj = 1 si Cj > dj; Uj = 0 en otro caso. Solo contamos cuántos pedidos son tardíos.','Retrasos de 0, 1 y 40 min → ΣUj = 2 pedidos tardíos.','Cuando cuenta cumplir la mayor cantidad de compromisos.',11);
  add('objectives','load-balance','máx carga − mín carga','Load Balance','Repartir el trabajo','Diferencia entre los minutos de procesamiento de la máquina más cargada y la menos cargada. Incluye máquinas vacías.','Cargas 80 y 65 → diferencia 15 min. Pausas y ocio no son carga.','Para repartir esfuerzo entre equipos.',10);
  add('strategies','spt','pj ↑','Shortest Processing Time · SPT','Los cortos primero','Ordena de menor a mayor duración. En una máquina, con todos los pedidos disponibles al inicio y sin restricciones adicionales, minimiza ΣCj.','Duraciones 30, 10, 20 → 10, 20, 30.','Como regla óptima en ese caso básico; con llegadas, pausas o setups debes comparar.',2);
  add('strategies','edd','dj ↑','Earliest Due Date · EDD','La promesa más cercana','Ordena por fecha de entrega ascendente. En el caso básico de una máquina minimiza Lmax, la máxima lateness.','Entregas a los minutos 80, 40, 60 → atiende por 40, 60, 80.','Para compromisos cercanos. No garantiza minimizar ΣTj ni ΣUj.',3);
  add('strategies','wspt','pj / wj ↑','Weighted Shortest Processing Time · WSPT','Tiempo por importancia','Combina duración e importancia. Minimiza ΣwjCj en una máquina con disponibilidad inicial y sin restricciones adicionales.','A: 20/4 = 5; B: 10/1 = 10. El criterio coloca A primero.','Para finalizaciones ponderadas en ese caso básico; no equivale a ordenar solo por peso.',4);
  add('notation','alpha','α','Machine Environment','Dónde se produce','El primer campo indica la estructura de máquinas.','1: una máquina. Pm: m máquinas paralelas idénticas. P2: exactamente dos.','Para saber cuántas colas o rutas necesitas.',9);
  add('notation','beta','β','Constraints','Qué condiciones debemos respetar','El segundo campo describe restricciones adicionales. Un campo vacío mantiene los supuestos básicos de la notación.','rj: llegadas distintas. prec: precedencias entre trabajos. Sin pmtn, asumimos trabajos no interrumpibles.','Para detectar disponibilidad y dependencias. Las pausas se explicitan como calendarios en esta campaña.',5);
  add('notation','gamma','γ','Objective Function','Qué se quiere minimizar','El tercer campo identifica el objetivo. Las restricciones determinan qué puedes hacer; el objetivo determina qué solución es mejor.','Cmax, ΣCj, ΣwjCj, ΣTj, ΣwjTj o ΣUj.','Para elegir el criterio con el que comparar tus planes.',2);
  add('notation','flow-shop','Fm','Flow Shop','Todos siguen las mismas etapas','Cada trabajo recorre las mismas m máquinas en el mismo orden. Cada operación respeta la finalización de su etapa anterior.','Preparación → pasteurización → empaque para todos los productos.','Disponible próximamente como modo jugable.',12);
  add('notation','job-shop','Jm','Job Shop','Cada producto tiene su ruta','Los trabajos pueden recorrer las m máquinas en diferentes órdenes; hay que respetar sus precedencias y evitar solapamientos.','Yogurt: M1 → M3. Queso: M2 → M1.','Disponible próximamente como modo jugable.',12);
  add('notation','precedence','prec','Precedence Constraints','Una tarea depende de otra','Una operación o trabajo solo empieza cuando ha finalizado su predecesor. No es sinónimo de rj: una depende de otra tarea y la otra de un instante.','Empacar un lote requiere haber terminado su procesamiento.','Para planear dependencias; se estudia aquí como ampliación.',12);
  const examples=[
    {code:'1 || ΣCj',parts:['Una máquina','Sin restricciones adicionales','Minimizar la suma de finalizaciones'],translation:'Una máquina con los trabajos disponibles al inicio: buscamos que los pedidos terminen pronto, en conjunto.'},
    {code:'1 | rj | ΣTj',parts:['Una máquina','Pedidos disponibles en distintos momentos','Minimizar la suma de tardanzas'],translation:'Una máquina, llegadas distintas y objetivo de reducir los minutos totales de retraso.'},
    {code:'P2 || Cmax',parts:['Dos máquinas paralelas idénticas','Sin restricciones adicionales','Minimizar la última finalización'],translation:'Dos máquinas idénticas. Reparte los pedidos para terminar toda la producción pronto.'}
  ];
  const goals={
    'makespan':['Termina toda la producción lo antes posible.','Fin de producción'],
    'total-completion-time':['Consigue que los pedidos terminen pronto, en conjunto.','Finalizaciones acumuladas'],
    'weighted-completion':['Reduce la espera dando más importancia a los pedidos prioritarios.','Espera según importancia'],
    'total-tardiness':['Reduce los minutos totales de retraso.','Minutos de retraso'],
    'weighted-tardiness':['Evita especialmente el retraso de los pedidos importantes.','Retraso según importancia'],
    'late-jobs':['Entrega a tiempo la mayor cantidad de pedidos.','Pedidos tardíos'],
    'load-balance':['Reparte los minutos de trabajo de forma equilibrada.','Diferencia de carga']
  };
  const naturalLessons=[
    'Los tres pedidos ocupan 65 minutos en total. Sin pausas ni llegadas posteriores, cualquier orden termina a la misma hora.',
    'Un trabajo largo al principio hace esperar a todos los demás. Comenzar por los cortos reduce la finalización acumulada en esta misión.',
    'Mira cuándo prometiste cada entrega. Terminar un pedido antes no borra el retraso de otro.',
    'Importan la duración y la prioridad a la vez: busca atender mucho valor para el cliente con pocos minutos de máquina.',
    'La máquina espera al siguiente pedido de tu cola si aún no está disponible. Esa espera puede cambiar cuál es el mejor orden.',
    'Un trabajo no se puede quedar a medias durante el café. Busca pedidos que quepan completos antes de la pausa.',
    'Si solo quedan quince minutos antes del descanso, un pedido de diez puede aprovecharlos. Uno de treinta debe esperar.',
    'Cinco minutos tarde en un pedido muy importante pueden pesar más que una demora mayor en otro cliente.',
    'Las máquinas trabajan a la vez. El turno termina cuando finaliza la más ocupada: reparte los pedidos pensando en sus minutos.',
    'Repartir igual cantidad de pedidos no siempre equilibra el trabajo. Compara sus duraciones.',
    'En esta misión cuenta cuántos clientes reciben tarde, aunque el retraso de alguno sea pequeño.',
    'Cada línea tiene su propia limpieza. Combina ventanas disponibles, prioridades y fechas para organizar el turno.'
  ];
  const questions=[
    {id:'alpha',prompt:'¿Qué significa «1»?',options:['Una máquina','Un pedido','Una hora'],correct:0,explanation:'El primer campo describe el entorno: 1 significa una sola máquina.'},
    {id:'beta',prompt:'¿Qué indica «rj»?',options:['La importancia del pedido','El momento en que está disponible','La fecha prometida'],correct:1,explanation:'rj indica desde qué momento un pedido puede comenzar.'},
    {id:'gamma',prompt:'¿Qué intenta minimizar «ΣwjTj»?',options:['El tiempo total de procesamiento','El retraso teniendo en cuenta la importancia','La cantidad de máquinas'],correct:1,explanation:'Cada tardanza se multiplica por su peso y luego se suman esos valores.'}
  ];
  function grade(answers){return questions.map((q,i)=>({correct:answers[i]===q.correct,explanation:q.explanation,answer:q.options[q.correct]}));}
  const api={categories,entries,examples,goals,naturalLessons,questions,grade};root.DairyAcademy=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
