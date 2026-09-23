/* Pure scheduling engine. All times are minutes since the start of the shift.
   Intervals are half-open [start,end): finishing at a break start is allowed. */
(function (root) {
  'use strict';
  const MODES = new Map();
  const OBJECTIVES = {
    'makespan': { label: 'Fin de producción', symbol: 'Cmax', unit: 'min', key: 'cmax' },
    'total-completion-time': { label: 'Tiempo acumulado', symbol: 'ΣCj', unit: 'min', key: 'totalCompletion' },
    'weighted-completion': { label: 'Tiempo por prioridad', symbol: 'ΣwjCj', unit: 'min·peso', key: 'weightedCompletion' },
    'total-tardiness': { label: 'Retraso total', symbol: 'ΣTj', unit: 'min', key: 'totalTardiness' },
    'weighted-tardiness': { label: 'Retraso por prioridad', symbol: 'ΣwjTj', unit: 'min·peso', key: 'weightedTardiness' },
    'late-jobs': { label: 'Pedidos tardíos', symbol: 'ΣUj', unit: 'pedidos', key: 'lateCount' },
    'load-balance': { label: 'Diferencia de carga', symbol: 'Δ carga', unit: 'min', key: 'imbalance' }
  };
  function validateLevel(level) {
    if (!Number.isInteger(level.machines) || level.machines < 1) throw new Error('Número de máquinas inválido.');
    if (!OBJECTIVES[level.objective]) throw new Error('Objetivo desconocido.');
    if (!Array.isArray(level.jobs) || !level.jobs.length) throw new Error('Faltan pedidos.');
    const ids = new Set();
    for (const j of level.jobs) {
      if (ids.has(j.id)) throw new Error('Pedido duplicado.');
      ids.add(j.id);
      if (![j.p,j.r,j.d].every(Number.isInteger) || !Number.isFinite(j.w) || j.p <= 0 || j.r < 0 || j.d < 0 || j.w <= 0) throw new Error('Usa minutos enteros y prioridades positivas.');
    }
    for (const b of level.breaks || []) {
      if (!Number.isInteger(b.start) || !Number.isInteger(b.end) || b.start < 0 || b.end <= b.start || (b.machine != null && (!Number.isInteger(b.machine) || b.machine < 0 || b.machine >= level.machines))) throw new Error('Descanso inválido.');
    }
    return true;
  }
  function nextSlot(earliest, duration, breaks) {
    let start = earliest;
    for (const b of [...breaks].sort((a,b) => a.start - b.start)) {
      if (start < b.end && start + duration > b.start) start = b.end;
    }
    return start;
  }
  function blockedDuration(breaks, end) {
    let total = 0, last = 0;
    for (const b of [...breaks].sort((a,b) => a.start-b.start)) {
      const a = Math.max(last,b.start), z = Math.min(end,b.end);
      if (z > a) total += z-a;
      last = Math.max(last,z);
    }
    return total;
  }
  function calculateMetrics(operations, level) {
    const cmax = Math.max(0,...operations.map(o=>o.end));
    const loads = Array.from({length:level.machines},(_,m)=>operations.filter(o=>o.machine===m).reduce((s,o)=>s+o.p,0));
    const totals = operations.reduce((s,o)=>{
      s.totalCompletion+=o.C; s.totalFlow+=o.F; s.totalLateness+=o.L;
      s.totalTardiness+=o.T; s.weightedCompletion+=o.w*o.C; s.weightedTardiness+=o.w*o.T;
      s.lateCount+=Number(o.T>0); return s;
    },{totalCompletion:0,totalFlow:0,totalLateness:0,totalTardiness:0,weightedCompletion:0,weightedTardiness:0,lateCount:0});
    const available = Array.from({length:level.machines},(_,m)=>cmax-blockedDuration((level.breaks||[]).filter(b=>b.machine==null||b.machine===m),cmax)).reduce((a,b)=>a+b,0);
    const processing = loads.reduce((a,b)=>a+b,0);
    return {...totals,cmax,loads,completed:operations.length,onTime:operations.length-totals.lateCount,imbalance:Math.max(...loads)-Math.min(...loads),idle:Math.max(0,available-processing),utilization:available?processing/available:0};
  }
  function queueSchedule(level, queues) {
    const jobs = new Map(level.jobs.map(j=>[j.id,j]));
    const operations = [];
    queues.forEach((queue,machine)=>{
      let free = 0;
      const breaks = (level.breaks||[]).filter(b=>b.machine==null||b.machine===machine);
      queue.forEach(id=>{
        const j = jobs.get(id);
        const start=nextSlot(Math.max(free,j.r),j.p,breaks), end=start+j.p;
        operations.push({...j,machine,start,end,C:end,F:end-j.r,L:end-j.d,T:Math.max(0,end-j.d)});
        free=end;
      });
    });
    const metrics=calculateMetrics(operations,level);
    return {operations,metrics,objective:metrics[OBJECTIVES[level.objective].key],complete:operations.length===level.jobs.length};
  }
  MODES.set('single-machine',queueSchedule);
  MODES.set('parallel-identical',queueSchedule);
  // Extensions register their own decoder, preserving the metric/evaluation contract.
  function registerMode(mode,decoder) { if(typeof decoder!=='function') throw new Error('Se requiere un decodificador.'); MODES.set(mode,decoder); }
  function calculateSchedule(level, queues) {
    validateLevel(level);
    if (!Array.isArray(queues)||queues.length!==level.machines||queues.some(q=>!Array.isArray(q))) throw new Error('Colas de máquinas inválidas.');
    const ids=queues.flat(), allowed=new Set(level.jobs.map(j=>j.id));
    if (new Set(ids).size!==ids.length || ids.some(id=>!allowed.has(id))) throw new Error('Un pedido debe aparecer como máximo una vez.');
    const decoder=MODES.get(level.mode);
    if(!decoder) throw new Error('Este modo todavía no está implementado.');
    return decoder(level,queues);
  }
  function validateSchedule(level, schedule) {
    const errors=[];
    const all=schedule.operations;
    if(new Set(all.map(o=>o.id)).size!==all.length) errors.push('Pedidos repetidos.');
    for(const o of all) {
      const source=level.jobs.find(j=>j.id===o.id);
      if(!source || !Number.isInteger(o.machine)||o.machine<0||o.machine>=level.machines) {errors.push('Operación desconocida.');continue;}
      if(!Number.isInteger(o.start)||!Number.isInteger(o.end)||o.start<source.r||o.end-o.start!==source.p) errors.push(o.id+': disponibilidad o duración incorrecta.');
      if((level.breaks||[]).some(b=>(b.machine==null||b.machine===o.machine)&&o.start<b.end&&o.end>b.start)) errors.push(o.id+': atraviesa un descanso.');
    }
    for(let m=0;m<level.machines;m++) {
      const row=all.filter(o=>o.machine===m).sort((a,b)=>a.start-b.start);
      for(let i=1;i<row.length;i++) if(row[i].start<row[i-1].end) errors.push('Solapamiento en máquina '+m);
    }
    return {valid:errors.length===0,errors};
  }
  const cache=new Map();
  function solveLevel(level) {
    validateLevel(level);
    if (!['single-machine','parallel-identical'].includes(level.mode)) throw new Error('Este modo requiere su propio solver.');
    if(level.jobs.length>7 || level.machines>3 || (level.machines>1 && level.jobs.length>6)) throw new Error('Escenario grande: configura un benchmark verificado.');
    const key=JSON.stringify(level);
    if(cache.has(key))return cache.get(key);
    let best=null, evaluated=0;
    const ids=level.jobs.map(j=>j.id);
    // Permutations + weak compositions enumerate every ordered machine partition.
    // n! * binomial(n+m-1,m-1); at most 20,160 candidates for 6 jobs / 3 machines.
    function partition(order,m,offset,queues){
      if(m===level.machines-1){
        const q=[...queues,order.slice(offset)],s=queueSchedule(level,q); evaluated++;
        if(!best||s.objective<best.value||(s.objective===best.value&&(s.metrics.totalTardiness<best.schedule.metrics.totalTardiness||(s.metrics.totalTardiness===best.schedule.metrics.totalTardiness&&s.metrics.cmax<best.schedule.metrics.cmax)))) best={value:s.objective,queues:q,schedule:s,exact:true};
        return;
      }
      for(let end=offset;end<=order.length;end++)partition(order,m+1,end,[...queues,order.slice(offset,end)]);
    }
    function permute(prefix,remaining){if(!remaining.length){partition(prefix,0,0,[]);return;}remaining.forEach((id,i)=>permute([...prefix,id],[...remaining.slice(0,i),...remaining.slice(i+1)]));}
    permute([],ids); best.evaluated=evaluated;cache.set(key,best);return best;
  }
  const api={OBJECTIVES,validateLevel,nextSlot,calculateMetrics,calculateSchedule,validateSchedule,solveLevel,registerMode};
  root.DairyEngine=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
