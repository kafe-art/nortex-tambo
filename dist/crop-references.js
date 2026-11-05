import {crops} from './crop-catalog.js';
export const cropReferences={scope:'Catálogo definido por el proyecto. No implica aptitud agronómica ni presencia local comprobada de todos los cultivos.',crops};
export function referenceCards(){return '<h3>Seis alternativas para evaluar</h3><p>'+cropReferences.scope+'</p><div class="rotation-compare-grid">'+crops.map(c=>'<article><h4>'+c.symbol+' '+c.name+'</h4><strong>'+c.type+'</strong><p>'+c.action+'</p><small>Por evaluar: suelo, agua, variedad, clima, inversión y mercado.</small></article>').join('')+'</div>';}
