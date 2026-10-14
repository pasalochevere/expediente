(()=>{
'use strict';
// PSQ 2.9.1 hotfix loader.
// Conserva íntegramente el catálogo V2.7 aprobado desde el commit congelado y aplica sólo el microajuste de Donita.
const frozen='https://cdn.jsdelivr.net/gh/pasalochevere/expediente@e7f545d189846a48d14e1d3ce6e0c5c21b9b0e13/paper-squishy/psq-catalog-v27.js';
document.write('<script src="'+frozen+'"><\/script>');
document.write('<script src="./psq-donita-v291.js?v=2911"><\/script>');
})();
