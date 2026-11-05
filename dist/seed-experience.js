import {computeSeedProfile,buildSeedSVG} from './visual-sim.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seeds=new Map();
const key=(farm,lab)=>JSON.stringify([farm,!!lab]);
export const getCreatedSeed=(farm,lab=false)=>seeds.get(key(farm,lab));
const sprout=`<svg viewBox="0 0 320 300" aria-hidden="true"><ellipse class="seed-earth" cx="160" cy="239" rx="100" ry="16"/><g class="seed-roots"><path d="M160 215v55m0-28-27 15m27-3 28 17"/></g><path class="seed-stem" d="M160 225Q143 173 165 114"/><path class="seed-leaf seed-left" d="M158 173Q95 176 102 119Q151 122 158 173"/><path class="seed-leaf seed-right" d="M159 150Q215 150 220 98Q166 99 159 150"/><path class="seed-kernel" d="M160 233C118 217 134 181 160 169C186 181 202 217 160 233Z"/><g class="seed-drops"><circle cx="123" cy="80" r="4"/><circle cx="193" cy="48" r="3"/><circle cx="163" cy="65" r="5"/></g></svg>`;

export function mountSeedExperience(host,farm,lab=false){
  // Capture the exact scenario requested. Later field edits need a new seed.
  const snapshot=JSON.parse(JSON.stringify(farm));
  function render(){
    const seed=getCreatedSeed(snapshot,lab);
    host.innerHTML=`<section class="seed-invitation ${seed?'seed-created':''}"><div class="seed-preview" aria-hidden="true">${seed?buildSeedSVG(snapshot,lab,180):sprout}</div><div><span class="seed-eyebrow">SEMILLA NORTEX · ${seed?'LISTA PARA COMPARTIR':'NACE CUANDO TÚ DECIDES'}</span><h2>${seed?'Una pequeña semilla. La historia de tu campo.':'Dale vida a la historia de tu tierra.'}</h2><p>${seed?'Tu escenario ya tiene una clave y un patrón visual. Puedes copiar un resumen para conversarlo con tu técnico.':'Reúne el estado de tu cultivo, el agua y el suelo en una semilla visual. Tú eliges cuándo crearla.'}</p>${seed?`<div class="seed-code">${esc(seed.code)}</div><div class="seed-traits">${seed.traits.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="seed-actions"><button type="button" data-copy="code">Copiar clave</button><button type="button" data-copy="summary">Copiar resumen para técnico</button><button type="button" class="seed-replay">Volver a vivir la experiencia</button></div>`:'<button type="button" class="seed-start">Crear mi semilla <span aria-hidden="true">↗</span></button><small class="seed-duration">Una breve experiencia de germinación · puedes saltarla</small>'}<p class="seed-disclaimer">Clave visual del escenario. No concede acceso a una finca ni recupera su expediente en otro dispositivo.</p><span class="seed-feedback" role="status"></span></div></section>`;
    host.querySelector('.seed-start')?.addEventListener('click',begin);
    host.querySelector('.seed-replay')?.addEventListener('click',begin);
    host.querySelectorAll('[data-copy]').forEach(button=>button.onclick=async()=>{
      const text=button.dataset.copy==='code'?seed.code:`Semilla NORTEX: ${seed.code}\nParcela: ${snapshot.name||'Escenario agrícola'}\nCultivo: ${snapshot.crop} · ${snapshot.stage}\nAgua: ${seed.waterState.label}\nTemperatura: ${seed.heatState.level}\nSuelo declarado: ${snapshot.soil}\n${lab?'Con registro de laboratorio':'Sin registro de laboratorio'}\nResumen orientativo del escenario; verificar en campo. La clave no permite acceder al expediente.`;
      try{await navigator.clipboard.writeText(text);host.querySelector('.seed-feedback').textContent=button.dataset.copy==='code'?'Clave copiada.':'Resumen copiado. Listo para compartir.';}
      catch{host.querySelector('.seed-feedback').textContent='No se pudo copiar. Selecciona y copia el texto de abajo.';let area=host.querySelector('textarea');if(!area){area=document.createElement('textarea');area.readOnly=true;area.setAttribute('aria-label','Texto para copiar manualmente');host.append(area);}area.value=text;area.focus();area.select();}
    });
  }
  function begin(){
    if(document.querySelector('.seed-ritual'))return;
    const trigger=host.querySelector('.seed-start')||host.querySelector('.seed-replay');
    const dialog=document.createElement('dialog');dialog.className='seed-ritual';
    dialog.setAttribute('aria-labelledby','seed-ritual-title');
    const motes=Array.from({length:48},(_,i)=>`<i style="--x:${(i*37)%100}%;--y:${(i*61)%100}%;--delay:-${(i%13)*.7}s;--duration:${7+i%7}s;--size:${i%4+1}px"></i>`).join('');
    const terrain=`<svg viewBox="0 0 1440 500" preserveAspectRatio="none"><g fill="none" stroke="currentColor">${Array.from({length:12},(_,i)=>`<path d="M-100 ${80+i*28} Q200 ${-100+i*30} 590 ${190+i*18} T1550 ${50+i*35}"/>`).join('')}</g></svg>`;
    dialog.dataset.phase='0';
    dialog.innerHTML=`<div class="seed-atmosphere" aria-hidden="true"><div class="seed-aurora"></div><div class="seed-terrain">${terrain}</div><div class="seed-motes">${motes}</div><div class="seed-horizon"></div><div class="seed-bloom"></div></div><div class="seed-cinema-header"><span class="seed-eyebrow">NORTEX <span>/</span> EL ORIGEN</span><span class="seed-farm-name">${esc(snapshot.name||'Tu escenario agrícola')}</span></div><button type="button" class="seed-close" aria-label="Cancelar creación">✕</button><div class="seed-cinema-body"><div class="seed-scene" data-phase="0"><div class="seed-orbit"></div><div class="seed-orbit second"></div><div class="seed-orbit third"></div><div class="seed-ray"></div><div class="seed-sprout">${sprout}</div><span class="seed-spark s1"></span><span class="seed-spark s2"></span><span class="seed-spark s3"></span><span class="seed-scene-label">UNA HISTORIA QUE NACE DE TU TIERRA</span></div><div class="seed-story" aria-live="polite" aria-atomic="true"><span class="seed-chapter">01 / TIERRA</span><h2 id="seed-ritual-title">Dentro de tu tierra,<br>una historia espera.</h2><p class="seed-narrative">El suelo y tu cultivo. El comienzo de algo único.</p></div></div><div class="seed-cinema-footer"><ol class="seed-milestones"><li class="active">Tierra</li><li>Agua</li><li>Vida</li><li>Tu semilla</li></ol><button type="button" class="seed-skip">Saltar animación y crear</button><small class="seed-privacy">Creación visual en este navegador · no envía datos</small></div>`;
    document.body.append(dialog);dialog.showModal();
    dialog.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){dialog.style.setProperty('--look-x',((e.clientX/window.innerWidth-.5)*16)+'px');dialog.style.setProperty('--look-y',((e.clientY/window.innerHeight-.5)*12)+'px');}});
    const timers=[];let done=false;
    const observer=new MutationObserver(()=>{if(!host.isConnected)close();});observer.observe(document.body,{childList:true,subtree:true});
    const stop=()=>{timers.forEach(clearTimeout);observer.disconnect();};
    function close(){stop();dialog.close();dialog.remove();if(trigger?.isConnected)trigger.focus();else host.querySelector('[data-copy]')?.focus();}
    function finish(){
      if(done||!host.isConnected)return;
      done=true;stop();
      const seed=getCreatedSeed(snapshot,lab)||computeSeedProfile(snapshot,lab);seeds.set(key(snapshot,lab),seed);
      dialog.dataset.phase='3';
      dialog.querySelector('.seed-scene').dataset.phase='3';
      dialog.querySelector('.seed-sprout').innerHTML=buildSeedSVG(snapshot,lab,250);
      dialog.querySelector('.seed-chapter').textContent='04 / TU SEMILLA';
      dialog.querySelector('h2').textContent='Tu tierra. Tu huella. Tu semilla.';
      dialog.querySelector('.seed-narrative').innerHTML=`<strong class="seed-code">${esc(seed.code)}</strong><br>La historia de tu escenario, lista para compartir.`;
      dialog.querySelectorAll('.seed-milestones li').forEach(li=>li.classList.add('active'));
      const next=dialog.querySelector('.seed-skip');next.textContent='Ver mi semilla y compartir';next.onclick=()=>{close();host.querySelector('[data-copy]')?.focus();};
      dialog.querySelector('.seed-close').setAttribute('aria-label','Cerrar experiencia');
      render();window.dispatchEvent(new CustomEvent('nortex:seed-created'));
    }
    dialog.querySelector('.seed-close').onclick=close;
    dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
    dialog.querySelector('.seed-skip').onclick=finish;
    const phases=[['02 / AGUA','El agua despierta la vida.','Cada gota dibuja una parte de tu historia.'],['03 / VIDA','Lo invisible toma forma.','Suelo, agua y temperatura. Un patrón que cuenta tu escenario.']];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    phases.forEach((p,i)=>timers.push(setTimeout(()=>{
      if(!dialog.isConnected||!host.isConnected)return close();
      dialog.dataset.phase=String(i+1);
      dialog.querySelector('.seed-scene').dataset.phase=String(i+1);
      dialog.querySelector('.seed-chapter').textContent=p[0];dialog.querySelector('h2').textContent=p[1];dialog.querySelector('.seed-narrative').textContent=p[2];
      dialog.querySelectorAll('.seed-milestones li').forEach((li,n)=>li.classList.toggle('active',n<=i+1));
    },(i+1)*2800)));
    timers.push(setTimeout(finish,8400));
  }
  render();
}
