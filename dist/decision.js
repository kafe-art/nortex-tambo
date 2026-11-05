import {mountRotationStage} from './rotation-stage.js';
export function mountDecision(container,farm,context={}){container.replaceChildren();const host=document.createElement('div');container.append(host);mountRotationStage(host,farm,context);}
