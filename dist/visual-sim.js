import {mountTreeLab,treePicture,friendlyForecast} from './tree-lab.js';
import {mountSeedExperience} from './seed-experience.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const CROP_CODES={'Mango Kent':'KENT','Mango Haden':'HADEN','Limón Sutil':'SUTIL'};
const SOIL_SHAPES={
  'arenoso':{sides:4,label:'Arenoso · Drena rápido',fill:'#d7c89e'},
  'franco arenoso':{sides:6,label:'Franco arenoso · Equilibrado',fill:'#b59e6d'},
  'franco':{sides:8,label:'Franco · Retención óptima',fill:'#8b734b'},
  'arcilloso':{sides:10,label:'Arcilloso · Retención pesada',fill:'#6e583b'}
};

export function computeSeedProfile(farm,hasLabTests=false){
  const cropCode=CROP_CODES[farm.crop]||'CAMPO';
  const m=Number(farm.moisture??18),t=Number(farm.surface??35),d=Number(farm.days??12),r=Number(farm.rain??12);
  let stateWord='VIVO',ringColor='#215b45',rings=3;
  if(m<18||d>12){stateWord='SECO';ringColor='#b56b2a';rings=1;}
  else if(t>34){stateWord='CALOR';ringColor='#9b6b1e';rings=2;}
  else if(r>35){stateWord='LLUVIA';ringColor='#2d6e5e';rings=4;}
  else if(m>=22&&t<=33&&d<=9){stateWord='OPTIMO';ringColor='#215b45';rings=4;}
  const hash=Math.abs(Math.round(m*3+t*2+d*5+r+(farm.soil||'').length*7))%90+10;
  const code=`${cropCode}-${stateWord}-${hash}`;
  const soilInfo=SOIL_SHAPES[farm.soil]||SOIL_SHAPES['franco arenoso'];
  const traits=[
    farm.crop||'Mango Kent',
    rings>=3?'Reserva hídrica estable':rings===2?'Reserva hídrica moderada':'Reserva hídrica baja',
    t>34?'Calor superficial alto':'Clima templado',
    hasLabTests?'Con registro de laboratorio':'Datos del escenario'
  ];
  return {
    code,stateWord,ringColor,rings,soilInfo,hasLabTests,traits,
    waterState:translateWaterBuckets(m,d),
    heatState:translateHeatState(t,farm.stage),
    rainState:translateRainState(r,farm.stage)
  };
}

export function translateWaterBuckets(moisture,days){
  let score=Math.round((Math.min(40,Math.max(5,moisture))/35)*3.5+Math.max(0,(16-days)/16)*1.5);
  let buckets=Math.max(1,Math.min(5,score));
  if(moisture<16||days>13)buckets=Math.min(buckets,2);
  if(moisture<12||days>18)buckets=1;
  const descriptions={
    1:{label:'1 de 5 niveles · Reserva crítica',color:'#a2542b',explain:'La capa superficial está seca y han pasado varios días desde el último riego. Las raíces finas absorben con dificultad.'},
    2:{label:'2 de 5 niveles · Reserva baja',color:'#b56b2a',explain:'Queda poca humedad disponible. Si el calor sube al mediodía, el árbol cerrará sus hojas para no deshidratarse.'},
    3:{label:'3 de 5 niveles · Reserva moderada',color:'#718866',explain:'El suelo mantiene humedad intermedia. Conviene revisar a 30 cm con lampa antes de programar el siguiente turno.'},
    4:{label:'4 de 5 niveles · Buena reserva',color:'#215b45',explain:'Las raíces absorben agua y nutrientes con fluidez; la savia sube sin esfuerzo hacia la copa y las flores.'},
    5:{label:'5 de 5 niveles · Suelo bien hidratado',color:'#193e32',explain:'Reserva completa en el perfil. Evita regar en exceso para mantener oxigenadas las raíces.'}
  };
  return {buckets,...descriptions[buckets]};
}

export function translateHeatState(surfaceTemp,stage){
  if(surfaceTemp>=36){
    return {
      level:'Calor intenso en suelo y copa',
      color:'#a2542b',
      icon:'☀',
      explain:`La superficie del suelo alcanza ${surfaceTemp} °C. En etapa de ${stage}, este calor acelera la evaporación y puede provocar caída de flor o fruto pequeño.`
    };
  }
  if(surfaceTemp>=33){
    return {
      level:'Tarde cálida · Vigilar evaporación',
      color:'#9b6b1e',
      icon:'◐',
      explain:`Con ${surfaceTemp} °C en superficie, el suelo pierde humedad más rápido entre las 12:00 y las 15:00.`
    };
  }
  return {
    level:'Temperatura suave para el árbol',
    color:'#215b45',
    icon:'◎',
    explain:`Con ${surfaceTemp} °C, el follaje y las flores trabajan sin estrés térmico.`
  };
}

export function translateRainState(rain,stage){
  if(rain>=35){
    return {
      level:'Humedad ambiental alta por lluvias',
      color:'#2d6e5e',
      explain:`Se acumularon ${rain} mm en 7 días. En ${stage}, la humedad en las hojas exige revisar ventilación de copa y estado sanitario.`
    };
  }
  if(rain>=10){
    return {
      level:'Lluvia ligera de apoyo',
      color:'#48794e',
      explain:`Los ${rain} mm recientes refrescan el ambiente, pero no reemplazan un riego profundo en la zona radicular.`
    };
  }
  return {
    level:'Semana seca · Todo depende del riego',
    color:'#718866',
    explain:`Con solo ${rain} mm de lluvia en 7 días, el árbol depende íntegramente del turno de riego del canal o reservorio.`
  };
}

