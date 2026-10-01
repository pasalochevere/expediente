# EXP01-EN5 · Bilingual Printables · ES / EN

Estado: **PASS sujeto al gate automatizado de publicación de este build**.

## Alcance real auditado

El kit activo de Caso 001 contiene **8 páginas A4 base** y **18 imágenes embebidas**:

1. Expediente del caso / apertura;
2. Personas · 6 sospechosos;
3. Escenas de investigación;
4. Objetos clave;
5. Hoja de investigación / tablero de teoría;
6. Línea de tiempo;
7. Mapa de relaciones;
8. Acusación final.

La capa EN5 no altera el contenido canónico ni el motor. Traduce únicamente la presentación del kit imprimible.

## Selector bilingüe

Se incorpora un control visible en la parte superior:

- **ESPAÑOL**;
- **ENGLISH**.

Resolución:

1. `?lang=es` / `?lang=en`;
2. preferencia local del dispositivo;
3. español por defecto.

El cambio es en vivo y reversible, conserva los demás parámetros de URL y el botón **Imprimir / Guardar PDF** imprime el idioma que está visible.

## Cobertura EN

Se traducen las 8 páginas completas, incluyendo:

- instrucciones de apertura y reglas Normal / Impostor;
- perfiles públicos y roles visibles;
- escenas, descripciones y preguntas de investigación;
- objetos y descripciones;
- ejes Persona / Escena / Objeto / Motivo;
- hechos, contradicciones, coartadas, testimonios e hipótesis;
- cronología;
- relaciones;
- bloqueo y acusación final.

La capa también reutiliza el diccionario completo de **EXP01-EN3** para cualquier texto canónico/evidencia que pueda incorporarse dinámicamente al DOM del imprimible.

## Imágenes

En español se conservan las **18 imágenes originales embebidas**.

En inglés:

- 6 retratos usan las variantes EN validadas en EXP01-EN4;
- el cuaderno usa su variante EN;
- las 6 escenas y los otros 5 objetos son neutros y se reutilizan sin modificación.

Resultado: **7 swaps EN + 11 assets neutros compartidos**.

## Seguridad

EN5 no modifica:

- Crime Packs;
- índices canónicos;
- P2 labels internos;
- room state;
- licencias;
- timers;
- roles;
- Edge Functions;
- payloads multiplayer.

## Gate de QA

El gate automatizado valida:

- 8/8 páginas en ES;
- 8/8 páginas en EN;
- títulos y textos críticos de las 8 páginas;
- ausencia de marcadores españoles objetivo al estar en EN;
- ida y vuelta ES → EN → ES → EN;
- 18/18 imágenes cargadas;
- 7 variantes visuales EN y 11 imágenes neutras compartidas;
- toolbar e idioma de documento;
- impresión A4 y generación PDF de 8 páginas por idioma;
- cero errores JavaScript de página.
