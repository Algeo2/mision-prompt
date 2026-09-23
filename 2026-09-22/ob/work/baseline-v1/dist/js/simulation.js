(function(root){
  'use strict';
  class ProductionSimulation{
    constructor({onTick,onComplete,onJobComplete}){this.onTick=onTick;this.onComplete=onComplete;this.onJobComplete=onJobComplete;this.frame=0;this.running=false;this.time=0;this.speed=1;}
    start(schedule,speed=1){this.stop();this.schedule=schedule;this.time=0;this.speed=speed;this.done=new Set();this.running=true;this.previous=performance.now();this.frame=requestAnimationFrame(t=>this.tick(t));}
    tick(now){if(!this.running)return;this.time=Math.min(this.schedule.metrics.cmax,this.time+Math.min(now-this.previous,200)*this.schedule.metrics.cmax/10000*this.speed);this.previous=now;this.emit();if(this.time>=this.schedule.metrics.cmax){this.running=false;this.onComplete();}else this.frame=requestAnimationFrame(t=>this.tick(t));}
    emit(){for(const o of this.schedule.operations)if(o.end<=this.time&&!this.done.has(o.id)){this.done.add(o.id);this.onJobComplete?.(o);}this.onTick(this.time,this.schedule);}
    pause(){this.running=false;cancelAnimationFrame(this.frame);}
    resume(){this.running=true;this.previous=performance.now();this.frame=requestAnimationFrame(t=>this.tick(t));}
    finish(){cancelAnimationFrame(this.frame);this.running=false;this.time=this.schedule.metrics.cmax;this.emit();this.onComplete();}
    stop(){cancelAnimationFrame(this.frame);this.running=false;}
  }
  let audio;
  function tone(kind,enabled){if(!enabled)return;try{audio ||= new (root.AudioContext||root.webkitAudioContext)();audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);osc.type='sine';osc.frequency.value=kind==='finish'?880:kind==='late'?260:kind==='place'?540:690;gain.gain.setValueAtTime(.045,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.16);osc.start();osc.stop(audio.currentTime+.17);}catch(e){/* Sound is optional when Web Audio is unavailable. */}}
  root.DairySimulation={ProductionSimulation,tone};
})(globalThis);
