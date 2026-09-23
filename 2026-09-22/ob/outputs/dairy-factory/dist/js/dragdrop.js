/* Pointer-based dragging works with mouse, pen and touch, with click/keyboard
   placement remaining available. No application state is stored in this layer. */
(function(root){
  'use strict';
  function attach({onDrop,isLocked}){
    let gesture=null,ghost=null,suppressClick=false;
    function cleanup(){ghost?.remove();ghost=null;document.querySelectorAll('.drop-over,.dragging').forEach(el=>el.classList.remove('drop-over','dragging'));document.body.classList.remove('is-dragging');gesture=null;}
    document.addEventListener('dragstart',event=>{if(event.target.closest('[data-job],[data-drag-job]'))event.preventDefault();});
    document.addEventListener('pointerdown',event=>{
      if(event.button!==0||isLocked()||event.target.closest('.queue-tools'))return;
      const source=event.target.closest('[data-drag-job],.job-card[data-job]');if(!source)return;
      gesture={source,id:source.dataset.dragJob||source.dataset.job,x:event.clientX,y:event.clientY,pointer:event.pointerId,active:false};
      source.setPointerCapture(event.pointerId);
    });
    document.addEventListener('pointermove',event=>{
      if(!gesture||event.pointerId!==gesture.pointer||isLocked())return;
      if(!gesture.active&&Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)<7)return;
      event.preventDefault();
      if(!gesture.active){gesture.active=true;ghost=gesture.source.cloneNode(true);ghost.removeAttribute('id');ghost.classList.add('drag-preview');ghost.removeAttribute('draggable');ghost.setAttribute('aria-hidden','true');ghost.style.width=Math.min(190,gesture.source.getBoundingClientRect().width)+'px';document.body.appendChild(ghost);gesture.source.classList.add('dragging');document.body.classList.add('is-dragging');}
      ghost.style.left=event.clientX+12+'px';ghost.style.top=event.clientY+12+'px';
      document.querySelectorAll('.drop-over').forEach(el=>el.classList.remove('drop-over'));
      const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop-machine]');target?.classList.add('drop-over');
      if(event.clientY>window.innerHeight-45)window.scrollBy(0,14);else if(event.clientY<45)window.scrollBy(0,-14);
    },{passive:false});
    document.addEventListener('pointerup',event=>{
      if(!gesture||event.pointerId!==gesture.pointer)return;
      const {active,id}=gesture,target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop-machine]');
      if(gesture.source.hasPointerCapture(event.pointerId))gesture.source.releasePointerCapture(event.pointerId);
      cleanup();
      if(active){suppressClick=true;setTimeout(()=>suppressClick=false,0);event.preventDefault();if(target&&!isLocked())onDrop(id,Number(target.dataset.dropMachine),Number(target.dataset.dropIndex));}
    });
    document.addEventListener('pointercancel',cleanup);
    document.addEventListener('keydown',event=>{if(event.key==='Escape')cleanup();});
    document.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();}},{capture:true});
  }
  root.DairyDragDrop={attach};
})(globalThis);
