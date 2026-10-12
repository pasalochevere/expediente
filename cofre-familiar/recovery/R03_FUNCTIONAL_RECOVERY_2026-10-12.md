# COFRE-R03 — Functional Recovery

Fecha: 2026-10-12

## Resultado

**PASS — recuperación funcional del RC1 cerrada en la rama `release/cofre-familiar-rc1`.**

Deployment Railway final:
- Service: `cofre-web-rc1`
- Deployment: `626e63fd-d9a0-4927-9245-e0a60095e1ac`
- Source commit desplegado: `11b8a7e3078ff5077dbc910cd999e111c252d0b4`
- Estado: `SUCCESS`
- Runtime: Next.js 16.4.0 / Node >=22
- Healthcheck `/health`: **1/1 PASS**

Gates del build:
- Recovery preflight: **75 PASS / 0 FAIL**
- R03 functional gate: **33 PASS / 0 FAIL**
- TypeScript: **PASS**
- Next production build: **PASS**
- Container start: **PASS**
- Railway healthcheck: **PASS**

## R03.1 — Miembros e invitaciones

Recuperado:
- Listado de miembros y roles.
- Crear invitación segura.
- Invitación opcionalmente ligada a email.
- Roles member/admin según permisos.
- Vencimiento configurable.
- Token crudo mostrado una sola vez.
- Copiar link sin persistirlo en localStorage.
- Listado de invitaciones recientes.
- Revocación.
- Aceptación mediante ruta `/invite/[token]`.

QA real:
- Owner crea/lista/revoca: PASS.
- Usuario autenticado no administrador ve 0 invitaciones: PASS.
- Datos QA eliminados: PASS.

## R03.2 — Cartas y cápsulas

Cartas:
- Destinatario por persona o miembro.
- Apertura inmediata, por fecha o manual.
- Cuerpo de carta.
- Adjuntos desde Media.
- Borrador → sellada.
- Nueva RPC segura `cofre.release_letter(uuid)` para apertura manual.
- Botón “Habilitar para destinatario”.
- Apertura final y estado abierto.

QA real:
- Crear → contenido → sellar → abrir: PASS.
- Manual: crear → sellar → habilitar → abrir: PASS.

Cápsulas:
- Título, descripción, fecha de apertura y visibilidad.
- Destinatarios.
- Contenido de texto.
- Media.
- Cartas incluidas.
- Agregar/quitar elementos.
- Agregar/quitar destinatarios.
- Sellado.
- Apertura al llegar la fecha.

QA real:
- Fecha pasada al sellar rechazada correctamente: PASS.
- Fecha futura + contenido + sellado: PASS.
- Apertura una vez llegada la fecha: PASS.
- Datos QA eliminados: PASS.

## R03.3 — Proyectos completos

Tipos recuperados:
- Regalo.
- Experiencia.
- Creación.
- Colaboración.

Gestión común:
- Pantalla de detalle por proyecto.
- Participantes.
- Roles de proyecto.
- Proyectos sorpresa.
- Reveal seguro.
- Links externos de acceso.
- Vencimiento y límite de usos.
- Revocación.
- Token crudo mostrado una sola vez.

Regalo:
- Ideas.
- Costo, dificultad y días estimados.

Experiencia:
- Opciones.
- Costo, duración y tipo de lugar.
- Selección de opción.

Creación:
- Revisiones.
- Notas/configuración.
- Aprobación de revisión.

Colaboración:
- Consignas.
- Tipos de aporte.
- Fecha límite y cantidad máxima.
- Link público `/contribute/[token]`.
- Contexto anónimo seguro.
- Envío real de aporte sin cuenta.
- Visualización de aportes para organizadores.

QA real:
- 4 proyectos QA creados, uno por tipo: PASS.
- Idea de regalo: PASS.
- Opción de experiencia + selección: PASS.
- Revisión de creación + aprobación: PASS.
- Participante externo: PASS.
- Consigna colaborativa: PASS.
- Link con límite de usos: PASS.
- Contexto anónimo: PASS.
- Aporte externo anónimo: PASS.
- Visibilidad para organizador: PASS.
- Todos los proyectos/datos QA eliminados: PASS.

## R03.4 — Papelera y exportación

Papelera:
- Recuerdos.
- Personas.
- Fechas.
- Sueños.
- Proyectos.
- Confirmación antes de enviar a papelera.
- Pantalla de Papelera.
- Restauración segura.

QA real:
- Recuerdo temporal → papelera → listado → restauración: PASS.
- Limpieza QA: PASS.

Exportación:
- Ruta autenticada `/c/[cofreId]/export`.
- Descarga JSON del contenido y metadatos del Cofre.
- Incluye recuerdos, personas, fechas, sueños, cartas, cápsulas, proyectos y metadata de Media.
- Incluye tablas detalle de proyectos.
- Registra manifest export con backend original.
- No exporta raw tokens ni tablas de links privados.
- No incluye binarios de fotos/videos.

QA:
- RPC de manifest export: PASS.
- Build de la ruta de exportación: PASS.

## R03.5 — Home y recordatorios

Home dinámico:
- Contadores.
- Últimos recuerdos.
- Próximas fechas.
- Repetición anual.
- Cartas/cápsulas próximas a abrirse.
- “Hoy hace…” para recuerdos con aniversario.
- Accesos rápidos.

Recordatorios:
- Días configurables por fecha: 30, 14, 7, 3, 1 y 0 días antes.
- Actualización de avisos en fechas existentes.
- Preferencias globales de notificación.
- Frecuencia emocional.
- Fechas/eventos.
- Actividad de miembros.
- Email.
- Push.

QA real mediante transacción + rollback:
- Preferencias: PASS.
- Array de reminder_days: PASS.
- Sin cambios residuales de QA: PASS.

## Seguridad

- `cofre-media` permanece privado.
- No hay service role en frontend.
- Tokens crudos no se guardan en navegador ni DB.
- RLS mantenido.
- RPCs sensibles siguen usando auth/RLS o security definer con validaciones.
- Personal Cofre `primavera-dai/cofre.html` no fue modificado.
- Migraciones `cofre_shared_*` del Cofre personal no fueron mezcladas.

Supabase Security Advisor revisado después de la nueva RPC de cartas: no se identificó una regresión nueva en el esquema `cofre`. Las advertencias existentes en tablas `public` ajenas a este recovery quedan fuera del alcance de R03.

## Pendiente técnico antes del merge/release

- Agregar y versionar `package-lock.json`. Las versiones directas están fijadas, pero Railway todavía instala con `npm install` sin lockfile; debe resolverse antes del freeze/merge final.
- No mergear a `main` todavía.
- No crear launcher de GitHub Pages todavía.

## Pasa a COFRE-R04 — Visual + Media Polish

Feedback confirmado en Browser Acceptance real:
- El preview de fotos recorta la imagen (`object-fit: cover` actual).
- Mejorar estética general de Media.
- Permitir renombrar foto/archivo.
- Permitir crear/nombre de carpeta o álbum.
- Agrupar contenido por fecha/salida y/o carpeta personalizada.
- Mejorar cards y área de subida.
- Revisar nombres técnicos de archivos visibles.
- Aumentar ligeramente la presencia/tamaño de “SUBIR”.
- Continuar polish visual general desktop/mobile.

R03 se cierra funcionalmente. R04 será el bloque de diseño, organización de Media y refinamiento de experiencia.
