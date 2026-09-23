(function(){'use strict';
  const A=window.C002_VISUAL_ASSETS=window.C002_VISUAL_ASSETS||{};
  const V='246';
  A.L03='assets/visual/bin/L03-v244.jpg?v='+V;
  A.room_317='assets/visual/bin/room-317-v244.jpg?v='+V;

  function dossier(name,role,mark){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <defs>
        <radialGradient id="g" cx="50%" cy="32%" r="75%"><stop offset="0" stop-color="#33241b"/><stop offset=".52" stop-color="#171311"/><stop offset="1" stop-color="#090909"/></radialGradient>
        <linearGradient id="a" x1="0" x2="1"><stop stop-color="#6d3a26"/><stop offset=".5" stop-color="#c59350"/><stop offset="1" stop-color="#6d3a26"/></linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#g)"/>
      <rect x="18" y="18" width="604" height="364" rx="16" fill="none" stroke="#7d5737" stroke-width="2"/>
      <circle cx="320" cy="150" r="62" fill="#16100d" stroke="#9b6d43" stroke-width="2"/>
      <path d="M260 260c12-58 108-58 120 0" fill="#16100d" stroke="#9b6d43" stroke-width="2"/>
      <text x="320" y="164" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#cfa866">${mark}</text>
      <rect x="90" y="294" width="460" height="1" fill="url(#a)"/>
      <text x="320" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="25" letter-spacing="3" fill="#f1e6d3">${name}</text>
      <text x="320" y="353" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" letter-spacing="4" fill="#ba9061">${role}</text>
      <text x="320" y="378" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="3" fill="#6f5d4a">HOTEL ORFEO · EXPEDIENTE 002</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  }

  if(!A.P05) A.P05=dossier('EVA MONTENEGRO','ESCRITORA / MÉDIUM','✦');
  if(!A.P06) A.P06=dossier('FRANCO VALDÉS','HEREDERO','317');

  // P2.1.2: load the final masters synchronously before visual-restoration.js.
  const masters=[
    'master-room317-v245.js',
    'master-P05-v245.js',
    'master-P06-v245.js',
    'master-O01-v246.js',
    'master-O02-v246.js',
    'master-O03-v246.js',
    'master-O04-v246.js',
    'master-O05-v246.js',
    'master-O06-v246.js'
  ];
  if(document.readyState==='loading'){
    document.write(masters.map(f=>'<script src="assets/visual/'+f+'?v='+V+'"></'+'script>').join(''));
  }else{
    masters.forEach(f=>{const s=document.createElement('script');s.src='assets/visual/'+f+'?v='+V;document.head.appendChild(s);});
  }
  window.C002_RECOVERY_ASSET_MAP='P2.1.2-v246';
})();