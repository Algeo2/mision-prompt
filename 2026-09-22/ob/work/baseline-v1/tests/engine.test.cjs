const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const E=require('../dist/js/engine.js');
const {levels}=require('../dist/js/levels.js');
const {evaluateScore}=require('../dist/js/scoring.js');
const job=(id,p,r=0,d=100,w=1)=>({id,p,r,d,w});
const scenario=(jobs,extras={})=>({machines:1,mode:'single-machine',objective:'total-completion-time',jobs,breaks:[],...extras});

test('all 12 exact benchmarks and independent feasibility checks',()=>{
  const expected=[65,170,15,495,300,160,0,40,65,0,0,40];
  levels.forEach((level,i)=>{
    const best=E.solveLevel(level);
    assert.equal(best.value,expected[i],`level ${level.id}`);
    assert.equal(best.schedule.complete,true);
    assert.equal(E.validateSchedule(level,best.schedule).valid,true);
    assert.equal(best.queues.flat().length,level.jobs.length);
    assert.equal(new Set(best.queues.flat()).size,level.jobs.length);
    for(const o of best.schedule.operations){
      assert.ok(o.start>=o.r);
      assert.equal(o.end-o.start,o.p);
      for(const b of level.breaks.filter(b=>b.machine==null||b.machine===o.machine))assert.ok(o.end<=b.start||o.start>=b.end);
      for(const other of best.schedule.operations.filter(p=>p.machine===o.machine&&p.id!==o.id))assert.ok(o.end<=other.start||o.start>=other.end);
    }
    const score=evaluateScore(level,best.schedule,best);
    assert.equal(score.stars,3);assert.equal(score.efficiency,1);assert.ok(Number.isFinite(score.points));
  });
  assert.equal(E.solveLevel(levels[11]).evaluated,20160);
});
test('release dates: deliberate waiting may minimize sum completion',()=>{
  const l=scenario([job('A',4,0,5,1),job('B',1,1,2,2)]);
  const ab=E.calculateSchedule(l,[['A','B']]),ba=E.calculateSchedule(l,[['B','A']]);
  assert.equal(ab.metrics.cmax,5);assert.equal(ab.metrics.totalCompletion,9);assert.equal(ab.metrics.weightedCompletion,14);assert.equal(ab.metrics.totalTardiness,3);assert.equal(ab.metrics.weightedTardiness,6);assert.equal(ab.metrics.lateCount,1);
  assert.equal(ba.metrics.cmax,6);assert.equal(ba.metrics.totalCompletion,8);assert.equal(ba.metrics.weightedCompletion,10);assert.equal(ba.metrics.totalTardiness,1);assert.equal(ba.metrics.weightedTardiness,1);assert.equal(ba.metrics.totalFlow,7);
  assert.deepEqual(E.solveLevel(l).queues,[['B','A']]);
});
test('break boundaries, chained breaks and nonpreemption',()=>{
  const l=scenario([job('A',4),job('B',2)],{breaks:[{start:4,end:6}]});
  const s=E.calculateSchedule(l,[['A','B']]);assert.deepEqual(s.operations.map(o=>[o.start,o.end]),[[0,4],[6,8]]);assert.equal(s.metrics.idle,0);assert.equal(s.metrics.utilization,1);
  assert.equal(E.nextSlot(105,30,[{start:120,end:140}]),140);
  assert.equal(E.nextSlot(105,10,[{start:120,end:140}]),105);
  assert.equal(E.nextSlot(3,4,[{start:5,end:7},{start:8,end:10}]),10);
  assert.equal(E.nextSlot(3,4,[{start:5,end:9},{start:7,end:11}]),11);
});
test('parallel machines use independent clocks and include empty loads',()=>{
  const l=scenario([job('A',3),job('B',2),job('C',2)],{mode:'parallel-identical',machines:2,objective:'makespan'});
  const s=E.calculateSchedule(l,[['A'],['B','C']]);
  assert.equal(s.metrics.cmax,4);assert.equal(s.metrics.totalCompletion,9);assert.equal(s.metrics.imbalance,1);assert.equal(s.metrics.idle,1);assert.equal(s.metrics.utilization,7/8);
  const empty=E.calculateSchedule(l,[['A','B','C'],[]]);assert.equal(empty.metrics.imbalance,7);
});
test('machine-specific breaks do not block other machines',()=>{
  const l=scenario([job('A',10),job('B',10)],{mode:'parallel-identical',machines:2,breaks:[{start:0,end:20,machine:0}]});
  const s=E.calculateSchedule(l,[['A'],['B']]);assert.equal(s.operations[0].start,20);assert.equal(s.operations[1].start,0);
});
test('strictly negative lateness is not tardiness; exact deadline is on time',()=>{
  const l=scenario([job('A',2,0,2,3),job('B',1,0,5,1)]),s=E.calculateSchedule(l,[['A','B']]);
  assert.equal(s.operations[1].L,-2);assert.equal(s.operations[1].T,0);assert.equal(s.metrics.lateCount,0);assert.equal(s.metrics.totalLateness,-2);
});
test('invalid schedules, times, partial evaluation and unsupported modes reject',()=>{
  const l=levels[0];assert.throws(()=>E.calculateSchedule(l,[['J1','J1']]));assert.throws(()=>E.calculateSchedule(l,[['alien']]));assert.throws(()=>E.calculateSchedule(l,[]));
  assert.throws(()=>evaluateScore(l,E.calculateSchedule(l,[['J1']]),E.solveLevel(l)));
  assert.throws(()=>E.calculateSchedule({...l,mode:'job-shop'},[[]]));
  assert.throws(()=>E.calculateSchedule(scenario([job('A',.1,.2)]),[['A']]));
  const bad=E.calculateSchedule(l,[['J1']]);bad.operations[0].start=NaN;assert.equal(E.validateSchedule(l,bad).valid,false);
});
test('hidden due dates never change introductory points',()=>{
  const l=levels[8],b=E.solveLevel(l);
  const a=evaluateScore(l,E.calculateSchedule(l,[['J2','J3','J5','J4','J1'],[]]),b);
  const z=evaluateScore(l,E.calculateSchedule(l,[['J1','J3','J4','J5','J2'],[]]),b);
  assert.equal(a.points,z.points);assert.equal(a.breakdown.onTime,1000);
});
test('hints reduce points, not stars or correctness; solution is practice',()=>{
  const l=levels[1],b=E.solveLevel(l),a=evaluateScore(l,b.schedule,b),h=evaluateScore(l,b.schedule,b,1),p=evaluateScore(l,b.schedule,b,3,true);
  assert.equal(a.stars,h.stars);assert.equal(a.points-h.points,600);assert.equal(p.practice,true);
});
test('storage maintains independent bests and never farms points from replays',()=>{
  const memory=new Map(),ctx={localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(require.resolve('../dist/js/storage.js'),'utf8'),ctx);
  const S=ctx.DairyStorage,d=S.load(),l=levels[0];
  S.record(d,l,{stars:2,points:6000,playerScore:90,practice:false});S.record(d,l,{stars:3,points:5800,playerScore:65,practice:false});
  assert.equal(d.results[1].points,6000);assert.equal(d.results[1].stars,3);assert.equal(d.results[1].bestObjective,65);assert.equal(S.totals(d).points,6000);assert.equal(S.isUnlocked(d,2),true);
  S.record(d,levels[1],{stars:3,points:8500,playerScore:170,practice:true});assert.equal(d.results[2],undefined);
  assert.equal(S.load().results[1].points,6000);
  memory.set('dairy-factory-v1','{corrupt');assert.equal(Object.keys(S.load().results).length,0);
});
test('unavailable localStorage falls back to working in-memory progress',()=>{
  const ctx={localStorage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(require.resolve('../dist/js/storage.js'),'utf8'),ctx);
  const S=ctx.DairyStorage,d=S.load();assert.equal(S.available,false);S.record(d,levels[0],{stars:1,points:1000,playerScore:65});assert.equal(d.results[1].points,1000);
});
test('guided chronological insertion reproduces exact full queue schedules',()=>{
  for(const l of levels){const b=E.solveLevel(l),steps=[...b.schedule.operations].sort((a,b)=>a.start-b.start||a.machine-b.machine||a.id.localeCompare(b.id)),q=Array.from({length:l.machines},()=>[]);for(const step of steps){q[step.machine].push(step.id);const partial=E.calculateSchedule(l,q),o=partial.operations.find(o=>o.id===step.id);assert.equal(o.start,step.start);assert.equal(o.end,step.end);}assert.equal(E.calculateSchedule(l,q).objective,b.value);}
});
