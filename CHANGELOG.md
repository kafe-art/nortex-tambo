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
