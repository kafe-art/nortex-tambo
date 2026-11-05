import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mountSeedExperience,getCreatedSeed} from './dist/seed-experience.js';

// Minimal DOM doubles exercise lifecycle and permission-to-create behavior.
// Visual layout still requires a real browser review.
class Element {
  constructor(){this.isConnected=true;this.nodes=new Map();this.dataset={};this.classList={add(){},toggle(){}};this.listeners={};}
  set innerHTML(value){this.html=value;this.nodes.clear();}
  get innerHTML(){return this.html||'';}
  querySelector(selector){if(selector==='.seed-start'&&this.html?.includes('seed-created'))return null;if(!this.nodes.has(selector))this.nodes.set(selector,new Element());return this.nodes.get(selector);}
  querySelectorAll(selector){return selector==='[data-copy]'?[]:[new Element(),new Element(),new Element(),new Element()];}
  addEventListener(name,fn){this.listeners[name]=fn;}
  setAttribute(){} focus(){} showModal(){} close(){} remove(){this.isConnected=false;}
}
test('seed is created only on completion; cancellation, re-entry and field changes are isolated',t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  let dialog,reduce=false;
  const body=new Element();body.append=el=>{dialog=el;};
  t.mock.method(globalThis,'setTimeout',globalThis.setTimeout);
  const originals={document:globalThis.document,MutationObserver:globalThis.MutationObserver,matchMedia:globalThis.matchMedia,window:globalThis.window};
  globalThis.document={body,createElement:()=>new Element(),querySelector:()=>dialog?.isConnected?dialog:null};
  globalThis.MutationObserver=class{observe(){}disconnect(){}};
  globalThis.matchMedia=()=>({matches:reduce});globalThis.window={dispatchEvent(){}};
  t.after(()=>{for(const [name,value]of Object.entries(originals)){if(value===undefined)delete globalThis[name];else globalThis[name]=value;}});
  const farm={name:'Lifecycle test',crop:'Mango Kent',soil:'franco',moisture:24,surface:31,days:4,rain:10};
  const host=new Element();mountSeedExperience(host,farm);
  assert.equal(getCreatedSeed(farm),undefined);
  host.querySelector('.seed-start').listeners.click();
  assert.equal(getCreatedSeed(farm),undefined,'opening is not completion');
  dialog.querySelector('.seed-close').onclick();t.mock.timers.tick(10000);
  assert.equal(getCreatedSeed(farm),undefined,'cancelled timers must not create a seed');
  host.querySelector('.seed-start').listeners.click();
  t.mock.timers.tick(5600);assert.equal(getCreatedSeed(farm),undefined);
  t.mock.timers.tick(2800);assert.ok(getCreatedSeed(farm));
  const created=getCreatedSeed(farm);dialog.querySelector('.seed-skip').onclick();
  const remount=new Element();mountSeedExperience(remount,farm);
  assert.match(remount.innerHTML,/LISTA PARA COMPARTIR/);
  assert.equal(getCreatedSeed(farm),created);
  remount.querySelector('.seed-replay').listeners.click();
  t.mock.timers.tick(8400);
  assert.equal(getCreatedSeed(farm),created,'replay preserves the existing seed');
  dialog.querySelector('.seed-close').onclick();
  const changed={...farm,moisture:12};mountSeedExperience(host,changed);
  assert.equal(getCreatedSeed(changed),undefined);
  host.querySelector('.seed-start').listeners.click();dialog.querySelector('.seed-skip').onclick();
  assert.ok(getCreatedSeed(changed),'skip completes creation');
  dialog.querySelector('.seed-close').onclick();
  reduce=true;const reduced={...farm,name:'Reduced motion'};mountSeedExperience(host,reduced);
  assert.equal(getCreatedSeed(reduced),undefined);
  host.querySelector('.seed-start').listeners.click();assert.ok(getCreatedSeed(reduced));
  dialog.querySelector('.seed-close').onclick();
});
