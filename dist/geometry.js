import {boundary,inside} from './core.js';
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const on=(a,b,p)=>Math.abs(cross(a,b,p))<1e-12&&p[0]>=Math.min(a[0],b[0])-1e-12&&p[0]<=Math.max(a[0],b[0])+1e-12&&p[1]>=Math.min(a[1],b[1])-1e-12&&p[1]<=Math.max(a[1],b[1])+1e-12;
function intersects(a,b,c,d){const x=cross(a,b,c),y=cross(a,b,d),z=cross(c,d,a),w=cross(c,d,b);return (x*y<0&&z*w<0)||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b);}
export function contains(ring,p){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[j],b=ring[i];if(on(a,b,p))return true;if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export function geometry(ring){
 const lat=ring.reduce((s,p)=>s+p[1],0)/ring.length,scale=Math.cos(lat*Math.PI/180),R=6371008.8,rad=Math.PI/180;
 const xy=ring.map(([x,y])=>[x*rad*R*scale,y*rad*R]);let twice=0,cx=0,cy=0,perimeter=0;
 for(let i=0;i<xy.length;i++){const a=xy[i],b=xy[(i+1)%xy.length],v=a[0]*b[1]-b[0]*a[1];twice+=v;cx+=(a[0]+b[0])*v;cy+=(a[1]+b[1])*v;perimeter+=Math.hypot(b[0]-a[0],b[1]-a[1]);}
 let center=Math.abs(twice)>1e-6?[cx/(3*twice)/(rad*R*scale),cy/(3*twice)/(rad*R)]:ring[0];
 // A concave polygon's centroid can fall outside; choose an interior scanline point.
 if(!contains(ring,center)){const minY=Math.min(...ring.map(p=>p[1])),maxY=Math.max(...ring.map(p=>p[1]));outer:for(let t=1;t<100;t++){const y=minY+(maxY-minY)*t/100,xs=[];for(let i=0;i<ring.length;i++){let a=ring[i],b=ring[(i+1)%ring.length];if((a[1]>y)!==(b[1]>y))xs.push(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){const p=[(xs[i]+xs[i+1])/2,y];if(contains(ring,p)){center=p;break outer;}}}}
 return {hectares:Math.abs(twice)/2/10000,perimeter_m:perimeter,reference:{lat:center[1],lon:center[0]},geojson:{type:'Polygon',coordinates:[[...ring,ring[0]]]}};
}
export function validatePolygon(ring){
 if(ring.length<3)return 'Dibuja al menos tres vértices.';
 if(ring.length>80)return 'Usa como máximo 80 vértices.';
 if(ring.some(p=>p.length!==2||!p.every(Number.isFinite)))return 'Coordenadas inválidas.';
 if(ring.some(([x,y])=>!inside(y,x)))return 'Todo el terreno debe quedar dentro de la zona piloto.';
 for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];if(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8)return 'Hay vértices repetidos.';for(let j=i+1;j<ring.length;j++){if(j===i+1||(i===0&&j===ring.length-1))continue;if(intersects(a,b,ring[j],ring[(j+1)%ring.length]))return 'Los bordes no pueden cruzarse ni tocarse entre sí.';}for(let j=0;j<boundary.length-1;j++)if(intersects(a,b,boundary[j],boundary[j+1]))return 'Un borde sale de la zona piloto. Ajusta la figura.';}
 if(geometry(ring).hectares<0.001)return 'La figura no tiene una superficie suficiente. Separa los vértices.';
 return null;
}
