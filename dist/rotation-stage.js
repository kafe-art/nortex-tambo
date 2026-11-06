import {mountRealData,evaluateReal} from './real-crop-data.js';
import {crops} from './crop-catalog.js';
import {mountAssessment} from './field-assessment.js';
import {decisionEvidence} from './decision-evidence.js';
import {evaluate} from './core.js';
import {computeSeedProfile} from './visual-sim.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function cropArtwork(name){
  const n=String(name||'').toLowerCase();
  if(n.includes('mango')){
    return `<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
      <path d="M34 12 C48 12, 52 30, 42 44 C34 54, 18 52, 16 38 C14 24, 22 12, 34 12 Z" fill="#f59e0b" stroke="#9a3412" stroke-width="2"/>
      <path d="M36 16 C44 20, 46 32, 38 42" fill="none" stroke="#fde047" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      <path d="M34 12 C34 6, 42 6, 46 10 C40 14, 36 14, 34 12 Z" fill="#15803d"/>
    </svg>`;
  }
  if(n.includes('limón')||n.includes('limon')){
    return `<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
      <ellipse cx="32" cy="34" rx="18" ry="15" fill="#84cc16" stroke="#3f6212" stroke-width="2"/>
      <circle cx="13" cy="34" r="3" fill="#84cc16" stroke="#3f6212" stroke-width="1.6"/>
      <circle cx="51" cy="34" r="3" fill="#84cc16" stroke="#3f6212" stroke-width="1.6"/>
      <ellipse cx="27" cy="28" rx="6" ry="3" fill="#d9f99d" opacity=".65"/>
      <path d="M32 19 C32 11, 42 11, 44 16 C38 20, 34 20, 32 19 Z" fill="#15803d"/>
    </svg>`;
  }
  if(n.includes('palta')){
    return `<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
      <path d="M32 10 C41 10, 47 24, 47 37 C47 49, 40 55, 32 55 C24 55, 17 49, 17 37 C17 24, 23 10, 32 10 Z" fill="#166534" stroke="#052e16" stroke-width="2"/>
      <path d="M32 14 C39 14, 43 26, 43 37 C43 46, 38 51, 32 51 C26 51, 21 46, 21 37 C21 26, 25 14, 32 14 Z" fill="#bef264"/>
      <circle cx="32" cy="38" r="8.5" fill="#78350f"/>
      <circle cx="29.5" cy="35.5" r="2.5" fill="#d97706" opacity=".65"/>
    </svg>`;
  }
  if(n.includes('cacao')){
    return `<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
      <ellipse cx="32" cy="33" rx="14" ry="21" transform="rotate(-18 32 33)" fill="#92400e" stroke="#451a03" stroke-width="2"/>
      <path d="M24 17 Q32 33 40 49 M19 26 Q32 33 45 40" fill="none" stroke="#d97706" stroke-width="1.8" opacity=".75"/>
    </svg>`;
  }
  if(n.includes('arándano')||n.includes('arandano')){
    return `<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
      <circle cx="24" cy="36" r="11" fill="#312e81" stroke="#1e1b4b" stroke-width="2"/>
      <circle cx="40" cy="38" r="10" fill="#3730a3" stroke="#1e1b4b" stroke-width="2"/>
      <circle cx="32" cy="25" r="10.5" fill="#4338ca" stroke="#1e1b4b" stroke-width="2"/>
      <circle cx="29" cy="22" r="2.5" fill="#a5b4fc" opacity=".8"/>
      <circle cx="21" cy="33" r="2.2" fill="#a5b4fc" opacity=".8"/>
      <circle cx="38" cy="35" r="2" fill="#a5b4fc" opacity=".8"/>
    </svg>`;
  }
  if(n.includes('arroz')){
    return `<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
      <path d="M32 52 V16 M32 38 Q20 28 18 16 M32 34 Q44 24 46 14" fill="none" stroke="#ca8a04" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="26" cy="20" rx="3" ry="5" transform="rotate(-25 26 20)" fill="#facc15"/>
      <ellipse cx="38" cy="18" rx="3" ry="5" transform="rotate(25 38 18)" fill="#facc15"/>
      <ellipse cx="32" cy="14" rx="3" ry="5" fill="#fde047"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
    <ellipse cx="32" cy="48" rx="18" ry="6" fill="#8b6b47"/>
    <path d="M32 47 V22" stroke="#1e7a44" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M32 34 C20 34, 16 22, 26 18 C32 16, 34 26, 32 34 Z" fill="#2e9a58"/>
    <path d="M32 29 C44 29, 48 17, 38 13 C32 11, 30 21, 32 29 Z" fill="#4bc070"/>
  </svg>`;
}

