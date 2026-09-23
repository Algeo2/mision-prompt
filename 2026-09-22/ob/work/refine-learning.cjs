const fs=require('node:fs');const file='outputs/dairy-factory/dist/js/app.js';let s=fs.readFileSync(file,'utf8');
const replace=(a,b)=>{if(!s.includes(a))throw Error('Missing '+a.slice(0,80));s=s.replace(a,b);};
replace("guide:null,stuck:false,idleSeconds:0", "guide:null,stuck:false,idleSeconds:0,instructionsOpen:false");
replace("${state.level.id===1?'open':''}","${state.instructionsOpen?'open':''}");
replace("if(state.level.id!==1)return '';", "if(state.level.id!==1||state.guide)return '';");
replace("state.guide=null;resetIdle();state.level=level;", "state.guide=null;resetIdle();state.instructionsOpen=false;state.level=level;");
replace("Esta decisión forma parte de una secuencia óptima completa; no es una regla que siempre funcione por separado.", "");
replace("explanation+='';", "const contributions={'makespan':`El último pedido del plan completo termina a las ${time(g.benchmark.schedule.metrics.cmax)}.`, 'total-completion-time':`Este pedido aporta Cj = ${o.C} min a la suma de finalizaciones.`, 'weighted-completion':`Su aporte ponderado es ${o.w} × ${o.C} = ${o.w*o.C}.`, 'total-tardiness':`Aporta ${o.T} min al retraso total. Terminar antes no resta el retraso de otro pedido.`, 'weighted-tardiness':`Su retraso ponderado es ${o.w} × ${o.T} = ${o.w*o.T}.`, 'late-jobs':o.T?'Este pedido suma 1 al número de entregas tardías.':'Este pedido no suma entregas tardías.', 'load-balance':`Añade ${o.p} min de carga a esta máquina; las esperas y pausas no cuentan como trabajo.`};explanation+=contributions[state.level.objective];");
replace("Observa una solución óptima, construida pedido por pedido.","Vamos a recorrer un plan completo óptimo. Sus decisiones funcionan en conjunto; puede haber otros planes igual de buenos.");
replace('<p class="guide-explanation" aria-live="polite">${explanation}</p>', '<p class="guide-explanation" aria-live="polite">${explanation}</p><div class="guide-timeline">${gantt(schedule)}</div>');
replace("function render(){({home,levels:levelMap,progress,concepts,settings,game}[state.view]||home)();}", `function render(){
    const focused=document.activeElement;let selector=null;
    if(focused&&app.contains(focused)){for(const key of ['data-job','data-action','data-move','data-remove','data-place-machine','data-nav']){if(focused.hasAttribute(key)){selector='['+key+'="'+CSS.escape(focused.getAttribute(key))+'"]';if(key==='data-move')selector+='[data-direction="'+focused.getAttribute('data-direction')+'"]';break;}}}
    ({home,levels:levelMap,progress,concepts,settings,game}[state.view]||home)();
    if(state.view==='game'&&state.guide){app.querySelectorAll('.orders-panel button,.queue-panel button').forEach(el=>el.disabled=true);app.querySelectorAll('[draggable]').forEach(el=>el.draggable=false);const current=state.guide.operations[state.guide.index-1];if(current)app.querySelectorAll('.guide-timeline [data-operation="'+current.id+'"]').forEach(el=>el.classList.add('guide-current'));}
    if(selector){const target=app.querySelector(selector);if(target&&!target.disabled)target.focus({preventScroll:true});}
  }`);
replace("document.addEventListener('keydown',event=>", "document.addEventListener('toggle',event=>{if(event.target.matches?.('.quick-instructions')&&event.target.isConnected)state.instructionsOpen=event.target.open;},true);\n  document.addEventListener('keydown',event=>");
replace('completados</span><span><b>${schedule.metrics.onTime}/${l.jobs.length}</b>a tiempo</span>', 'completados</span>${l.show.includes(\'d\')?`<span><b>${schedule.metrics.onTime}/${l.jobs.length}</b>a tiempo</span>`:\'\'}');
replace('· A tiempo: +${r.breakdown.onTime}', '· ${l.show.includes(\'d\')?\'A tiempo\':\'Bono de iniciación\'}: +${r.breakdown.onTime}');
fs.writeFileSync(file,s);
