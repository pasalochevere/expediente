(()=>{
'use strict';
// PSQ 2.9.6 hotfix loader.
// Conserva íntegramente el catálogo V2.7 aprobado desde el commit congelado y aplica sólo microajustes validados personaje por personaje.
const frozen='https://cdn.jsdelivr.net/gh/pasalochevere/expediente@e7f545d189846a48d14e1d3ce6e0c5c21b9b0e13/paper-squishy/psq-catalog-v27.js';
document.write('<script src="'+frozen+'"><\/script>');
document.write('<script src="./psq-donita-v291.js?v=2911"><\/script>');
document.write('<script src="./psq-cuppy-v292.js?v=2941"><\/script>');
document.write('<script src="./psq-editor-v295.js?v=2951"><\/script>');
document.write('<script src="./psq-heladin-v296.js?v=2961"><\/script>');
document.write('<script src="./psq-cp34b2.js?v=3423"><\/script>');
})();
