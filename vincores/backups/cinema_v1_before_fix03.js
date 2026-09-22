/* Backup VÍNCORES CINEMA ENGINE V1 before Intro Fix 01–03 */
/* Source commit state: P1.9.0 */
(()=>{
  const SEEN='vincores_cinema_seen_v1';
  const SCENES=[
    {ms:4100,html:()=>sceneText('INTRIGA','Hay vínculos que se ven.','Y otros que recién aparecen cuando les damos un lugar para ser observados.')},
    {ms:4300,html:()=>scenePhoto('https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/148155a3-5a0f-4e09-afa2-c2de5169109f.jpg','ORIGEN','Todo empezó con un campo, figuras y una pregunta.','Personas','Roles','Emociones','Distancias')},
    {ms:3900,html:()=>scenePhoto('https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/fe16c979-4a55-4395-af31-787cd0dfc077.jpg','EL MISMO LENGUAJE','Cada pieza representa algo que elegís mirar.','Figuras','Conceptos','Vínculos','Etapas')},
    {ms:5000,html:()=>sceneDigital()},
    {ms:4700,html:()=>sceneMovement()},
    {ms:4700,html:()=>sceneGuide()},
    {ms:4300,html:()=>sceneJournal()},
    {ms:999999,html:()=>sceneFinal()}
  ];
  /* Full backup kept intentionally minimal here; original remains recoverable from Git history. */
})();
