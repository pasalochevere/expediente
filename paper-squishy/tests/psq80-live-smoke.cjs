const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const results=[];
 try{
  for(const width of [390,1280]){
   const page=await browser.newPage({viewport:{width,height:850}});
   const pageErrors=[];
   page.on('pageerror',e=>pageErrors.push(e.message));
   const url='https://pasalochevere.github.io/expediente/paper-squishy/factory-80-preview.html';
   await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
   try{await page.waitForFunction(()=>window.PSQ80_EXTENSION?.ready===true||window.PSQ80_EXTENSION?.errors?.length>0,null,{timeout:85000});}
   catch(e){const x=await page.evaluate(()=>({title:document.title,extension:window.PSQ80_EXTENSION||null,library:window.PS_LIBRARY?.characters?.length,content:document.body?.textContent?.slice(0,900)}));throw Error('Timed out '+width+'px '+JSON.stringify(x));}
   const data=await page.evaluate(()=>({title:document.title,extension:window.PSQ80_EXTENSION,characters:window.PS_LIBRARY?.characters?.length,collections:window.PS_LIBRARY?.collections?.length,stable:window.PSQ_V27?.active}));
   if(!data.extension.ready||data.characters!==80||data.collections!==7||data.extension.assets!==180)throw Error('Bad preview '+JSON.stringify(data).slice(0,3000));
   results.push({width,status:'PASS',characters:data.characters,collections:data.collections,views:data.extension.assets,pageErrors:pageErrors.slice(0,10)});
   await page.close();
  }
  console.log('LIVE PSQ80 STAGING PASS',JSON.stringify(results));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
