import {readdir,readFile,access} from 'node:fs/promises';
import {resolve,dirname,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../dist');
async function walk(dir){const all=[];for(const e of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,e.name);all.push(...e.isDirectory()?await walk(path):[path]);}return all;}
const files=await walk(root);
await access(resolve(root,'index.html'));
let references=0;
for(const file of files){
 const ext=extname(file);if(!['.js','.html','.css'].includes(ext))continue;
 const text=await readFile(file,'utf8');
 if(ext==='.js')execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
 const refs=ext==='.html'?[...text.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(x=>x[1]):ext==='.js'?[...text.matchAll(/(?:from\s*|import\s*|new URL\(\s*)["'](\.[^"']+)["']/g)].map(x=>x[1]):[];
 for(const ref of refs){if(/^(?:https?:|data:|#)/.test(ref))continue;const path=resolve(dirname(file),ref.split(/[?#]/)[0]);if(relative(root,path).startsWith('..'))throw Error('Reference outside dist: '+ref);await access(path);references++;}
}
console.log(`Static site checked: ${files.length} files, ${references} local references, JavaScript syntax valid.`);
