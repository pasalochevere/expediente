/* QA editorial Torre de América · revisión de 162 consignas.
 * SOLO PREVIEW. Se aplica después de cargar los datos V1.0; sin escrituras
 * a JSON de producción, sin modificar puntajes ni licencias. */
(function(){
  "use strict";
  const EDITS={
  "AMERICA_09_FACIL": {
    "question": "Duelo de países: cada jugador tiene 10 segundos para nombrar un club campeón de Uruguay, uno de Paraguay y uno de Colombia. Usen el cronómetro por separado.",
    "answer": "Gana quien diga los tres correctos en menos tiempo. Ejemplo: Peñarol, Olimpia y Atlético Nacional."
  },
  "AMERICA_15_FACIL": {
    "question": "Por turnos, nombrá un país sudamericano con al menos un club campeón de Libertadores hasta 2025. Cada persona tiene 10 segundos y no se puede repetir país.",
    "answer": "Válidos: Argentina, Brasil, Uruguay, Paraguay, Colombia, Chile y Ecuador. Pierde quien repite, se equivoca o tarda más de 10 segundos."
  },
  "AMERICA_17_FACIL": {
    "question": "Brasil vs. Uruguay: cada jugador tiene 30 segundos para nombrar cinco futbolistas históricos de su país. Inicien el cronómetro por separado.",
    "answer": "Gana quien diga cinco nombres reales en menos tiempo."
  },
  "AMERICA_23_FACIL": {
    "question": "Duelo: cada jugador dispone de 20 segundos para nombrar tantos clubes diferentes campeones de Libertadores como pueda. Usen el cronómetro por separado.",
    "answer": "Gana quien mencione más clubes campeones correctos sin repetir."
  },
  "AMERICA_25_FACIL": {
    "question": "Alternen clubes brasileños campeones de Libertadores. No pueden repetir y cada jugador tiene 15 segundos por turno.",
    "answer": "Pierde quien repite, dice un club que nunca fue campeón o supera los 15 segundos."
  },
  "AMERICA_36_FACIL": {
    "question": "Duelo de cronología. Jugador A: ordená LDU Quito, Boca y Peñarol según su primera Libertadores. Jugador B: ordená Once Caldas, Olimpia y Santos. Tenés 20 segundos por persona.",
    "answer": "A: Peñarol (1960), Boca (1977), LDU Quito (2008). B: Santos (1962), Olimpia (1979), Once Caldas (2004). Gana quien acierte en menos tiempo."
  },
  "AMERICA_37_FACIL": {
    "question": "Verdadero o falso, tres por persona. A: 1) Peñarol ganó en 1960; 2) Boca ganó en 2009; 3) LDU Quito ganó en 2008. B: 1) Colo-Colo ganó en 1991; 2) Flamengo ganó en 2019; 3) Olimpia ganó en 1998. Cada jugador dispone de 30 segundos.",
    "answer": "A: verdadero, falso, verdadero. B: verdadero, verdadero, falso. Gana quien tenga más aciertos; en empate, menor tiempo.",
    "timer": 30
  },
  "AMERICA_41_FACIL": {
    "question": "En 75 segundos, nombrá once futbolistas sudamericanos de cualquier época. Debés incluir un arquero y jugadores de por lo menos cuatro países diferentes.",
    "answer": "Superás el reto con 11 nombres reales, al menos un arquero y cuatro nacionalidades sudamericanas.",
    "timer": 75
  },
  "AMERICA_45_FACIL": {
    "question": "Inventá y cantá al menos dos líneas distintas de un canto de cancha para recibir a tu equipo en una final. Tenés 30 segundos.",
    "answer": "Superás el desafío si cantás dos líneas diferentes y relacionadas con una hinchada antes de que termine el tiempo."
  },
  "AMERICA_48_FACIL": {
    "question": "Duelo Ecuador vs. Colombia. Cada uno tiene 20 segundos para nombrar tres clubes de su país que hayan disputado la Libertadores. Cronometren a cada jugador por separado.",
    "answer": "Gana quien complete tres clubes válidos en menos tiempo. Ejemplos: LDU, Barcelona SC, Emelec / Atlético Nacional, América de Cali, Once Caldas."
  },
  "AMERICA_02_MEDIO": {
    "question": "En 25 segundos, nombrá un campeón de Libertadores de los años 70, otro de los 90 y otro de 2000–2009. Los tres clubes deben ser de países distintos.",
    "answer": "Ejemplo: Boca 1977 (Argentina), Olimpia 1990 (Paraguay) y LDU Quito 2008 (Ecuador). Deben coincidir década y país distinto.",
    "timer": 25
  },
  "AMERICA_03_MEDIO": {
    "question": "Argentina vs. Brasil: cada jugador tiene 20 segundos para nombrar tres clubes de su país que hayan ganado dos o más Libertadores. Usen el cronómetro por separado.",
    "answer": "Argentina: Boca, Independiente, River, Estudiantes. Brasil: Santos, São Paulo, Palmeiras, Flamengo, entre otros. Gana quien complete primero.",
    "timer": 20
  },
  "AMERICA_09_MEDIO": {
    "question": "Duelo: cada persona tiene 30 segundos para decir cuatro combinaciones país + club campeón de Libertadores. No se pueden repetir países ni clubes.",
    "answer": "Ejemplo: Argentina–Boca, Brasil–Flamengo, Uruguay–Peñarol, Paraguay–Olimpia. Gana quien complete cuatro antes.",
    "timer": 30
  },
  "AMERICA_15_MEDIO": {
    "question": "En 25 segundos decí cuatro pares distintos país + club campeón de Libertadores. No repitas país ni club.",
    "answer": "Superás el desafío si las cuatro parejas son correctas. Ejemplo: Uruguay–Nacional, Argentina–Boca, Brasil–Santos y Paraguay–Olimpia.",
    "timer": 25
  },
  "AMERICA_17_MEDIO": {
    "question": "Duelo Argentina vs. Brasil: cada persona tiene 30 segundos para nombrar cinco futbolistas y el club del país asignado con el que cada uno ganó la Libertadores.",
    "answer": "Gana quien diga cinco combinaciones reales de futbolista + club campeón en menos tiempo."
  },
  "AMERICA_23_MEDIO": {
    "question": "Duelo de tricampeones. Jugador A representa a Nacional de Montevideo; B, a Olimpia de Paraguay. Cada uno tiene 20 segundos para decir los tres años de títulos de su club.",
    "answer": "Nacional: 1971, 1980 y 1988. Olimpia: 1979, 1990 y 2002. Gana quien complete antes sus tres años."
  },
  "AMERICA_25_MEDIO": {
    "question": "Duelo: alternen club argentino campeón + año de una Libertadores ganada. No repitan club y respondan dentro de 15 segundos por turno.",
    "answer": "Pierde quien repite un club, dice un año incorrecto o no responde a tiempo. El rival puede salvarse dando una pareja válida."
  },
  "AMERICA_36_MEDIO": {
    "question": "Duelo de cronología. A: ordená LDU 2008, Vélez 1994 y Boca 1977 del más antiguo al más reciente. B: ordená Once Caldas 2004, Olimpia 1990 y Argentinos Juniors 1985. Tenés 20 segundos por persona.",
    "answer": "A: Boca 1977, Vélez 1994, LDU 2008. B: Argentinos Juniors 1985, Olimpia 1990, Once Caldas 2004. Gana quien complete primero."
  },
  "AMERICA_37_MEDIO": {
    "question": "Verdadero o falso, tres por persona. A: 1) Santos venció a Boca en 1963; 2) Vélez venció a Palmeiras en la final de 1994; 3) Nacional venció a Internacional en 1980. B: 1) River venció a Tigres en 2015; 2) Independiente venció a Santos en 1984; 3) Once Caldas venció a Boca en 2004. Tenés 30 segundos cada uno.",
    "answer": "A: verdadero, falso (Vélez venció a São Paulo), verdadero. B: verdadero, falso (Independiente venció a Grêmio), verdadero. Más aciertos gana; en empate, menor tiempo.",
    "timer": 30
  },
  "AMERICA_41_MEDIO": {
    "question": "En 90 segundos nombrá once futbolistas que hayan ganado personalmente la Libertadores. Tu equipo debe incluir un arquero, jugadores de al menos cuatro clubes y tres nacionalidades.",
    "answer": "Superás el desafío con 11 campeones reales, un arquero, cuatro clubes diferentes y tres países.",
    "timer": 90
  },
  "AMERICA_45_MEDIO": {
    "question": "Sos el DT. Tu equipo perdió 1–0 en la ida y ahora juega la revancha. Tenés 30 segundos para dar una charla motivadora usando EQUIPO, HISTORIA y COPA.",
    "answer": "Superás el reto si das una charla con sentido y mencionás las tres palabras antes de los 30 segundos."
  },
  "AMERICA_48_MEDIO": {
    "question": "Duelo Chile vs. Colombia: cada jugador tiene 20 segundos para nombrar tres clubes de su país que hayan disputado una FINAL de Libertadores. Cronometren por separado.",
    "answer": "Chile: Cobreloa, Colo-Colo, Universidad Católica. Colombia: América de Cali, Deportivo Cali, Atlético Nacional, Once Caldas. Gana quien complete antes."
  },
  "AMERICA_02_LEYENDA": {
    "question": "En 30 segundos nombrá cuatro clubes campeones de Libertadores: uno de los años 60, otro de los 70, otro de los 80 y otro de los 90. Incluí al menos tres países diferentes.",
    "answer": "Ejemplo: Santos 1962, Olimpia 1979, Grêmio 1983, Colo-Colo 1991. Gana la prueba quien cumpla cuatro décadas y tres países.",
    "timer": 30
  },
  "AMERICA_03_LEYENDA": {
    "question": "Duelo Argentina vs. Brasil: tenés 60 segundos para decir tres clubes multicampeones de tu país y dos años válidos de título para cada club.",
    "answer": "Ejemplo Argentina: Boca 2000/2001, River 1986/1996, Independiente 1972/1973. Brasil: Flamengo 1981/2019, Santos 1962/1963, Palmeiras 1999/2020. Gana quien complete antes.",
    "timer": 60
  },
  "AMERICA_09_LEYENDA": {
    "question": "Duelo: cada jugador tiene 35 segundos para nombrar tres combinaciones país + club + año de Libertadores. Ningún país ni club puede repetirse.",
    "answer": "Ejemplo: Uruguay–Peñarol–1960, Brasil–Santos–1962, Argentina–Estudiantes–1968. Gana quien complete correctamente antes.",
    "timer": 35
  },
  "AMERICA_11_LEYENDA": {
    "question": "En 45 segundos, nombrá cinco clubes brasileños distintos que hayan ganado la Libertadores y un año real de título por club.",
    "answer": "Cinco combinaciones correctas. Ejemplo: Santos 1962, Flamengo 1981, Grêmio 1983, São Paulo 1992 y Palmeiras 1999.",
    "timer": 45
  },
  "AMERICA_15_LEYENDA": {
    "question": "En 30 segundos, nombrá cuatro triples distintos: club, país y año en que ganó la Libertadores. No repitas club ni país.",
    "answer": "Ejemplo: Peñarol–Uruguay–1960; Santos–Brasil–1962; Boca–Argentina–1977; Olimpia–Paraguay–1979.",
    "timer": 30
  },
  "AMERICA_17_LEYENDA": {
    "question": "Duelo Argentina vs. Brasil: tenés 45 segundos para decir cinco futbolistas junto al club del país asignado con el que cada uno ganó una Libertadores.",
    "answer": "Gana quien nombre cinco combinaciones válidas de jugador + club campeón en menos tiempo.",
    "timer": 45
  },
  "AMERICA_23_LEYENDA": {
    "question": "Duelo: jugador A representa a Peñarol campeón 1987; B, a Olimpia campeón 1990. Cada uno tiene 20 segundos para decir el rival de la final y el técnico campeón.",
    "answer": "A: América de Cali y Óscar Tabárez. B: Barcelona SC y Luis Cubilla. Gana quien complete su combinación antes."
  },
  "AMERICA_25_LEYENDA": {
    "question": "Elegí uno de estos campeones y decí contra quién ganó aquella final: Cruzeiro 1976, Vasco da Gama 1998 o LDU Quito 2008. Tenés 15 segundos.",
    "answer": "Cruzeiro: River Plate. Vasco: Barcelona SC. LDU: Fluminense. Superás la prueba con una respuesta correcta."
  },
  "AMERICA_34_LEYENDA": {
    "question": "Perdés 1–0 una final y quedan 15 minutos. Podés incorporar un solo enganche: Zico, Bochini o Riquelme. Elegí uno y explicá qué jugada o cambio táctico intentarías.",
    "answer": "Se supera si elegís un enganche y explicás una decisión táctica relacionada con el empate. El grupo evalúa la propuesta."
  },
  "AMERICA_36_LEYENDA": {
    "question": "Duelo de cronología. A: ordená los títulos de Peñarol 1966, Olimpia 1990, Boca 2000 y LDU 2008, mostrados así: 2008, 1966, 2000, 1990. B: ordená Cruzeiro 1976, Peñarol 1987, Vélez 1994 y Boca 2007, mostrados así: 1994, 2007, 1976, 1987. Tenés 25 segundos por jugador.",
    "answer": "A: 1966, 1990, 2000, 2008. B: 1976, 1987, 1994, 2007. Gana quien ordene correctamente antes.",
    "timer": 25
  },
  "AMERICA_37_LEYENDA": {
    "question": "Verdadero o falso, tres por persona. A: 1) Peñarol venció a River en 1966; 2) Estudiantes venció a Nacional en 1968; 3) Flamengo venció a Cobreloa en 1981. B: 1) Olimpia venció a Barcelona SC en 1990; 2) Nacional venció a River en 1988; 3) Cruzeiro venció a River en 1976. Tenés 30 segundos cada uno.",
    "answer": "A: verdadero, falso (Estudiantes venció a Palmeiras), verdadero. B: verdadero, falso (Nacional venció a Newell's), verdadero. Más aciertos gana; en empate, menor tiempo.",
    "timer": 30
  },
  "AMERICA_41_LEYENDA": {
    "question": "Tenés 120 segundos para armar un once titular de jugadores que hayan ganado personalmente la Libertadores. Requisitos: al menos seis clubes diferentes, cinco nacionalidades, un arquero y no más de dos jugadores por club.",
    "answer": "Superás la prueba con 11 campeones reales y cumpliendo los cuatro requisitos.",
    "timer": 120
  },
  "AMERICA_45_LEYENDA": {
    "question": "Sos capitán antes de una definición por penales. Tenés 30 segundos para dar una charla al equipo usando ARQUERO, PRESIÓN e HISTORIA, sin pronunciar «tranquilos».",
    "answer": "Superás la prueba si hablás sobre la definición, usás las tres palabras y evitás la palabra prohibida dentro del tiempo."
  },
  "AMERICA_46_LEYENDA": {
    "question": "Respondé tres hitos en 20 segundos: 1) ¿Qué club boliviano fue semifinalista en 1986 y 2014? 2) Nombrá un finalista peruano y su año. 3) ¿Qué equipo venezolano llegó a cuartos en 2004 tras eliminar a Nacional?",
    "answer": "1) Bolívar. 2) Universitario (1972) o Sporting Cristal (1997). 3) Deportivo Táchira."
  },
  "AMERICA_48_LEYENDA": {
    "question": "Duelo Ecuador vs. Chile. A: decí si LDU Quito 2008 y Barcelona SC 1998 fueron campeones o finalistas. B: hacé lo mismo con Colo-Colo 1991 y Universidad Católica 1993. Tenés 20 segundos por jugador.",
    "answer": "Ecuador: LDU campeón 2008, Barcelona finalista 1998. Chile: Colo-Colo campeón 1991, Universidad Católica finalista 1993. Gana quien acierte antes."
  }
};
  const REVISION="TA-RETO-QA-20261108-R2";
  const finish=(ready)=>{
    if(!ready||typeof DB==="undefined"||!DB||!Array.isArray(DB.content))return;
    let targeted=0, creative=0, misses=[];
    for(const [id,edit] of Object.entries(EDITS)){
      const item=DB.content.find(x=>x.id===id);
      if(!item){misses.push(id);continue}
      Object.assign(item,edit);targeted++;
    }
    for(const item of DB.content){
      if(item.resolution!=="GV")continue;
      if(!EDITS[item.id]){
        const hasReason=/por qué|justificá|defendé|explicá|razón|argument/i.test(item.question);
        item.question+=" "+(hasReason?"El grupo decide si cumpliste.":"Justificá tu elección; el grupo decide si cumpliste.");
        item.answer="No hay una única respuesta correcta. Completás la prueba si respondés a la situación, justificás tu decisión y el grupo acepta tu propuesta.";
        creative++;
      }
    }
    window.TA_EDITORIAL_QA={revision:REVISION,reviewed:DB.content.length,curated:targeted,creative,missing:misses};
    /* Si la partida se reanudó con el texto anterior, actualizar únicamente
     * la consigna visible, conservando todas las demás propiedades y el estado. */
    if(typeof S!=="undefined"&&S.currentContent?.id){
      const current=DB.content.find(x=>x.id===S.currentContent.id);
      if(current){
        S.currentContent.question=current.question;
        S.currentContent.answer=current.answer;
        S.currentContent.timer=current.timer;
      }
    }
  };
  const p=window.torreAmericaDataReady;
  if(p&&typeof p.then==="function")p.then(finish);
})();
