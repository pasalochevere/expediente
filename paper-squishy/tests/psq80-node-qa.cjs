const fs=require('fs'),path=require('path'),vm=require('vm'),JSZip=require('jszip');
const root=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(root,'paper-squishy/psq80-butter-extension.js'),'utf8');
const base=path.join(root,'paper-squishy');
const chars=Array.from({length:60},(_,i)=>({id:'stable_'+(i+1),code:'SQ'+String(i+1).padStart(3,'0'),collection_id:'stable_'+Math.floor(i/10)}));
const originalJSON=JSON.stringify(chars);
const collections=Array.from({length:6},(_,i)=>({id:'stable_'+i,order:i+1}));
const win={PS_LIBRARY:{characters:chars,collections},PSQ_V27:{active:true},JSZip};
let seq=0;const images=[];
const mockURL={createObjectURL(blob){images.push(blob);return 'blob:psq80-'+(++seq)}};
const fakeDocument={getElementById(){return null},addEventListener(){}};
function readLocal(raw){
 const name=raw.split(/[?#]/)[0].replace(/^\.\//,'');
 const full=path.resolve(base,name);
 if(!full.startsWith(base+path.sep))throw Error('unsafe path');
 return fs.readFileSync(full);
}
const mockFetch=async raw=>{
 try{
  const data=readLocal(raw);
  return {ok:true,status:200,arrayBuffer:async()=>data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),json:async()=>JSON.parse(data.toString('utf8'))};
 }catch{return{ok:false,status:404}}
};
const env={window:win,Blob,URL:mockURL,document:fakeDocument,console,setTimeout,fetch:mockFetch};
vm.runInNewContext(source,env,{filename:'psq80-butter-extension.js'});
(async()=>{
 for(let i=0;i<100&&!win.PSQ80_EXTENSION?.ready&&!win.PSQ80_EXTENSION?.errors?.length;i++)await new Promise(r=>setTimeout(r,100));
 const state=win.PSQ80_EXTENSION,lib=win.PS_LIBRARY;
 if(!state.ready||state.errors.length)throw Error(JSON.stringify(state.errors));
 if(lib.characters.length!==80||lib.collections.length!==7||state.assets!==180)throw Error('Count mismatch');
 if(JSON.stringify(lib.characters.slice(0,60))!==originalJSON)throw Error('Original 60 mutated');
 if(new Set(lib.characters.map(x=>x.id)).size!==80)throw Error('Duplicate ID');
 for(const ch of lib.characters.slice(60)){
  if(!/^BM\d\d$/.test(ch.code))throw Error(ch.code);
  if(Object.keys(ch.assets).length!==9)throw Error('Missing views '+ch.code);
 }
 for(const blob of images){
  const sig=Buffer.from(await blob.slice(0,4).arrayBuffer()).toString('latin1');
  if(sig!=='RIFF')throw Error('Non-WebP blob');
 }
 console.log('PASS PSQ80: 60 ORIGINALS UNTOUCHED + 20 BUTTER, 7 COLLECTIONS, 180 WEBP IMAGES');
})().catch(e=>{console.error(e);process.exitCode=1});