function optionBadgeIcon(key){
  if(key==='A'){
    return `<svg viewBox="0 0 36 36" width="24" height="24" aria-hidden="true"><path d="M18 28 V14 M18 21 C11 21, 9 13, 16 11 C19 10, 19 17, 18 21 Z M18 18 C25 18, 27 10, 20 8 C17 7, 17 14, 18 18 Z" fill="none" stroke="#4a3006" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  if(key==='B'){
    return `<svg viewBox="0 0 36 36" width="24" height="24" aria-hidden="true"><path d="M18 7 C18 7, 10 17, 10 22 A8 8 0 0 0 26 22 C26 17, 18 7, 18 7 Z" fill="none" stroke="#4a3006" stroke-width="2.4" stroke-linejoin="round"/></svg>`;
  }
  return `<svg viewBox="0 0 36 36" width="24" height="24" aria-hidden="true"><path d="M8 26 L15 17 L21 21 L28 10 M28 10 H22 M28 10 V16" fill="none" stroke="#4a3006" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function computeNasaAnnualSummary(rows=[]){
  const validRain=rows.filter(r=>typeof r.rain==='number'&&Number.isFinite(r.rain));
  const validTemp=rows.filter(r=>typeof r.temp==='number'&&Number.isFinite(r.temp));
  return {
    year:2025,
    expected:365,
    rainDays:validRain.length,
    tempDays:validTemp.length,
    rainTotal:validRain.length===365?validRain.reduce((s,r)=>s+r.rain,0):null,
    meanMax:validTemp.length?validTemp.reduce((s,r)=>s+r.temp,0)/validTemp.length:null,
    last:validTemp.at(-1)||null
  };
}

function buildStopsForCrop(farm,crop,realEvalItem,withEvidence,nasaSummary){
  const origin=farm.crop||'Mango Kent';
  const same=origin.toLowerCase().startsWith(crop.name.toLowerCase());
  const annual=crop.name==='Arroz';
  const ev=evaluate(farm);

  const sourceLabel=crop.name==='Limón'?'SENASA · Guía BPA del Limón'
    :crop.name==='Mango'?'INIA · Manejo integrado de Mango Kent'
    :crop.name==='Cacao'?'ICCO · Referencia de precipitación anual'
    :crop.name==='Arándanos'?'Oregon State University · Rango de pH (4.5–5.5)'
    :crop.name==='Palta'?'Queensland Gov · Drenaje y sensibilidad radicular'
    :'FAO · Requerimiento hídrico y lote anual';

  if(!withEvidence){
    return [
      {
        short:origin.split(' ')[0],
        icon:origin,
        season:`Parada 1 de 3 · Situación actual (${origin})`,
        title:`${origin} · Lecturas sin verificar en campo`,
        question:`¿Qué ocurre si decides sobre tu parcela usando solo valores estimados?`,
        answer:`La humedad superficial (${farm.moisture}%) y la temperatura superficial (${farm.surface} °C) no muestran por sí solas cómo están las raíces a 30 cm ni el pH real del suelo ${farm.soil}.`,
        waterBadge:`Humedad sup.: ${farm.moisture}% (${farm.days}d)`,
        soilBadge:`Suelo declarado: ${farm.soil}`,
        extraBadge:`IVAP: ${ev.ivap}/100 (${ev.status})`,
        why:`En NORTEX, ninguna lectura satelital o de escenario sustituye la revisión en campo. Activa el interruptor «Con evidencia» arriba para ver las comprobaciones técnicas de ${crop.name}.`,
        sourceUrl:realEvalItem?.source||null,
        sourceName:sourceLabel
      },
      {
        short:crop.name,
        icon:crop.name,
        season:`Parada 2 de 3 · Propuesta (${crop.type})`,
        title:`${crop.symbol} ${crop.name} · Sin validación local`,
        question:`¿Qué riesgo hay al pasar a ${crop.name} sin confirmar agua y suelo?`,
        answer:annual
          ?`El arroz exige un lote anual separado (${farm.annual?'declarado como disponible':'actualmente NO habilitado en tu escenario'}) y dotación de agua asegurada para la campaña.`
          :same
          ?`Mantener ${origin} sin ajustar el manejo de riego (${farm.days} días) ni revisar el calor en ${farm.stage} mantiene una presión hídrica de ${ev.water}/100.`
          :`Reemplazar un frutal establecido por ${crop.name} sin medir pH, profundidad efectiva y drenaje expone la inversión a fallas radiculares.`,
        waterBadge:`Riesgo agua: ${ev.water}/100`,
        soilBadge:`Estado: ${realEvalItem?.status||'Datos insuficientes'}`,
        extraBadge:`Faltan ${realEvalItem?.unknown?.length||3} datos`,
        why:(realEvalItem?.alerts?.concat(realEvalItem?.notes)||[]).join(' ')||crop.action,
        sourceUrl:realEvalItem?.source||null,
        sourceName:sourceLabel
      },
      {
        short:'Sin certeza',
        icon:crop.name,
        season:'Parada 3 de 3 · Resultado sin verificación',
        title:'Decisión incompleta · Pendiente de campo',
        question:'¿Qué falta antes de comprometer tu próxima campaña?',
        answer:`Falta confirmar: ${(realEvalItem?.unknown||['Variedad local','Dotación de riego','Costos y mercado']).join(', ')}.`,
        waterBadge:'Dotación por confirmar',
        soilBadge:'Análisis de suelo pendiente',
        extraBadge:'Sin rentabilidad calculada',
        why:'NORTEX no inventa ganancias por hectárea ni autoriza siembras sin análisis de laboratorio y validación con tu técnico en el Valle de San Lorenzo.',
        sourceUrl:realEvalItem?.source||null,
        sourceName:sourceLabel
      }
    ];
  }

  return [
    {
      short:origin.split(' ')[0],
      icon:origin,
      season:`Parada 1 de 3 · Hoy en tu finca (${farm.stage})`,
      title:`${origin} (cultivo base en ${farm.soil})`,
      question:`¿Cómo partir desde tu escenario actual en el Valle de San Lorenzo?`,
      answer:`Tu escenario registra ${origin} en etapa de ${farm.stage}, con humedad superficial de ${farm.moisture}%, ${farm.days} días desde el último riego y temperatura superficial de ${farm.surface} °C.`,
      waterBadge:ev.water>=35?`Atención agua (${ev.water}/100)`:`Agua en rango (${ev.water}/100)`,
      soilBadge:`Compatibilidad: ${ev.compatibility}/100`,
      extraBadge:nasaSummary.last?`NASA máx: ${nasaSummary.last.temp.toFixed(1)} °C`:`Calor sup.: ${farm.surface} °C`,
      why:`Antes de mover o rotar cultivos, la regla H1 de NORTEX (${ev.water}/100) indica comprobar la humedad radicular a 30 cm con lampa y confirmar que el cultivo registrado coincide con tu lote real.`,
      sourceUrl:'https://repositorio.inia.gob.pe/handle/20.500.12955/966',
      sourceName:'INIA · Manejo técnico en Piura'
    },
    {
      short:crop.name,
      icon:crop.name,
      season:`Parada 2 de 3 · ${same?'Manejo y adaptación':annual?'Campaña en lote anual':'Evaluación de alternativa'}`,
      title:`${crop.symbol} ${crop.name} (${crop.type})`,
      question:same
        ?`¿Por qué priorizar la adaptación de tu ${origin} actual?`
        :annual
        ?`¿Bajo qué condiciones se evalúa ${crop.name} en el Valle de San Lorenzo?`
        :`¿Qué exige comprobar ${crop.name} antes de una reconversión a largo plazo?`,
      answer:same
        ?`Los frutales perennes no se rotan como cultivos anuales. El camino recomendado es conservar la plantación, proteger el suelo (${farm.soil}) y ajustar el turno de riego con tu técnico.`
        :annual
        ?`El arroz solo se evalúa en un lote anual separado (${farm.annual?'disponible en tu escenario':'actualmente NO disponible en tu escenario'}), verificando primero la dotación de agua de la campaña.`
        :`${crop.action} ${(realEvalItem?.alerts?.concat(realEvalItem?.notes)||[])[0]||''}`,
      waterBadge:annual?(farm.annual?'Lote anual habilitado':'Requiere lote anual'):'Agua y turno por validar',
      soilBadge:realEvalItem?.alerts?.length?'Revisar alerta de suelo/clima':'Verificar pH y drenaje',
      extraBadge:sourceLabel.split('·')[0].trim(),
      why:[...(realEvalItem?.alerts||[]),...(realEvalItem?.notes||[]),`Pendiente de confirmar en campo: ${(realEvalItem?.unknown||[]).join(', ')}.`].join(' '),
      sourceUrl:realEvalItem?.source||null,
      sourceName:sourceLabel
    },
    {
      short:same?'Continuidad':annual?'Cierre anual':'Validación',
      icon:crop.name,
      season:`Parada 3 de 3 · ${same?'Continuidad del frutal':annual?'Cierre de campaña':'Paso con tu técnico'}`,
      title:same
        ?`Continuidad de ${origin} con monitoreo`
        :annual
        ?`Cierre de campaña de ${crop.name} y evaluación de suelo`
        :`Revisión técnica antes de establecer ${crop.name}`,
      question:`¿Cuál es tu siguiente paso concreto con esta evidencia?`,
      answer:same
        ?`Registra un análisis de suelo real (pH, conductividad y profundidad efectiva) para actualizar tu Semilla NORTEX y acordar el calendario de riego con tu técnico.`
        :annual
        ?`Al finalizar la campaña anual, registra resultados de agua y suelo antes de decidir la siguiente siembra. No se encadena otra rotación sin medir el lote.`
        :`Reúne el análisis de laboratorio (pH, drenaje, salinidad), la dotación de agua y el estudio de costos/mercado antes de tomar una decisión sobre ${crop.name}.`,
      waterBadge:'Verificar dotación real',
      soilBadge:`Suelo ${farm.soil}`,
      extraBadge:'Llevar expediente al técnico',
      why:`Este recorrido ordena la evidencia real disponible (${nasaSummary.tempDays} días climáticos cargados) sin inventar rentabilidades ni reemplazar el diagnóstico presencial en Tambogrande / San Lorenzo.`,
      sourceUrl:realEvalItem?.source||null,
      sourceName:sourceLabel
    }
  ];
}

export function mountRotationStage(host,farm,context={}){
  let currentFarm={...farm,soil:farm.soil||'franco arenoso',area:Number(farm.area||2.5)};
  let activeOptionKey='A';
  let selectedCropName=crops.find(c=>currentFarm.crop?.startsWith(c.name))?.name||'Mango';
  let activeStop=0;
  let withEvidence=true;
  let showWhyDetail=false;
  let soilCheck={ph:null,drainage:''};
  let frame=0,tractorPos=0;

  const savedFarms=Array.isArray(context.farms)?context.farms:[];
  const parcelChoices=[
    {id:'current',label:`${currentFarm.name||'Mi parcela piloto'} · ${currentFarm.area} ha (${currentFarm.crop||'Mango Kent'})`,data:{...currentFarm}},
    ...savedFarms.filter(f=>f.name!==currentFarm.name).map((f,i)=>({
      id:`saved-${i}`,
      label:`${f.name} · ${f.area||2.5} ha (${f.crop||'Cultivo'})`,
      data:{...currentFarm,...f}
    })),
    {id:'anual',label:`${currentFarm.name||'Mi parcela'} · Con lote anual separado (${currentFarm.area} ha)`,data:{...currentFarm,annual:true}},
    {id:'limon',label:`Escenario Limón Sutil · ${currentFarm.area} ha`,data:{...currentFarm,crop:'Limón Sutil',annual:false}}
  ];

  const pathOptions={
    A:{
      id:'A',
      title:'Opción A',
      subtitle:'Conservar y adaptar tu cultivo',
      defaultCrop:crops.find(c=>currentFarm.crop?.startsWith(c.name))?.name||'Mango'
    },
    B:{
      id:'B',
      title:'Opción B',
      subtitle:'Campaña en lote anual (Arroz)',
      defaultCrop:'Arroz'
    },
    C:{
      id:'C',
      title:'Opción C',
      subtitle:'Evaluar reconversión perenne',
      defaultCrop:'Palta'
    }
  };

  host.innerHTML=`
    <section class="nortex-rot-page" aria-label="Explorador de rotaciones y alternativas NORTEX">
      <div class="nortex-rot-hero">
        <div class="nortex-rot-topbar">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="nortex-rot-back" id="rotBackMenu">← Volver a ¿Qué quieres descubrir?</button>
            <button type="button" class="nortex-rot-back ghost" id="rotBackHome">Volver al inicio</button>
          </div>
          <span class="nortex-rot-seedpill" id="rotSeedBadge"></span>
        </div>

        <h1>¿Qué sembrar o adaptar<br>en tu próxima temporada?</h1>
        <p class="nortex-rot-sub">Recorre el camino de cada alternativa en el Valle de San Lorenzo y revisa agua, suelo y evidencia con los datos de tu finca.</p>

        <div class="nortex-rot-controls-row">
          <label class="nortex-rot-field">
            <span>Parcela / Escenario</span>
            <select id="rotParcelSelect">
              ${parcelChoices.map(p=>`<option value="${esc(p.id)}">${esc(p.label)}</option>`).join('')}
            </select>
          </label>

          <label class="nortex-rot-field">
            <span>Tipo de suelo</span>
            <select id="rotSoilSelect">
              <option value="franco arenoso" ${currentFarm.soil==='franco arenoso'?'selected':''}>Franco arenoso (declarado)</option>
              <option value="franco" ${currentFarm.soil==='franco'?'selected':''}>Franco (equilibrado)</option>
              <option value="arenoso" ${currentFarm.soil==='arenoso'?'selected':''}>Arenoso (drenaje rápido)</option>
              <option value="arcilloso" ${currentFarm.soil==='arcilloso'?'selected':''}>Arcilloso (cuidar drenaje)</option>
            </select>
          </label>

          <div class="nortex-rot-kpis" id="rotHeaderKpis"></div>
        </div>
      </div>

      <div class="nortex-rot-body">
        <!-- 3 Strategic Option Cards (Image 1) -->
        <div class="nortex-rot-options" id="rotOptionCards" role="tablist" aria-label="Caminos para tu finca"></div>

        <!-- 6-Crop Selector Bar from NORTEX Catalog -->
        <div class="nortex-rot-catalogbar" id="rotCropCatalogBar" role="group" aria-label="Seis cultivos del catálogo NORTEX"></div>

        <!-- Winding Road Map Card (Image 2) -->
        <div class="nortex-rot-mapcard">
          <div class="nortex-rot-maphead">
            <div>
              <small id="rotMapEyebrow"></small>
              <h2 id="rotMapTitle"></h2>
            </div>
            <div class="nortex-rot-modebox">
              <span class="mode-label" id="lblUnverified">Sin verificar</span>
              <button type="button" class="nortex-rot-switch is-smart" id="rotModeToggle" role="switch" aria-checked="true" aria-label="Alternar entre lectura sin verificar y recorrido con evidencia NORTEX">
                <span class="switch-knob"></span>
              </button>
              <span class="mode-label active" id="lblVerified">Con evidencia</span>
            </div>
          </div>

          <div class="nortex-rot-landscape">
            <svg viewBox="0 0 1000 390" class="nortex-rot-svg" aria-hidden="true">
              <defs>
                <linearGradient id="nortexValleySky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f0c184"/>
                  <stop offset="55%" stop-color="#f7d6a6"/>
                  <stop offset="100%" stop-color="#fbead0"/>
                </linearGradient>
                <radialGradient id="nortexSunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fff3b0" stop-opacity=".65"/>
                  <stop offset="100%" stop-color="#f7d046" stop-opacity="0"/>
                </radialGradient>
              </defs>

              <rect width="1000" height="390" fill="url(#nortexValleySky)"/>

              <!-- Sun & glow -->
              <circle cx="755" cy="96" r="95" fill="url(#nortexSunGlow)"/>
              <circle cx="755" cy="96" r="34" fill="#f7d046"/>

              <!-- Clouds -->
              <g fill="#fff8ee" opacity=".92" class="ref-cloud">
                <path d="M92 86 C75 86, 68 72, 80 63 C83 47, 108 45, 118 57 C134 50, 152 62, 146 76 C158 80, 152 94, 136 94 H92 Z"/>
                <path d="M225 128 C212 128, 206 117, 216 110 C219 98, 238 96, 246 105 C258 100, 272 109, 267 120 C276 123, 271 134, 259 134 H225 Z" opacity=".85"/>
              </g>

              <!-- Layered San Lorenzo Valley Hills -->
              <path d="M0 245 Q220 150 470 210 T1000 165 V390 H0 Z" fill="#dcba82"/>
              <path d="M0 265 Q190 190 430 255 T860 195 L1000 225 V390 H0 Z" fill="#c79e63"/>
              <path d="M0 305 Q280 245 550 295 T1000 270 V390 H0 Z" fill="#b08549"/>
              <path d="M0 345 Q340 315 660 350 T1000 330 V390 H0 Z" fill="#986f38"/>

              <!-- Valley trees -->
              <g transform="translate(570,162)">
                <rect x="-2.5" y="0" width="5" height="22" rx="2" fill="#6e4726"/>
                <path d="M0 2 C-12 -4, -16 6, -6 9 M0 2 C12 -4, 16 6, 6 9 M0 0 C-8 -10, 8 -10, 0 0" fill="#4e8c40" stroke="#3d7331" stroke-width="1.5"/>
              </g>
              <g transform="translate(868,232)">
                <rect x="-3" y="4" width="6" height="16" rx="2" fill="#6e4726"/>
                <circle cx="0" cy="0" r="10" fill="#4f8f41"/>
                <circle cx="-5" cy="4" r="7" fill="#3d7531"/>
                <circle cx="5" cy="4" r="7" fill="#66a854"/>
              </g>
              <g transform="translate(185,180)">
                <rect x="-3" y="4" width="6" height="16" rx="2" fill="#6e4726"/>
                <circle cx="0" cy="0" r="11" fill="#3d7531"/>
                <circle cx="5" cy="3" r="8" fill="#589949"/>
              </g>

              <!-- Winding Road -->
              <path id="nortexRoadPath" class="reference-road" d="M -20 265 C 90 260, 175 185, 270 195 C 375 205, 415 305, 515 295 C 625 285, 655 135, 765 135 C 855 135, 925 185, 1020 205" fill="none" stroke="#b69667" stroke-width="44" stroke-linecap="round"/>
              <path d="M -20 265 C 90 260, 175 185, 270 195 C 375 205, 415 305, 515 295 C 625 285, 655 135, 765 135 C 855 135, 925 185, 1020 205" fill="none" stroke="#d5b88b" stroke-width="36" stroke-linecap="round"/>
              <path class="quest-trail" d="M -20 265 C 90 260, 175 185, 270 195 C 375 205, 415 305, 515 295 C 625 285, 655 135, 765 135 C 855 135, 925 185, 1020 205" fill="none" stroke="#fff9eb" stroke-width="3" stroke-dasharray="10 14"/>

              <!-- Blue Irrigation Canal at Bottom -->
              <path d="M 0 348 Q 250 325, 515 352 T 1000 326" fill="none" stroke="#2ca4dc" stroke-width="28"/>
              <path class="quest-trail" d="M 0 348 Q 250 325, 515 352 T 1000 326" fill="none" stroke="#bce8fa" stroke-width="2.6" stroke-dasharray="12 18"/>

              <!-- Animated Green Tractor -->
              <g id="nortexTractor" transform="translate(230,155)">
                <g transform="translate(-24,-54)">
                  <rect x="18" y="8" width="20" height="15" rx="3" fill="#259b56" stroke="#134e32" stroke-width="1.8"/>
                  <rect x="21" y="11" width="14" height="9" rx="1.5" fill="#bfe6f7"/>
                  <rect x="6" y="17" width="32" height="12" rx="3" fill="#259b56" stroke="#134e32" stroke-width="1.8"/>
                  <path d="M10 17 V9 H13" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/>
                  <circle cx="13" cy="29" r="7" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
                  <circle cx="13" cy="29" r="3" fill="#facc15"/>
                  <circle cx="32" cy="27" r="9.5" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
                  <circle cx="32" cy="27" r="4.2" fill="#facc15"/>
                </g>
              </g>
            </svg>

            <div class="nortex-rot-stops" id="rotMapStops"></div>
          </div>

          <div class="nortex-rot-mapfoot">
            <button type="button" class="nortex-rot-navbtn prev" id="rotPrevStop">Anterior</button>
            <div class="nortex-rot-dots" id="rotProgressDots" aria-live="polite"></div>
            <button type="button" class="nortex-rot-navbtn next" id="rotNextStop">Siguiente parada</button>
          </div>
        </div>

        <!-- Two-Column Detail & Comparison Section (Image 3) -->
        <div class="nortex-rot-bottom">
          <article class="nortex-rot-stopcard" id="rotStopDetailCard" aria-live="polite"></article>
          <article class="nortex-rot-impactcard" id="rotImpactCard" aria-live="polite"></article>
        </div>

        <!-- Additional NORTEX Context: 6-Crop NASA Catalog + Field Assessment -->
        <div class="nortex-rot-extras">
          <div class="nortex-rot-contextbar" id="rotContextNote"></div>
          <details class="nortex-rot-accordion">
            <summary>Consultar histórico NASA POWER (2021–2025) y evaluar pH / drenaje en los 6 cultivos</summary>
            <div id="rotRealDataHost" style="margin-top:14px"></div>
          </details>
          <details class="nortex-rot-accordion">
            <summary>Registrar análisis de laboratorio, dotación de agua y descargar expediente técnico</summary>
            <div id="rotAssessmentHost" style="margin-top:14px"></div>
          </details>
        </div>
      </div>

      <!-- Floating Action Pill -->
      <button type="button" class="nortex-rot-wa-fab" id="rotWhatsappFab">
        <span>Copiar resumen de ruta para WhatsApp / Técnico</span>
      </button>
    </section>
  `;

  mountRealData(host.querySelector('#rotRealDataHost'),context);
  mountAssessment(host.querySelector('#rotAssessmentHost'),currentFarm,context);

  const road=host.querySelector('#nortexRoadPath');
  const tractor=host.querySelector('#nortexTractor');
  const stopFractions=[0.26,0.51,0.76];

  function moveTractor(){
    if(!road||!tractor)return;
    cancelAnimationFrame(frame);
    const total=road.getTotalLength();
    const target=total*stopFractions[activeStop];
    const from=tractorPos||target;
    const start=performance.now();
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    function tick(now){
      if(!host.isConnected)return;
      const k=reduced?1:Math.min(1,(now-start)/650);
      const ease=1-Math.pow(1-k,3);
      tractorPos=from+(target-from)*ease;
      const pt=road.getPointAtLength(tractorPos);
      tractor.setAttribute('transform',`translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
      if(k<1)frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  }

  function render(){
    const selectedCrop=crops.find(c=>c.name===selectedCropName)||crops[4];
    const isOriginCrop=currentFarm.crop?.toLowerCase().startsWith(selectedCrop.name.toLowerCase());
    activeOptionKey=isOriginCrop?'A':selectedCrop.name==='Arroz'?'B':'C';

    const ev=evaluate(currentFarm);
    const nasaSummary=computeNasaAnnualSummary(context.rows||[]);
    const realEvals=evaluateReal(context.source?.startsWith('NASA POWER')?nasaSummary:null,soilCheck);
    const realEvalItem=realEvals.find(r=>r.name===selectedCrop.name)||realEvals[0];
    const seed=computeSeedProfile(currentFarm,Array.isArray(context.tests)&&context.tests.some(t=>t.farm===currentFarm.name));
    const stops=buildStopsForCrop(currentFarm,selectedCrop,realEvalItem,withEvidence,nasaSummary);
    const stop=stops[activeStop];

    // Top Seed & Climate badge
    host.querySelector('#rotSeedBadge').textContent=`◈ Semilla ${seed.code} · ${context.source||'Clima de referencia'}`;

    // 1. Render 3 White KPI Pills in Hero Header (using real NORTEX data)
    host.querySelector('#rotHeaderKpis').innerHTML=`
      <div class="nortex-rot-kpi">
        <strong>${currentFarm.moisture}%</strong>
        <small>humedad sup. (${currentFarm.days}d)</small>
      </div>
      <div class="nortex-rot-kpi">
        <strong>${ev.compatibility}/100</strong>
        <small>compatibilidad actual</small>
      </div>
      <div class="nortex-rot-kpi">
        <strong>${context.source?.startsWith('NASA POWER')&&nasaSummary.rainTotal!==null?`${Math.round(nasaSummary.rainTotal)} mm`:`IVAP ${ev.ivap}`}</strong>
        <small>${context.source?.startsWith('NASA POWER')&&nasaSummary.rainTotal!==null?'lluvia NASA 2025':ev.status.toLowerCase()}</small>
      </div>
    `;

    // 2. Render Option A / B / C cards
    host.querySelector('#rotOptionCards').innerHTML=Object.values(pathOptions).map(o=>{
      const isSelected=o.id===activeOptionKey;
      return `
        <button type="button" class="nortex-rot-optcard ${isSelected?'active':''}" data-opt="${o.id}" role="tab" aria-selected="${isSelected}">
          <span class="opt-icon">${optionBadgeIcon(o.id)}</span>
          <span class="opt-copy">
            <strong>${esc(o.title)}</strong>
            <small>${esc(o.subtitle)}</small>
          </span>
        </button>
      `;
    }).join('');

    host.querySelectorAll('[data-opt]').forEach(btn=>{
      btn.onclick=()=>{
        const o=pathOptions[btn.dataset.opt];
        if(o){
          activeOptionKey=o.id;
          selectedCropName=o.defaultCrop;
          activeStop=0;
          showWhyDetail=false;
          render();
        }
      };
    });

    // 2b. Render 6-Crop Catalog Pills
    host.querySelector('#rotCropCatalogBar').innerHTML=`
      <span class="catalogbar-label">Cultivo a recorrer (${crops.length} en catálogo):</span>
      <div class="catalogbar-pills">
        ${crops.map(c=>`
          <button type="button" class="catalog-pill ${c.name===selectedCrop.name?'active':''}" data-crop-pill="${esc(c.name)}" aria-pressed="${c.name===selectedCrop.name}">
            <span>${c.symbol}</span> ${esc(c.name)}
          </button>
        `).join('')}
      </div>
    `;
    host.querySelectorAll('[data-crop-pill]').forEach(btn=>{
      btn.onclick=()=>{
        selectedCropName=btn.dataset.cropPill;
        activeStop=0;
        showWhyDetail=false;
        render();
      };
    });

    // 3. Render Map Header & Toggle
    const optInfo=pathOptions[activeOptionKey];
    host.querySelector('#rotMapEyebrow').textContent=`${optInfo.title} · ${optInfo.subtitle} · ${withEvidence?'Con verificación NORTEX':'Sin verificar en campo'}`;
    host.querySelector('#rotMapTitle').textContent=stops.map(s=>s.short).join(' → ');
    const toggleBtn=host.querySelector('#rotModeToggle');
    toggleBtn.setAttribute('aria-checked',String(withEvidence));
    toggleBtn.classList.toggle('is-smart',withEvidence);
    host.querySelector('#lblUnverified').classList.toggle('active',!withEvidence);
    host.querySelector('#lblVerified').classList.toggle('active',withEvidence);

    // 4. Render 3 Stops on the Winding Road
    const coords=[
      {left:'25%',top:'54%'},
      {left:'50.5%',top:'69%'},
      {left:'75.5%',top:'36%'}
    ];
    host.querySelector('#rotMapStops').innerHTML=stops.map((s,i)=>{
      const isCurrent=i===activeStop;
      return `
        <button type="button" class="nortex-stop-node ${isCurrent?'active':''}" data-stop="${i}" style="left:${coords[i].left};top:${coords[i].top}" aria-current="${isCurrent?'step':'false'}">
          <span class="stop-ring">
            <i class="stop-num">${i+1}</i>
            ${cropArtwork(s.icon)}
          </span>
          <strong class="stop-label">${esc(s.short)}</strong>
        </button>
      `;
    }).join('');

    host.querySelectorAll('[data-stop]').forEach(btn=>{
      btn.onclick=()=>{
        activeStop=Number(btn.dataset.stop);
        showWhyDetail=false;
        render();
      };
    });

    // 5. Render Bottom Controls of Map Card
    host.querySelector('#rotPrevStop').disabled=activeStop===0;
    host.querySelector('#rotNextStop').disabled=activeStop===stops.length-1;
    host.querySelector('#rotProgressDots').innerHTML=`
      <span class="dots-track">
        ${stops.map((_,i)=>`<i class="dot ${i===activeStop?'active':''}"></i>`).join('')}
      </span>
      <strong class="dots-count">${activeStop+1} / ${stops.length}</strong>
    `;

    // 6. Render Left Detail Card (Current Stop)
    host.querySelector('#rotStopDetailCard').innerHTML=`
      <div class="stopcard-head">
        <div class="stopcard-icon">${cropArtwork(stop.icon)}</div>
        <div>
          <small class="stopcard-eyebrow">${esc(stop.season)}</small>
          <h3>${esc(stop.title)}</h3>
        </div>
      </div>

      <p class="stopcard-question">
        <strong>${esc(stop.question)}</strong><br>
        ${esc(stop.answer)}
      </p>

      <div class="stopcard-badges">
        <span class="stop-pill water">💧 ${esc(stop.waterBadge)}</span>
        <span class="stop-pill soil">🌱 ${esc(stop.soilBadge)}</span>
        <span class="stop-pill extra">📋 ${esc(stop.extraBadge)}</span>
      </div>

      <button type="button" class="stopcard-why-btn" id="btnToggleWhy" aria-expanded="${showWhyDetail}">
        ¿Por qué este cultivo aquí?
      </button>

      <div class="stopcard-why-box" ${showWhyDetail?'':'hidden'}>
        <strong>Fundamento y límites NORTEX (${esc(stop.sourceName)})</strong>
        <p>${esc(stop.why)}</p>
        ${stop.sourceUrl?`<p class="why-meta"><a href="${esc(stop.sourceUrl)}" target="_blank" rel="noopener">Ver fuente técnica oficial (${esc(stop.sourceName)}) ↗</a></p>`:''}
      </div>
    `;

    host.querySelector('#btnToggleWhy').onclick=()=>{
      showWhyDetail=!showWhyDetail;
      render();
    };

    // 7. Render Right Comparison Card ("Qué cambia en tu parcela" using real NORTEX metrics)
    const waterRisk=ev.water;
    const compatScore=ev.compatibility;
    const heatRisk=ev.heat;

    host.querySelector('#rotImpactCard').innerHTML=`
      <h3>Qué cambia en tu parcela</h3>
      <p class="impact-sub">La marca oscura indica el umbral de referencia NORTEX · Escenario: ${esc(currentFarm.name)} (${esc(currentFarm.crop)} · suelo ${esc(currentFarm.soil)}).</p>

      <div class="impact-metric">
        <div class="impact-row">
          <span>Presión de agua en el escenario (Regla H1)</span>
          <strong>${waterRisk} <small>/ 100</small></strong>
        </div>
        <div class="impact-track">
          <div class="impact-fill water" style="width:${Math.max(8,waterRisk)}%"></div>
          <i class="impact-marker" style="left:35%" title="Umbral de atención NORTEX: 35 / 100"></i>
        </div>
        <small class="impact-delta ${waterRisk<35?'good':'warn'}">
          ${waterRisk>=35
            ?`▲ Supera el umbral de 35 pts (${currentFarm.moisture}% sup. · ${currentFarm.days} días sin riego): comprobar raíces a 30 cm`
            :`▼ Dentro del rango estable (< 35 pts) · verificar humedad radicular en campo`}
        </small>
      </div>

      <div class="impact-metric">
        <div class="impact-row">
          <span>Compatibilidad del escenario actual</span>
          <strong>${compatScore} <small>/ 100</small></strong>
        </div>
        <div class="impact-track">
          <div class="impact-fill soil" style="width:${Math.max(8,compatScore)}%"></div>
          <i class="impact-marker" style="left:75%" title="Referencia favorable NORTEX: 75 / 100"></i>
        </div>
        <small class="impact-delta ${compatScore>=75?'good':'warn'}">
          ${compatScore>=75
            ?`▲ Encaje favorable (${compatScore}/100) para ${esc(currentFarm.crop)} en ${esc(currentFarm.stage)}`
            :`▼ Penalización de −${100-compatScore} pts por agua, calor o textura ${esc(currentFarm.soil)}`}
        </small>
      </div>

      <div class="impact-metric">
        <div class="impact-row">
          <span>Presión térmica y estado de ${esc(selectedCrop.name)}</span>
          <strong>${heatRisk} <small>/ 100</small></strong>
        </div>
        <div class="impact-track">
          <div class="impact-fill return" style="width:${Math.max(8,heatRisk)}%"></div>
          <i class="impact-marker" style="left:25%" title="Umbral de revisión térmica: 25 / 100"></i>
        </div>
        <small class="impact-delta ${heatRisk<25&&!realEvalItem.alerts.length?'good':'warn'}">
          ${realEvalItem.alerts.length
            ?`▲ Alerta en ${esc(selectedCrop.name)}: ${esc(realEvalItem.alerts[0])}`
            :`● Temperatura sup. ${currentFarm.surface} °C · ${esc(selectedCrop.name)}: ${esc(realEvalItem.status)} (faltan ${realEvalItem.unknown.length} evidencias)`}
        </small>
      </div>

      <p class="impact-disclaimer">
        Indicadores heurísticos de NORTEX v2. No se calculan ganancias en dólares ni ahorros de agua sin costos locales, turno de riego y análisis de suelo.
      </p>
    `;

    // 8. Context note
    const evidenceNotes=decisionEvidence(currentFarm,context).notes;
    host.querySelector('#rotContextNote').innerHTML=`
      <div>
        <strong>Evidencia del escenario (${esc(currentFarm.crop)} · ${esc(currentFarm.stage)}):</strong>
        <span>${selectedCrop.name==='Arroz'
          ?(currentFarm.annual?'Lote anual separado declarado como disponible para evaluar campaña de arroz.':'El arroz requiere un lote anual separado; no sustituye plantaciones establecidas de mango o limón.')
          :'Las alternativas perennes implican manejo o reconversión a largo plazo, no rotación anual.'}</span>
      </div>
      <details style="margin-top:6px">
        <summary style="cursor:pointer;font-weight:700;color:#064e3b">Ver las ${evidenceNotes.length} notas de evidencia y límites de tu finca</summary>
        <ul style="margin:8px 0 0 18px;padding:0;font-size:13px;line-height:1.6">
          ${evidenceNotes.map(n=>`<li>${esc(n)}</li>`).join('')}
        </ul>
      </details>
    `;

    moveTractor();
  }

  // Event Listeners
  host.querySelector('#rotBackMenu').onclick=()=>context.onBack?.();
  host.querySelector('#rotBackHome').onclick=()=>context.onHome?.();

  host.querySelector('#rotParcelSelect').onchange=e=>{
    const chosen=parcelChoices.find(p=>p.id===e.target.value);
    if(chosen){
      currentFarm={...currentFarm,...chosen.data};
      host.querySelector('#rotSoilSelect').value=currentFarm.soil;
      context.onUpdateFarm?.(currentFarm);
      render();
    }
  };

  host.querySelector('#rotSoilSelect').onchange=e=>{
    currentFarm={...currentFarm,soil:e.target.value};
    context.onUpdateFarm?.(currentFarm);
    render();
  };

  host.querySelector('#rotModeToggle').onclick=()=>{
    withEvidence=!withEvidence;
    render();
  };

  host.querySelector('#rotPrevStop').onclick=()=>{
    if(activeStop>0){
      activeStop--;
      showWhyDetail=false;
      render();
    }
  };

  host.querySelector('#rotNextStop').onclick=()=>{
    if(activeStop<2){
      activeStop++;
      showWhyDetail=false;
      render();
    }
  };

  host.querySelector('#rotWhatsappFab').onclick=async()=>{
    const selectedCrop=crops.find(c=>c.name===selectedCropName)||crops[4];
    const ev=evaluate(currentFarm);
    const seed=computeSeedProfile(currentFarm,false);
    const text=`Resumen NORTEX · Valle de San Lorenzo\n`+
      `• Semilla del escenario: ${seed.code}\n`+
      `• Finca: ${currentFarm.name} (${currentFarm.area} ha · Suelo ${currentFarm.soil})\n`+
      `• Cultivo actual: ${currentFarm.crop} (${currentFarm.stage}) → Alternativa explorada: ${selectedCrop.symbol} ${selectedCrop.name} (${selectedCrop.type})\n`+
      `• Señales del escenario: Agua ${ev.water}/100 (${currentFarm.moisture}% sup., ${currentFarm.days}d sin riego) · Compatibilidad ${ev.compatibility}/100 · IVAP ${ev.ivap}/100\n`+
      `• Pendiente de verificar en campo con técnico: humedad radicular a 30 cm, pH de laboratorio, drenaje y dotación de riego.`;
    const btn=host.querySelector('#rotWhatsappFab span');
    try{
      await navigator.clipboard.writeText(text);
      btn.textContent='✓ Resumen copiado al portapapeles';
      setTimeout(()=>{btn.textContent='Copiar resumen de ruta para WhatsApp / Técnico';},3500);
    }catch{}
  };

  render();
}
