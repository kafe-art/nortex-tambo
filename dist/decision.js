import {mountRotationStage} from './rotation-stage.js';
import {summarizePower} from './real-crop-data.js';
import {crops} from './crop-catalog.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function mountDecision(container,farm,context={}){
  let request=0,controller;

  function home(){
    request++;
    controller?.abort();
    document.body.style.overflow='';
    container.replaceChildren();
    context.onHome?.();
    window.scrollTo({top:0,behavior:'instant'});
  }

  function menu(){
    request++;
    controller?.abort();
    container.innerHTML=`
      <section class="choice-garden">
        <button id="decision-home">← Volver al inicio</button>
        <small>TU TIERRA · TU SIGUIENTE DECISIÓN</small>
        <h2>¿Qué quieres descubrir?</h2>
        <p>Dos caminos. Una finca en el Valle de San Lorenzo. Tú eliges por dónde comenzar.</p>
        <div class="choice-doors">
          <button data-mode="current">
            <span class="choice-art">🌳</span>
            <small>CONOCE TU PRESENTE</small>
            <strong>Qué cultivas</strong>
            <p>Comprende tu cultivo actual (${esc(farm.crop)}), el agua en raíces y las señales de tu finca.</p>
            <b>Entrar a mi campo ↗</b>
          </button>
          <button data-mode="rotations">
            <span class="choice-art">🌱 → 🌳</span>
            <small>EXPLORA TU FUTURO</small>
            <strong>Rotaciones</strong>
            <p>Recorre el camino de cada rotación paso a paso y compara agua, suelo y viabilidad.</p>
            <b>Explorar rotaciones ↗</b>
          </button>
        </div>
      </section>
    `;
    container.querySelector('#decision-home').onclick=home;
    container.querySelectorAll('[data-mode]').forEach(el=>{
      el.onclick=()=>show(el.dataset.mode,{...context});
    });
  }

  function show(mode,local){
    const id=++request;
    controller?.abort();
    controller=new AbortController();
    container.replaceChildren();

    const host=document.createElement('div');
    container.append(host);

    if(mode==='rotations'){
      mountRotationStage(host,farm,{
        ...local,
        onBack:menu,
        onHome:home
      });
      const p=context.area?.reference;
      if(p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&!local.source?.startsWith('NASA POWER')){
        const q=new URLSearchParams({
          parameters:'T2M_MAX,PRECTOTCORR',
          community:'AG',
          latitude:String(p.lat),
          longitude:String(p.lon),
          start:'20250101',
          end:'20251231',
          format:'JSON',
          'time-standard':'LST'
        });
        fetch('https://power.larc.nasa.gov/api/temporal/daily/point?'+q,{signal:controller.signal})
          .then(r=>r.ok?r.json():Promise.reject())
          .then(json=>{
            if(id!==request||!host.isConnected)return;
            const result=summarizePower(json,2025);
            local.rows=result.rows;
            local.source='NASA POWER · histórico 2025';
            mountRotationStage(host,farm,{...local,onBack:menu,onHome:home});
          })
          .catch(()=>{});
      }
      return;
    }

    const c=crops.find(c=>farm.crop?.startsWith(c.name));
    host.innerHTML=`
      <section class="choice-garden">
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
          <button id="current-back-menu">← Volver a opciones</button>
          <button id="current-back-home">Ir al mapa inicial</button>
        </div>
        <small>QUÉ CULTIVAS · TU PRESENTE</small>
        <div class="current-orchard" aria-hidden="true">${(c?.symbol||'🌳').repeat(5)}</div>
        <h2>${esc(farm.crop)}</h2>
        <p>Cultivo registrado en tu escenario (${esc(farm.name)} · ${esc(farm.area)} ha · suelo ${esc(farm.soil)}).</p>
        <div class="current-signals">
          <article>
            <span>☀</span>
            <h3>El cielo tiene historia</h3>
            <p>${local.source?.startsWith('NASA POWER')?'Tenemos registros históricos NASA POWER 2025 cargados para explorar.':'Usando serie de referencia (${esc(local.source)}). Puedes consultar NASA POWER en cualquier momento.'}</p>
          </article>
          <article>
            <span>💧</span>
            <h3>Las raíces necesitan una visita</h3>
            <p>Humedad superficial declarada: ${esc(farm.moisture)}% (${esc(farm.days)} días desde el último riego). Compruébala a 30 cm en campo antes de decidir el riego.</p>
          </article>
          <article>
            <span>🌱</span>
            <h3>Tu cultivo sigue siendo el centro</h3>
            <p>Etapa actual: ${esc(farm.stage)}. Revisa suelo y disponibilidad de agua antes de explorar rotaciones en tu lote anual o cobertura en calles.</p>
          </article>
        </div>
        <details>
          <summary>Ver datos y procedencia del escenario</summary>
          <p>Fuente climática: ${esc(local.source||'Sin fuente')}</p>
          <p>Registros: ${local.rows?.length||0} días · Etapa fenológica: ${esc(farm.stage)}</p>
          <p>Lecturas del escenario: humedad superficial ${esc(farm.moisture)}%; temperatura superficial ${esc(farm.surface)} °C; lluvia 7d ${esc(farm.rain)} mm.</p>
        </details>
        <button id="current-to-rotation" style="margin-top:18px;background:linear-gradient(#facd68,#efb33e);color:#49300a;border:0;padding:14px 24px;border-radius:99px;font-weight:800">Explorar rotaciones paso a paso →</button>
      </section>
    `;
    host.querySelector('#current-back-menu').onclick=menu;
    host.querySelector('#current-back-home').onclick=home;
    host.querySelector('#current-to-rotation').onclick=()=>show('rotations',local);
  }

  menu();
}
