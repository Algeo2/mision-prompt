(function(root){
  const achievements=[
    {id:'first',name:'Primer turno',description:'Completa tu primera misión.',earned:d=>Object.keys(d.results).length>0},
    {id:'timely',name:'Justo a tiempo',description:'Completa una misión de entregas sin pedidos tardíos.',earned:d=>Object.values(d.results).some(r=>r.onTime===true)},
    {id:'perfect',name:'Producción perfecta',description:'Obtén tres estrellas.',earned:d=>Object.values(d.results).some(r=>r.stars===3)},
    {id:'independent',name:'Sin ayuda',description:'Obtén tres estrellas sin utilizar pistas.',earned:d=>Object.values(d.results).some(r=>r.noHintsThree===true)},
    {id:'student',name:'Estudiante aplicado',description:'Consulta cinco conceptos de la Academia.',earned:d=>new Set((d.conceptsRead||[]).filter(id=>root.DairyAcademy.entries.some(e=>e.id===id))).size>=5},
    {id:'master',name:'Maestro de la Secuenciación',description:'Completa el examen del jefe de planta.',earned:d=>!!d.results[13]}
  ];
  function visit(data,id){if(!root.DairyAcademy.entries.some(e=>e.id===id))return false;data.conceptsRead=[...new Set([...(data.conceptsRead||[]),id])];root.DairyStorage.save(data);return true;}
  function discover(data,level){data.seenLevels=[...new Set([...(data.seenLevels||[]),level])];root.DairyStorage.save(data);}
  function isDiscovered(data,entry){return (data.seenLevels||[]).includes(entry.unlockedAt)||!!data.results[entry.unlockedAt];}
  root.DairyProgress={achievements,visit,discover,isDiscovered};
})(globalThis);
