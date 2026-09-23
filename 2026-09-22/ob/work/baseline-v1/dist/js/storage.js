(function(root){
  'use strict';
  const KEY='dairy-factory-v1';
  const defaults=()=>({version:1,results:{},settings:{sound:true,reducedMotion:false,speed:1},lastLevel:1});
  let available=true;
  function load(){
    try{
      const value=JSON.parse(localStorage.getItem(KEY)||'null');
      if(!value||value.version!==1)return defaults();
      const clean=defaults();
      for(const [key,r] of Object.entries(value.results||{})) if(/^([1-9]|1[0-2])$/.test(key)&&r&&Number.isFinite(r.points)&&r.points>=0&&r.points<=8500&&Number.isInteger(r.stars)&&r.stars>=1&&r.stars<=3&&Number.isFinite(r.bestObjective)&&r.bestObjective>=0)clean.results[key]={...r,points:Math.round(r.points)};
      clean.settings.sound=value.settings?.sound!==false;
      clean.settings.reducedMotion=value.settings?.reducedMotion===true;
      clean.settings.speed=[1,2,4].includes(value.settings?.speed)?value.settings.speed:1;
      clean.lastLevel=Number.isInteger(value.lastLevel)&&value.lastLevel>=1&&value.lastLevel<=12?value.lastLevel:1;
      return clean;
    }catch(e){available=false;return defaults();}
  }
  function save(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true;}catch(e){available=false;return false;}}
  function record(data,level,result){
    if(result.practice)return data;
    const old=data.results[level.id];
    data.results[level.id]={stars:Math.max(old?.stars||0,result.stars),points:Math.max(old?.points||0,result.points),bestObjective:Math.min(old?.bestObjective??Infinity,result.playerScore),attempts:(old?.attempts||0)+1};
    data.lastLevel=Math.min(12,level.id+1); save(data);return data;
  }
  function isUnlocked(data,id){return id===1||!!data.results[id-1];}
  function totals(data){const r=Object.values(data.results);return{completed:r.length,stars:r.reduce((s,x)=>s+x.stars,0),points:r.reduce((s,x)=>s+x.points,0)};}
  root.DairyStorage={load,save,record,isUnlocked,totals,defaults,get available(){return available;}};
})(globalThis);
