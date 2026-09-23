(function(root){
  'use strict';
  function evaluateScore(level,schedule,benchmark,hints=0,revealed=false){
    if(!schedule.complete)throw new Error('Completa todos los pedidos antes de evaluar.');
    const playerScore=schedule.objective, optimalScore=benchmark.value;
    // Additive normalization works for optima of zero (tardiness, imbalance, late count).
    const scale=level.objective==='late-jobs'?level.jobs.length:level.jobs.reduce((s,j)=>s+j.p*(level.objective.startsWith('weighted')?j.w:1),0);
    const efficiency=Math.max(0,Math.min(1,1-(playerScore-optimalScore)/Math.max(1,scale)));
    const optimal=Math.abs(playerScore-optimalScore)<1e-8;
    const stars=efficiency>=.98?3:efficiency>=.80?2:1;
    // Intro missions have no deadline decision, so their delivery bonus is fixed.
    const deliveryFraction=level.show?.includes('d')?schedule.metrics.onTime/level.jobs.length:1;
    const breakdown={completion:1000,efficiency:Math.round(efficiency*5000),onTime:Math.round(deliveryFraction*1000),independent:hints===0?500:0,optimal:optimal?1000:0,hints:-hints*100};
    const points=Math.max(1000,Object.values(breakdown).reduce((a,b)=>a+b,0));
    return {playerScore,optimalScore,efficiency,scale,optimal,stars,points,breakdown,practice:revealed};
  }
  const api={evaluateScore};root.DairyScoring=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
