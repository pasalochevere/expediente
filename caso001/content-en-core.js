// EXP01-EN3 · Core narrative/content translations for Caso 001.
// Presentation-only: canonical game data remains Spanish/server-side.
export const CORE_CONTENT_PAIRS=Object.freeze([
  ['La Última Reunión','The Last Meeting'],
  ['Seis personas. Una reunión que terminó mal. Versiones cruzadas, rastros incompletos y una verdad que solo aparece cuando las evidencias se conectan.','Six people. A meeting that ended badly. Conflicting accounts, incomplete traces, and a truth that only appears when the evidence connects.'],

  // Legacy prologue
  ['La reunión','The meeting'],
  ['Seis personas fueron convocadas. Todas llegaron con una historia propia. Ninguna imaginaba que, al terminar la noche, cada palabra iba a ser revisada.','Six people were summoned. Each arrived with a story of their own. None imagined that, by the end of the night, every word would be examined.'],
  ['Algo estaba por salir a la luz','Something was about to come to light'],
  ['La reunión no era rutinaria. Había información, decisiones y asuntos pendientes capaces de cambiar el equilibrio entre quienes estaban presentes.','This was no routine meeting. There was information, decisions, and unfinished business capable of changing the balance among everyone present.'],
  ['Versiones cruzadas','Conflicting accounts'],
  ['Después, los recuerdos dejaron de coincidir. Horarios, movimientos y conversaciones comenzaron a formar relatos distintos sobre una misma noche.','Afterward, the memories stopped matching. Times, movements, and conversations began to form different accounts of the same night.'],
  ['Algo falta','Something is missing'],
  ['Entre lo que se dijo, lo que quedó registrado y lo que apareció después, hay una ausencia. Algo importante no está donde debería estar.','Between what was said, what was recorded, and what appeared afterward, something is missing. Something important is not where it should be.'],
  ['La investigación','The investigation'],
  ['No confíen en una sola pista. Crucen testimonios, tiempos, accesos, objetos y contradicciones. La verdad aparece cuando varias piezas encajan a la vez.','Do not trust a single clue. Cross-check statements, times, access records, objects, and contradictions. The truth appears when several pieces fit together at once.'],
  ['El expediente se abre','The case file opens'],
  ['Para cerrar el caso deberán sostener una reconstrucción completa: persona, escena, objeto y motivo. Una acusación sin conexión no alcanza.','To close the case, you must support a complete reconstruction: person, scene, object, and motive. An accusation without a coherent connection is not enough.'],
  ['“Yo estaba en otro lugar.”','“I was somewhere else.”'],
  ['“Eso no fue así.”','“That is not what happened.”'],
  ['“Falta una parte.”','“Something is missing.”'],

  // Cinema Intro V10.7
  ['Expediente 001','Case File 001'],
  ['Una reunión.','One meeting.'],
  ['Una caída.','One fall.'],
  ['Todo empezó esa noche.','It all began that night.'],
  ['Seis identidades.','Six identities.'],
  ['Los mismos personajes del expediente. Cada uno guarda una parte de la historia.','The same people from the case file. Each of them holds part of the story.'],
  ['Observá.','Observe.'],
  ['Compará.','Compare.'],
  ['Dudá.','Question.'],
  ['Entrá.','Enter.'],
  ['Conectá.','Connect.'],
  ['Acusá.','Accuse.'],
  ['Investigá · Acusá · Resolvé','Investigate · Accuse · Solve'],
  ['Fondo personajes','Character background'],
  ['Fondo evidencias','Evidence background'],
  ['Fondo juego','Game background'],
  ['Cierre','Closing'],

  // Public character profiles
  ['Socio del estudio','Partner at the firm'],
  ['Consultora externa','External consultant'],
  ['Administración y accesos','Administration and access control'],
  ['Colaborador técnico','Technical collaborator'],
  ['Asistente del encuentro','Meeting assistant'],
  ['Invitado vinculado al caso','Guest connected to the case'],
  ['Persona vinculada al caso','Person connected to the case'],

  // Canonical visible location labels (internal IDs/Spanish labels remain unchanged)
  ['Sala de estar','Living room'],
  ['Cocina','Kitchen'],
  ['Estudio','Study'],
  ['Dormitorio','Bedroom'],
  ['Jardín','Garden'],
  ['Pasillo','Hallway'],
  ['Jardín / exterior','Garden / exterior'],
  ['Pasillo / acceso','Hallway / access'],

  // Canonical visible object labels
  ['Arma','Weapon'],
  ['Cuaderno','Notebook'],
  ['Celular','Cell phone'],
  ['Llave','Key'],
  ['Memoria USB','USB drive'],
  ['Pañuelo','Handkerchief'],
  ['CELULAR','CELL PHONE'],
  ['LLAVE','KEY'],
  ['CUADERNO','NOTEBOOK'],
  ['MEMORIA USB','USB DRIVE'],
  ['ARMA','WEAPON'],
  ['PAÑUELO','HANDKERCHIEF'],

  // Private role content returned by P2 server
  ['SOS EL IMPOSTOR','YOU ARE THE IMPOSTOR'],
  ['SOS INVESTIGADOR','YOU ARE AN INVESTIGATOR'],
  ['Protegé tu mentira central, sembrá dudas sin inventar evidencia oficial y evitá una acusación completa.','Protect your central lie, sow doubt without inventing official evidence, and prevent the team from completing a sound accusation.'],
  ['Reconstruí el hecho cruzando evidencias. Tus datos privados solo se habilitan cuando llega su etapa.','Reconstruct what happened by cross-checking evidence. Your private information is only revealed when its stage is reached.'],
  ['Analizá las evidencias, cruzá contradicciones y ayudá al equipo a reconstruir el caso.','Analyze the evidence, cross-check contradictions, and help the team reconstruct the case.'],

  // Director · automatic timeline guidance
  ['No busquen todavía un nombre. Separen qué prueba escena, qué prueba objeto y qué solo abre un motivo.','Do not look for a name yet. Separate what proves the scene, what proves the object, and what only points toward a motive.'],
  ['Comparen las dos hipótesis que mejor sobrevivieron. Una contradicción temporal o de acceso debería empezar a importar más que el motivo.','Compare the two hypotheses that have held up best. A timeline or access contradiction should now matter more than motive alone.'],
  ['La etapa final ya permite reconstruir. Busquen qué evidencia cambia de significado al cruzarla con otra, no una pista que responda todo sola.','The final stage now allows reconstruction. Look for evidence whose meaning changes when crossed with another clue, not for a single clue that answers everything.'],
  ['Cierren Persona + Escena + Objeto + motivo causal. Si están listos, bloqueen la acusación antes de revelar.','Close Person + Scene + Object + causal motive. If you are ready, lock the accusation before revealing the reconstruction.'],

  // Director · requested guidance
  ['Revisen qué evidencia ubica el hecho y cuál solo presenta un conflicto. No confundan motivo con presencia.','Review which evidence places the event and which evidence only establishes a conflict. Do not confuse motive with presence.'],
  ['Todavía deberían existir varias lecturas. Si un nombre parece obvio, intenten demostrar qué dato falta para ubicarlo en la escena.','Several interpretations should still be possible. If one name seems obvious, identify what evidence is still missing to place that person at the scene.'],
  ['Obliguen a sus dos hipótesis fuertes a explicar la misma línea de tiempo. La que necesite ignorar una prueba está perdiendo fuerza.','Force your two strongest hypotheses to explain the same timeline. The one that has to ignore evidence is losing strength.'],
  ['Busquen una mentira verificable: una coartada, un acceso o un objeto que cambie de significado al cruzarse con otra pista.','Look for a verifiable lie: an alibi, an access record, or an object whose meaning changes when crossed with another clue.'],
  ['No sumen sospechosos nuevos. Reconstruyan en orden: llegada, encuentro, hecho crítico, salida y encubrimiento.','Do not add new suspects. Reconstruct the sequence in order: arrival, encounter, critical event, departure, and cover-up.'],
  ['La acusación justa debería poder explicar Persona + Escena + Objeto y también por qué el señuelo parecía posible.','A sound accusation should explain Person + Scene + Object and also why the red herring seemed plausible.']
]);

export const CORE_DYNAMIC_TRANSLATORS=Object.freeze({
  toEnglish(value){
    const s=String(value||'');
    let m;
    if((m=s.match(/^DIRECTOR · ETAPA (\d+)$/))) return `DIRECTOR · STAGE ${m[1]}`;
    return s;
  },
  toSpanish(value){
    const s=String(value||'');
    let m;
    if((m=s.match(/^DIRECTOR · STAGE (\d+)$/))) return `DIRECTOR · ETAPA ${m[1]}`;
    return s;
  }
});
