import {inside} from './core.js';
export const parameters=['T2M','T2M_MAX','T2M_MIN','PRECTOTCORR','RH2M','WS2M','ALLSKY_SFC_SW_DWN'];
const labels=['Temperatura media del aire','Temperatura máxima diaria (promedio)','Temperatura mínima diaria (promedio)','Precipitación acumulada disponible','Humedad relativa del aire','Viento a 2 metros','Radiación solar diaria (promedio)'];
export const missing=[
 ['Geometría y superficie','Un punto no define los límites ni las hectáreas de la finca.','Polígono catastral o levantamiento GPS.'],
 ['Cultivo, variedad y fenología','No se deducen de la serie meteorológica.','Registro de campaña o inspección del cultivo.'],
 ['Textura, pH, salinidad y nutrientes','Sin análisis de suelo conectado; no usar valores ficticios.','Análisis de laboratorio con fecha y profundidad.'],
 ['Carbono, densidad y profundidad efectiva','Sin medición o capa edáfica validada.','Muestreo o mapa de suelo con incertidumbre documentada.'],
 ['Humedad superficial y radicular','Humedad del aire no es humedad del suelo.','Sensor de campo o producto SMAP compatible, por integrar.'],
 ['Temperatura foliar y estrés observado','Temperatura del aire no mide hojas ni diagnostica estrés.','Medición local; ECOSTRESS de superficie por integrar.'],
 ['Riego, último turno y volumen disponible','La lluvia no revela turnos ni derechos de agua.','Registro de finca o integración con la Junta de Usuarios.'],
 ['Manejo, fertilización e historial','No son observables mediante POWER.','Registros de finca o documentos de campaña.'],
 ['Rendimiento, costos, precios y prioridades','No se pueden inferir fiablemente desde coordenadas.','Registros productivos y económicos del agricultor.'],
 ['Plagas, enfermedades y drenaje','No se diagnostican con clima de rejilla.','Inspección y validación agronómica.'],
 ['Vegetación, pendiente y evapotranspiración','No están integradas en esta ficha.','Productos específicos y métodos validados, por integrar.']
];
export function summarize(data,point){
 if(!inside(point.lat,point.lon))throw Error('Punto fuera de la zona piloto');
 const p=data.properties?.parameter;if(!p)throw Error('Respuesta sin datos climáticos');
 const valid=v=>typeof v==='number'&&Number.isFinite(v)&&v!==-999&&v!==data.header?.fill_value;
 const fields=parameters.map((key,i)=>{const items=Object.entries(p[key]||{}).filter(([d,v])=>/^2025\d{4}$/.test(d)&&valid(v));const values=items.map(([,v])=>v);return {key,label:labels[i],value:values.length?values.reduce((a,b)=>a+b,0)/(key==='PRECTOTCORR'?1:values.length):null,unit:key==='PRECTOTCORR'?'mm':data.parameters?.[key]?.units||'unidad no informada',days:values.length,expected:365,kind:'Derivado de histórico de rejilla'};});
 const rain=p.PRECTOTCORR||{};let dry=0,longest=0,hot=0,hotDays=0;for(let i=0;i<365;i++){let d=new Date(Date.UTC(2025,0,i+1)).toISOString().slice(0,10).replaceAll('-','');dry=valid(rain[d])&&rain[d]<1?dry+1:0;longest=Math.max(longest,dry);if(valid(p.T2M_MAX?.[d])){hotDays++;if(p.T2M_MAX[d]>32)hot++;}}
 const elev=data.geometry?.coordinates?.[2];
 return {point:{...point},period:'2025-01-01 / 2025-12-31',retrieved_at:new Date().toISOString(),source:'NASA POWER',url:'https://power.larc.nasa.gov/docs/services/api/temporal/daily/',resolution:'Datos de rejilla; no representan medición puntual de parcela. Consultar resolución por producto en la fuente.',fields,elevation:valid(elev)?elev:null,longest_dry_run:longest,hot_days:hot,valid_temperature_days:hotDays,missing,summary:`Ficha histórica 2025 para ${point.lat.toFixed(4)}, ${point.lon.toFixed(4)}. ${fields.filter(f=>f.value!==null).length} variables climáticas disponibles. Se registran ${hot} días con temperatura máxima del aire superior a 32 °C entre ${hotDays} días válidos; es un conteo descriptivo, no un diagnóstico. La mayor secuencia observada de lluvia inferior a 1 mm/día fue de ${longest} días; los faltantes interrumpen la secuencia. Esto no determina la disponibilidad de riego ni las condiciones actuales de la finca.`};
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountProfile(container,getPoint,onSeries){
 const point={...getPoint()};let result=null;
 container.innerHTML=`<div class="card hero"><h2>Describe el campo con un punto en el mapa</h2><p>Sin transcribir datos climáticos. NORTEX consulta fuentes, calcula indicadores y redacta una ficha con lo conocido y lo pendiente.</p><p>Punto seleccionado: ${point.lat.toFixed(4)}, ${point.lon.toFixed(4)} · Laboratorio histórico 2025</p><button class="primary" id="generateProfile">Generar descripción automática</button><p>Se enviarán estas coordenadas a NASA POWER al consultar. No se enviarán nombres ni registros privados de la parcela.</p></div><p id="profileStatus" role="status"></p><div id="profileResult"></div>`;
 const button=container.querySelector('#generateProfile'),status=container.querySelector('#profileStatus'),output=container.querySelector('#profileResult');
 button.onclick=async()=>{button.disabled=true;status.textContent='Consultando NASA POWER y preparando la ficha…';try{
 if(!inside(point.lat,point.lon))throw Error('Selecciona un punto dentro de la zona piloto');
 const key=`nortex-profile-v1-${point.lat.toFixed(3)}-${point.lon.toFixed(3)}`;let data;try{data=JSON.parse(localStorage.getItem(key)||'null')}catch{}
 if(!data){const query=new URLSearchParams({parameters:parameters.join(','),community:'AG',latitude:point.lat.toFixed(3),longitude:point.lon.toFixed(3),start:'20250101',end:'20251231',format:'JSON','time-standard':'LST'});const response=await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?${query}`,{signal:AbortSignal.timeout(45000)});if(!response.ok)throw Error(`NASA respondió ${response.status}`);data=await response.json();}
 result=summarize(data,point);if(!result.fields.some(f=>f.value!==null))throw Error('No hay valores válidos para construir la ficha');try{localStorage.setItem(key,JSON.stringify(data))}catch{}
 if(getPoint().lat!==point.lat||getPoint().lon!==point.lon)return;
 onSeries(data,result);status.textContent='Ficha generada con datos históricos reales. No se completan faltantes con datos de demostración.';
 output.innerHTML=`<div class="card" style="margin-bottom:20px"><h2>Descripción del entorno agrícola</h2><p>${escape(result.summary)}</p><button id="downloadProfile">↓ Descargar ficha completa</button><p>Redacción automática por reglas, sin un LLM externo. Fecha de consulta: ${escape(result.retrieved_at)}.</p></div><div class="grid"><div class="card"><h2>Características obtenidas automáticamente</h2><p>${escape(result.resolution)}</p>${result.fields.map(f=>`<div class="row"><div>${escape(f.label)}<small>${f.days}/365 días válidos · NASA POWER</small></div><strong>${f.value===null?'Sin datos':f.value.toFixed(2)+' '+escape(f.unit)}</strong></div>`).join('')}<div class="row"><span>Elevación de referencia del producto<small>No es levantamiento topográfico</small></span><strong>${result.elevation===null?'Sin datos':result.elevation.toFixed(1)+' m'}</strong></div><p>Los promedios utilizan solo días válidos. La lluvia es un acumulado parcial si faltan días. Un año no define la climatología a largo plazo.</p><a href="${result.url}" target="_blank" rel="noopener">Ver metodología y resolución NASA POWER</a></div><div class="card"><h2>Características que todavía faltan</h2><p>La ficha enumera todos los grupos requeridos por el proyecto. Los siguientes no pueden completarse automáticamente con la fuente conectada.</p>${missing.map(([title,why,next])=>`<div class="row"><div><strong>${escape(title)}</strong><p>${escape(why)}</p><small>Cómo obtenerlo: ${escape(next)}</small></div></div>`).join('')}</div></div>`;
 output.querySelector('#downloadProfile').onclick=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='nortex-ficha-automatica.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
 }catch(e){status.textContent=`No se pudo generar la ficha: ${e.message}. Puedes reintentar. No se inventaron características.`;}finally{button.disabled=false;}};
}
