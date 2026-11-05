let controller;
export function closeMenu(){controller?.close();}
export function setupMenu(sidebar){
 if(controller)return;
 sidebar.id='fieldSidebar';document.body.classList.add('drawer-layout');
 const button=document.createElement('button');button.type='button';button.id='menuToggle';button.setAttribute('aria-controls',sidebar.id);button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Abrir menú');button.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Menú</span>';
 const edge=document.createElement('div');edge.id='menuEdge';edge.setAttribute('aria-hidden','true');
 const shade=document.createElement('div');shade.id='menuShade';shade.setAttribute('aria-hidden','true');
 document.body.append(edge,shade,button);
 let timer=null,opened=false,pinned=false;
 const cancel=()=>{clearTimeout(timer);timer=null;};
 function open(){if(document.body.classList.contains('onboarding'))return;cancel();opened=true;sidebar.inert=false;document.body.classList.add('menu-open');button.setAttribute('aria-expanded','true');button.setAttribute('aria-label','Cerrar menú');button.querySelector('span').textContent='Cerrar';}
 function close(){cancel();if(sidebar.contains(document.activeElement))button.focus({preventScroll:true});opened=false;pinned=false;sidebar.inert=true;document.body.classList.remove('menu-open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Abrir menú');button.querySelector('span').textContent='Menú';}
 function later(){cancel();timer=setTimeout(()=>{if(!pinned&&!sidebar.contains(document.activeElement)&&document.activeElement!==button)close();},350);}
 function hover(e){if(e.pointerType==='mouse'&&matchMedia('(hover: hover)').matches)open();}
 edge.addEventListener('pointerenter',hover);button.addEventListener('pointerenter',hover);sidebar.addEventListener('pointerenter',cancel);
 edge.addEventListener('pointerleave',later);button.addEventListener('pointerleave',later);sidebar.addEventListener('pointerleave',later);
 button.onclick=()=>{if(pinned){close();return;}open();pinned=true;sidebar.querySelector('#nav button')?.focus();};
 sidebar.addEventListener('focusin',open);sidebar.addEventListener('focusout',later);
 shade.onclick=close;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened&&!document.querySelector('dialog[open]')){close();button.focus();}});
 const observer=new MutationObserver(()=>{if(document.body.classList.contains('onboarding')&&opened)close();});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 controller={close};close();
}
