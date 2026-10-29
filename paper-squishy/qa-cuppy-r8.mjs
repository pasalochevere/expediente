// R8-R3 — controles sin red ni credenciales, ejecutar: node paper-squishy/qa-cuppy-r8.mjs
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
const folder=path.join(path.dirname(new URL(import.meta.url).pathname),'cp34b1-r8-assets');
const expected={
cuppy_original_front:['fc0a025f20fc1c2b216672cf41d3562c45254c72f50173839557e41aa6e68856',1207817],
cuppy_original_back:['d99ba1a258876869c1aba5b199217ac9af158d7f591ce6f5240d216cec7bfaf9',1203006],
cuppy_lavanda_front:['6b5e313147207b5b2c05698afe4730b63be46520d3e9f12ec31c9cc588ab24c7',1226852],
cuppy_lavanda_back:['b43fd23bc7936700b519457a63dde3a3013af0abd58709bc486ed8c32b9e9676',1201971],
cuppy_menta_front:['a4be19541ea48e00ba56c1a6a3253ef42d25a87bd756bcffea9e45d24a04124a',1227140],
cuppy_menta_back:['7b42d5478e35eadc920fb36ca4b1577b30586c2c45ac1e9e1b6774bc466378ff',1208252]
};
let passed=0,failed=0;
function assert(name,pass){(pass?passed++:failed++);console.log((pass?'PASS ':'FAIL ')+name);}
const script=fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname),'psq-cuppy-r8-staging.js'),'utf8');
assert('release flag is restrictive',script.includes("get(FLAG)==='preview'")&&script.includes('isSafeHost'));
assert('server licence verification exists',script.includes("functions.invoke('pasalochevere-access'")&&script.includes('server-license-not-verified'));
assert('the six exact local paths are configured',Object.keys(expected).every(k=>script.includes(k+'.png')));
const sig=Buffer.from([137,80,78,71,13,10,26,10]);
for(const [name,[hash,bytes]] of Object.entries(expected)){
const file=path.join(folder,name+'.png');
if(!fs.existsSync(file)){assert(name+' exists',false);continue;}
const buf=fs.readFileSync(file);
assert(name+' integrity',buf.length===bytes&&createHash('sha256').update(buf).digest('hex')===hash);
assert(name+' format and A4 pixel geometry',buf.subarray(0,8).equals(sig)&&buf.readUInt32BE(16)===1364&&buf.readUInt32BE(20)===1929);
}
console.log('R8-R3: '+passed+' passed, '+failed+' failed'+(failed?' (stage NOT READY)':' (static checks OK)'));
if(failed)process.exitCode=1;
