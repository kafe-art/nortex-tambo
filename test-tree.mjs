import {test} from 'node:test';
import assert from 'node:assert/strict';
import {treeMeaning,treePicture,friendlyForecast,mountTreeLab} from './dist/tree-lab.js';
const farm={crop:'Mango Kent',stage:'floración',moisture:24,surface:31,days:4,rain:8};
test('missing readings remain unknown and dry/hot scenarios are distinguished',()=>{
 assert.equal(treeMeaning({...farm,moisture:null}).missing.length,1);
 assert.equal(treeMeaning({...farm,moisture:10}).dry,true);
 assert.equal(treeMeaning({...farm,surface:39}).hot,true);
 assert.equal(treeMeaning(farm).dry,false);
 assert.match(treePicture(farm,0),/Semilla/);
 assert.match(treePicture(farm,5),/Árbol adulto/);
 assert.match(treePicture(farm,5),/no predicción de crecimiento/);
});
test('forecast uses actual model contract, dated scenario and honest error interpretation',()=>{
 const model={scenario:{origin:'2025-12-31',date:'2026-01-01',rf:32,baseline:31},evaluation:{n:92,rf:{mae:1.2,rmse:1.6},baseline:{mae:1.1}},model:{config:{trees:40},importance:[{feature:'Tmax t',value:.5}]}};
 const html=friendlyForecast(model);
 assert.match(html,/32.0 °C/);assert.match(html,/2026-01-01/);
 assert.match(html,/no mejoró/);assert.match(html,/no es un margen garantizado/);
 assert.match(html,/40 árboles/);assert.match(html,/Calor del último día/);
 assert.doesNotMatch(html,/NaN|undefined|±/);
 assert.match(friendlyForecast({...model,scenario:null}),/Faltan días/);
});
test('simulator uses the supplied field readings and emits only on edits',()=>{
 const nodes=new Map();const make=()=>({value:'',textContent:'',innerHTML:'',dataset:{},setAttribute(){}});
 for(const k of ['moisture','surface','days','rain']){const n=make();n.dataset.input=k;nodes.set(`[data-input="${k}"]`,n);}
 const container={innerHTML:'',querySelector(s){if(!nodes.has(s))nodes.set(s,make());return nodes.get(s);},querySelectorAll(s){return s==='[data-input]'?[...nodes.entries()].filter(([k])=>k.startsWith('[data-input')).map(([,n])=>n):[];}};
 let patch=null;mountTreeLab(container,farm,{onChange:p=>patch=p});
 assert.equal(patch,null);assert.equal(nodes.get('[data-value="moisture"]').textContent,'24 %');
 const slider=nodes.get('[data-input="moisture"]');slider.value='12';slider.oninput();
 assert.equal(patch.moisture,12);assert.equal(patch.surface,31);assert.equal(farm.moisture,24);
 nodes.get('[data-reset]').onclick();assert.equal(patch.moisture,24);
});
