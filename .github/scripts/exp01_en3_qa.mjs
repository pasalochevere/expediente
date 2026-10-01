import {chromium} from 'playwright-core';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME,args:['--no-sandbox']});
const result=[];
const ck=(name,value,detail='')=>{result.push([name,!!value,detail]);if(!value)throw new Error(`${name}: ${detail}`)};

try{
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')pageErrors.push('console:'+m.text())});
  await page.goto('http://127.0.0.1:4173/caso001/?lang=en&skipintro=1',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1300);

  const debug=await page.evaluate(async()=>{
    let imported=null,importError=null;
    try{const m=await import('./content-en.js');imported={stats:m.contentTranslationStats(),sample:m.translateGameContent('La Última Reunión')}}catch(e){importError=String(e)}
    return {lang:document.documentElement.lang,title:document.querySelector('header h1')?.textContent||'',imported,importError};
  });
  console.log('EN3_DEBUG',JSON.stringify({debug,pageErrors}));
  const actualTitle=await page.locator('header h1').textContent();
  ck('main title EN',actualTitle==='The Last Meeting',JSON.stringify({actualTitle,debug,pageErrors}));
  ck('main narrative EN',(await page.locator('.subtitle').textContent()).startsWith('Six people.'));
  ck('profile EN',(await page.locator('#characterDossierPreview').textContent()).includes('Partner at the firm'));
  ck('location EN',(await page.locator('#locationChips').textContent()).includes('Living room'));
  ck('object EN',(await page.locator('#objectChips').textContent()).includes('Weapon'));

  const stats=await page.evaluate(async()=>{const m=await import('./content-en.js');return m.contentTranslationStats()});
  ck('content dictionary breadth',stats.uniqueEs>150,JSON.stringify(stats));

  const samples={
    e01:'El equipo del estudio registra la apertura de un archivo externo a las 22:52. El identificador coincide con la memoria USB que ya no está en su lugar habitual.',
    e05:'La copia de seguridad del mensaje recupera el destinatario: Inés. Además, la cámara interior no la registra entre 22:48 y 23:12, mientras Vera aparece en la cocina a las 23:02. El horario coincide con la figura que Mateo vio regresar.',
    e09:'Un inventario fotográfico antiguo muestra esa copia con la misma microetiqueta colocada en el llavero personal de Vera. La ventana sin imagen de Vera entre 22:45 y 23:09 coincide con ambas aperturas; Mateo, en cambio, registra actividad en el terminal técnico a las 22:58 y 23:04.',
    e12:'El celular de la víctima aparece bajo el banco del jardín, con tierra húmeda del mismo sector. La nota de voz se corta en el momento en que se oye un forcejeo y pasos que se alejan hacia la salida lateral.',
    role:'Protegé tu mentira central, sembrá dudas sin inventar evidencia oficial y evitá una acusación completa.',
    director:'No sumen sospechosos nuevos. Reconstruyan en orden: llegada, encuentro, hecho crítico, salida y encubrimiento.',
    solution:'Tomás y la víctima discutieron junto al banco del jardín por el uso no autorizado de su nombre. Cuando la víctima intentó volver a la casa con el celular en la mano, Tomás la sujetó y la empujó; la caída contra el borde de piedra terminó siendo fatal.'
  };
  await page.evaluate(samples=>{for(const [key,value] of Object.entries(samples)){const d=document.createElement('div');d.id='qa-'+key;d.textContent=value;document.body.append(d)}},samples);
  await page.waitForTimeout(250);
  ck('pack01 evidence EN',(await page.locator('#qa-e01').textContent()).startsWith('The study computer records'));
  ck('pack05 evidence EN',(await page.locator('#qa-e05').textContent()).startsWith('The message backup recovers'));
  ck('pack09 evidence EN',(await page.locator('#qa-e09').textContent()).startsWith('An old photographic inventory'));
  ck('pack12 evidence EN',(await page.locator('#qa-e12').textContent()).startsWith('The victim’s cell phone is found'));
  ck('private objective EN',(await page.locator('#qa-role').textContent()).startsWith('Protect your central lie'));
  ck('director content EN',(await page.locator('#qa-director').textContent()).startsWith('Do not add new suspects'));
  ck('solution content EN',(await page.locator('#qa-solution').textContent()).startsWith('Tomás and the victim argued'));

  const state='{"motive":"EN3-STATE-ISOLATED"}';
  await page.evaluate(v=>localStorage.setItem('pc_exp_rev01_theory_v1',v),state);
  await page.locator('.revTopActions [data-exp-lang="es"]').click();await page.waitForTimeout(300);
  ck('main title reverse ES',await page.locator('header h1').textContent()==='La Última Reunión');
  ck('evidence reverse ES',(await page.locator('#qa-e01').textContent()).startsWith('El equipo del estudio registra'));
  ck('profile reverse ES',(await page.locator('#characterDossierPreview').textContent()).includes('Socio del estudio'));
  ck('state isolation',(await page.evaluate(()=>localStorage.getItem('pc_exp_rev01_theory_v1')))===state);
  await page.locator('.revTopActions [data-exp-lang="en"]').click();await page.waitForTimeout(250);
  ck('second EN switch',await page.locator('header h1').textContent()==='The Last Meeting');
  await context.close();

  const introContext=await browser.newContext({viewport:{width:390,height:844}}),intro=await introContext.newPage();
  await intro.goto('http://127.0.0.1:4173/caso001/intro/?lang=en&access=QAACCESS&room=QAROOM',{waitUntil:'domcontentloaded'});await intro.waitForTimeout(800);
  ck('Cinema narrative EN',await intro.locator('#s1 .big').first().textContent()==='One meeting.');
  ck('Cinema title EN',await intro.locator('#s6 h2').textContent()==='The Last Meeting');
  ck('Cinema object EN',(await intro.locator('#s4').textContent()).includes('CELL PHONE'));
  ck('Cinema action words EN',(await intro.locator('#s4').textContent()).includes('Observe.'));
  await intro.locator('[data-exp-lang="es"]').click();await intro.waitForTimeout(250);
  ck('Cinema reverse ES',await intro.locator('#s1 .big').first().textContent()==='Una reunión.');
  const iu=new URL(intro.url());ck('Cinema params preserved',iu.searchParams.get('access')==='QAACCESS'&&iu.searchParams.get('room')==='QAROOM');
  await introContext.close();

  const adapter=fs.readFileSync('caso001/p2-multiplayer-adapter.js','utf8'),main=fs.readFileSync('caso001/index.html','utf8');
  ck('language absent multiplayer',!adapter.includes('expedientes_language')&&!/\blang\s*:|\blanguage\s*:/.test(adapter));
  ck('canonical room/mode keys preserved',adapter.includes("mode:mode==='imp'?'imp':'dig'")&&adapter.includes('pc_exp_p2_last_room'));
  ck('solution visuals canonical-index first',main.includes('data.killer_character_index')&&main.includes('data.location_index')&&main.includes('data.object_index')&&main.includes('canonicalIndex'));
  console.log(JSON.stringify({ok:true,result},null,2));
} finally {await browser.close()}
