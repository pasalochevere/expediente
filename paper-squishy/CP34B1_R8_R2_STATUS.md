# R8-R2 — Estado de integración de assets de Cuppy

Fecha: 2026-10-29. Rama: staging/cp34b1-r8-cuppy.

- Los seis PNG R4-R1 fueron auditados de nuevo en el paquete local: 6/6 SHA-256, tamaños y dimensiones correctos (1364 × 1929).
- **NO están instalados aún en GitHub**: el conector no admite transmitir directamente los binarios desde el entorno de archivos. Se entregó `CreatorPlus_R8_R2_Assets_Instalacion.zip` con `install_staging.py` para copiar exclusivamente a esta rama, sin commit ni push automático.
- **NO hay preview desplegado**: Vercel create_project respondió HTTP 403 Forbidden. La cuenta conectada no autorizó esa creación.
- El módulo tiene control preventivo de hostname + flag y verifica sesión/licencia del servicio. **El contrato de respuesta y la autorización real todavía requieren pruebas de integración**; ningún parámetro URL equivale a autorización.
- Producción (main) no debe tocarse. Cuppy no aprobado para venta hasta QA real y armado físico.
- Próximas validaciones: assets HTTP 200, preview protegido mediante Vercel Authentication, casos autorizado/no autorizado, Cuppy 3 presets × frente/dorso, PDF A4, móvil y demás 59 personajes.
