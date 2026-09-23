const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const A=require('../dist/js/academy.js'),E=require('../dist/js/engine.js'),{levels}=require('../dist/js/levels.js');
function context(saved){const mem=new Map([['dairy-factory-v1',JSON.stringify(saved)]]);const c={DairyAcademy:A,DairyLevels:{levels},localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)}};vm.createContext(c);for(const file of ['storage','progress'])vm.runInContext(fs.readFileSync(require.resolve('../dist/js/'+file+'.js'),'utf8'),c);return c;}
test('original engine and score source remain byte-identical',()=>{
  const expected={engine:'58f198c87dd760600b7400b9e378627b28ca0142113f0841df8e07c195f0f1c9',scoring:'46a85f262bc749e614484d1d83670b2a5718dedf11ae854262df154e87f9f1db'};
  for(const [name,hash] of Object.entries(expected))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(require.resolve('../dist/js/'+name+'.js'))).digest('hex'),hash);
});
test('all 12 original level configurations are unchanged',()=>{assert.deepEqual(levels.slice(0,12),require('./legacy-levels.json'));});
test('academy entries have unique ids and complete structured content',()=>{
  assert.equal(new Set(A.entries.map(e=>e.id)).size,A.entries.length);assert.equal(A.categories.length,4);assert.equal(A.entries.length,25);
  for(const e of A.entries){for(const key of ['id','symbol','name','simpleName','definition','example','when'])assert.ok(e[key]?.length>0);assert.ok(A.categories.some(c=>c.id===e.category));assert.ok(levels.some(l=>l.id===e.unlockedAt));}
  for(const id of ['job','processing-time','release-date','due-date','weight','completion','flow','lateness','tardiness','makespan','total-completion-time','weighted-completion','total-tardiness','weighted-tardiness','late-jobs','spt','edd','wspt','alpha','beta','gamma','flow-shop','job-shop'])assert.ok(A.entries.some(e=>e.id===id));
});
test('quiz explains every incorrect answer and grades all correct answers',()=>{
  assert.ok(A.grade([0,1,1]).every(r=>r.correct));const wrong=A.grade([2,0,2]);assert.ok(wrong.every(r=>!r.correct&&r.explanation&&r.answer));assert.equal(wrong.length,3);
});
test('final notation corresponds to the actual scenario and independent schedule',()=>{
  const l=levels[12];assert.equal(l.notation,'1 | rj | ΣwjTj');assert.equal(l.mode,'single-machine');assert.equal(l.machines,1);assert.equal(l.objective,'weighted-tardiness');assert.equal(l.breaks.length,0);assert.ok(l.jobs.some(j=>j.r>0));
  const result=E.calculateSchedule(l,[['J1','J5','J2','J4','J3']]);assert.equal(result.metrics.weightedTardiness,5);assert.deepEqual(result.operations.map(o=>o.C),[20,30,45,70,105]);assert.deepEqual(result.operations.map(o=>o.T),[0,0,0,0,5]);assert.equal(E.solveLevel(l).evaluated,120);
});
test('version 1 progress migrates additively without losing previous scores',()=>{
  const old={version:1,results:{1:{stars:2,points:6800,bestObjective:65,attempts:3},12:{stars:1,points:2400,bestObjective:140,attempts:1}},lastLevel:12,settings:{sound:false,speed:4,reducedMotion:true}};
  const c=context(old),d=c.DairyStorage.load();assert.equal(d.version,1);assert.equal(d.results[1].points,6800);assert.equal(d.results[12].points,2400);assert.equal(d.settings.sound,false);assert.equal(d.settings.speed,4);assert.equal(d.settings.reducedMotion,true);assert.equal(c.DairyStorage.isUnlocked(d,13),true);assert.equal(d.conceptsRead.length,0);assert.ok(d.seenLevels.includes(12));
  c.DairyStorage.record(d,levels[12],{stars:3,points:8300,playerScore:5,hintsUsed:0,allOnTime:false});assert.equal(c.DairyStorage.load().results[13].bestObjective,5);
});
test('five distinct studied concepts earn student achievement without score changes',()=>{
  const c=context(null),d=c.DairyStorage.load(),P=c.DairyProgress;for(const id of ['job','processing-time','release-date','due-date','weight'])assert.equal(P.visit(d,id),true);P.visit(d,'job');assert.equal(d.conceptsRead.length,5);assert.equal(P.visit(d,'fake'),false);assert.ok(P.achievements.find(a=>a.id==='student').earned(d));assert.equal(c.DairyStorage.totals(d).points,0);
});
test('achievement conditions are retained across attempts and exclude demos',()=>{
  const c=context(null),d=c.DairyStorage.load(),S=c.DairyStorage,P=c.DairyProgress;
  S.record(d,levels[10],{stars:3,points:8500,playerScore:0,hintsUsed:0,allOnTime:true});S.record(d,levels[10],{stars:1,points:1000,playerScore:100,hintsUsed:3,allOnTime:false});assert.ok(P.achievements.find(a=>a.id==='timely').earned(d));assert.ok(P.achievements.find(a=>a.id==='independent').earned(d));
  S.record(d,levels[12],{stars:3,points:8300,playerScore:5,hintsUsed:0,practice:true});assert.equal(P.achievements.find(a=>a.id==='master').earned(d),false);
});