export function buildSeedSVG(farm,hasLabTests=false,size=168){
  const p=computeSeedProfile(farm,hasLabTests);
  const cx=100,cy=100;
  const sides=p.soilInfo.sides;
  let poly=[];
  for(let i=0;i<sides;i++){
    const a=(Math.PI*2*i)/sides-Math.PI/2;
    const r=66+(i%2===0?4:-3);
    poly.push(`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`);
  }
  const rays=Math.max(6,Math.min(16,Math.round(Number(farm.surface||32)/2.5)));
  let rayLines='';
  for(let i=0;i<rays;i++){
    const a=(Math.PI*2*i)/rays;
    const r1=72,r2=82+(i%2)*4;
    rayLines+=`<line x1="${(cx+r1*Math.cos(a)).toFixed(1)}" y1="${(cy+r1*Math.sin(a)).toFixed(1)}" x2="${(cx+r2*Math.cos(a)).toFixed(1)}" y2="${(cy+r2*Math.sin(a)).toFixed(1)}" stroke="${p.heatState.color}" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>`;
  }
  let ringCircles='';
  for(let i=1;i<=p.rings;i++){
    const rr=16+i*10;
    ringCircles+=`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${p.ringColor}" stroke-width="1.8" stroke-dasharray="${i%2===0?'none':'4 3'}" opacity="0.75"/>`;
  }
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="Semilla NORTEX ${esc(p.code)}" class="nortex-seed-svg">
    <defs>
      <radialGradient id="seedGlow-${esc(p.code)}" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#f4f6ee"/>
        <stop offset="70%" stop-color="#e3ecda"/>
        <stop offset="100%" stop-color="#d4e9a1"/>
      </radialGradient>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="92" fill="url(#seedGlow-${esc(p.code)})" stroke="${p.hasLabTests?'#215b45':'#8ea18f'}" stroke-width="${p.hasLabTests?'2.5':'1.6'}" stroke-dasharray="${p.hasLabTests?'none':'5 4'}"/>
    ${rayLines}
    <polygon points="${poly.join(' ')}" fill="${p.soilInfo.fill}" fill-opacity="0.16" stroke="${p.soilInfo.fill}" stroke-width="1.8"/>
    ${ringCircles}
    <path d="M100 56 C122 76, 126 112, 100 138 C74 112, 78 76, 100 56 Z" fill="${p.ringColor}" fill-opacity="0.88" stroke="#193e32" stroke-width="1.6"/>
    <path d="M100 66 L100 130 M100 86 L111 77 M100 100 L89 90 M100 112 L111 103" stroke="#f4f6ee" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="100" cy="52" r="4" fill="#d4e9a1" stroke="#193e32" stroke-width="1.2"/>
  </svg>`;
}

export function buildFieldSimulationSVG(farm){return treePicture(farm);}
export function renderInteractiveSimulatorCard(container,farm,options={}){mountTreeLab(container,farm,options);}
export function renderFriendlyMLTranslation(container,ml){container.insertAdjacentHTML('afterbegin',friendlyForecast(ml));}

export function renderSeedPassportSection(container,farm,tests,onLoadSeed){
  const farmTests=tests.filter(t=>t.farm===farm.name);
  const section=document.createElement('div');
  container.prepend(section);
  const experience=document.createElement('div');section.append(experience);
  mountSeedExperience(experience,farm,farmTests.length>0);
  section.insertAdjacentHTML('beforeend',`<details class="card" style="margin-bottom:22px"><summary>Explorar escenarios de ejemplo</summary><p>Estas claves cargan escenarios ilustrativos, no recuperan expedientes de fincas.</p><label>Clave de ejemplo<input id="seedInputCode" placeholder="KENT-OPTIMO-84"></label><button type="button" id="btnGerminateSeed">Explorar escenario</button><button type="button" class="seed-demo-chip" data-seed="KENT-SECO-59">Probar baja humedad</button><button type="button" class="seed-demo-chip" data-seed="SUTIL-CALOR-62">Probar calor</button></details>`);

  const applySeedCode=raw=>{
    const clean=String(raw||'').trim().toUpperCase();
    if(!clean)return;
    const preset={...farm};
    if(clean.startsWith('SUTIL'))preset.crop='Limón Sutil';
    else if(clean.startsWith('HADEN'))preset.crop='Mango Haden';
    else if(clean.startsWith('KENT'))preset.crop='Mango Kent';

    if(clean.includes('SECO')){preset.moisture=13;preset.days=16;preset.surface=35;preset.rain=2;}
    else if(clean.includes('CALOR')){preset.moisture=17;preset.days=11;preset.surface=39;preset.rain=4;}
    else if(clean.includes('OPTIMO')){preset.moisture=27;preset.days=4;preset.surface=31;preset.rain=16;}
    else if(clean.includes('LLUVIA')){preset.moisture=31;preset.days=2;preset.surface=30;preset.rain=45;}
    if(onLoadSeed)onLoadSeed(preset,clean);
  };

  const germBtn=container.querySelector('#btnGerminateSeed');
  if(germBtn){
    germBtn.onclick=()=>applySeedCode(container.querySelector('#seedInputCode').value);
  }
  container.querySelectorAll('.seed-demo-chip').forEach(b=>{
    b.onclick=()=>{
      container.querySelector('#seedInputCode').value=b.dataset.seed;
      applySeedCode(b.dataset.seed);
    };
  });
}
