const fs=require('node:fs');const file='outputs/dairy-factory/dist/js/app.js';let s=fs.readFileSync(file,'utf8');
const start=s.indexOf("  document.addEventListener('dragstart'");const end=s.indexOf("  document.addEventListener('toggle'",start);if(start<0||end<0)throw Error('Drag block missing');
s=s.slice(0,start)+"  DairyDragDrop.attach({onDrop:moveJob,isLocked:()=>state.running||!!state.guide||state.view!=='game'});\n"+s.slice(end);
s=s.replaceAll('draggable="${!state.running}"','draggable="false"');
fs.writeFileSync(file,s);
