import {experiment} from './forest.js';
self.onmessage=({data})=>{try{self.postMessage({result:experiment(data.rows,data.source)})}catch(e){self.postMessage({error:e.message})}};
