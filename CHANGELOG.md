# Historial de cambios

## 2026-11-06 · Entrada de dos caminos
- Qué cultivar abre Qué cultivas y Rotaciones.
- Transición animada con consulta histórica NASA para finca confirmada, cancelación y estado de datos faltantes.
- Vista del cultivo actual separada de alternativas; datos técnicos opcionales.
- Mapa temporal con cultivo actual, alternativa y continuidad; propuestas sin calendario validado.
- Documentación del proceso, arquitectura, límites y versiones en docs/PROCESO-Y-ESTADO.md.
- Verificación: 17 pruebas automatizadas aprobadas antes de esta publicación. Revisión visual pendiente.
- Despliegue: subir a GitHub no certifica estado Live en Render.

Los hitos anteriores y sus commits están documentados en docs/PROCESO-Y-ESTADO.md.

## 2026-11-06 · Regreso al inicio
- Salir de Rotaciones (incluido Escape), regresar desde Qué cultivas y cancelar la consulta llevan al inicio de la web.
- Se cancela la consulta pendiente, se limpia la vista y se restaura el desplazamiento. Anterior dentro del recorrido conserva su función.

## 2026-11-06 · Adaptación de interfaz aportada
- Referencia: HTML local aportado por el usuario. Se adoptan paleta bosque/crema/dorado, tarjetas seleccionables, camino con tractor animado, paradas y explicaciones.
- Se conservan seis cultivos y límites de evidencia; no se copian ganancias, ahorros, parcelas ficticias ni envío WhatsApp del ejemplo.
- Nueva hoja reference-theme.css y mapa SVG con avance del tractor y movimiento reducido.
- Pruebas de código y revisión visual se reportan por separado.
