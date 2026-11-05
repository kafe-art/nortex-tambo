import {risks} from './ai/predict.js';
export function decisionEvidence(f,{rows=[],source='',prediction=null}={}){
 const r=risks(f),valid=rows.filter(x=>Number.isFinite(x.temp)),last=valid.at(-1);
 return {crop:f.crop,stage:f.stage,source:source||'Sin clima cargado',last,risks:r,prediction,notes:[
 'Cultivo del escenario: '+f.crop+' · etapa: '+f.stage+'. Confirma que corresponde a tu finca.',
 r.missing.length?'Faltan lecturas para interpretar agua y calor.':r.water>=35?'La regla de agua pide revisar humedad en raíces y disponibilidad de riego antes de añadir otro cultivo.':'La regla de agua no marca una señal fuerte; esto no confirma que sobre agua para otro cultivo.',
 r.missing.length?'No se calcula una señal térmica sin lecturas completas.':r.heat>=25?'La temperatura superficial activa una revisión del calor en este escenario. No equivale a temperatura del aire.':'La regla térmica no marca una señal fuerte en este escenario.',
 last?'Último registro del conjunto cargado: '+last.date+' · máxima del aire '+last.temp.toFixed(1)+' °C. Es histórico, no clima de hoy.':'Sin registros climáticos utilizables.',
 prediction?'Hay un experimento de predicción disponible: se conserva como evidencia histórica, no determina por sí solo qué sembrar.':'Aún no ejecutaste una predicción en el módulo de clima.',
 'El catálogo anual usa agua, tiempo y lote separado. No tiene un modelo validado que convierta el clima en aptitud o rendimiento de cada rotación.'
 ]};}
