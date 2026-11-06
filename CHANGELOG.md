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

## 2026-11-06 · Adaptación completa de la vista de Rotaciones con datos y catálogo NORTEX
- Interfaz completa de Rotaciones (`rotation-stage.js`, `decision.js`, `reference-theme.css`) siguiendo las 3 vistas de referencia (cabecera verde oscuro con selectores de parcela/suelo y 3 tarjetas blancas de indicadores reales; tarjetas `Opción A / B / C` y selector de los 6 cultivos del catálogo; mapa de carretera con colinas, canal de riego, tractor animado y 3 paradas numeradas; interruptor `Sin verificar / Con evidencia`; y sección inferior en 2 columnas con detalle de parada, botón `¿Por qué este cultivo aquí?` y 3 barras horizontales con marca oscura de referencia para `Qué cambia en tu parcela`).
- Todos los datos mostrados provienen exclusivamente del escenario activo (`evaluate(farm)`), el catálogo de 6 cultivos (`Mango`, `Limón`, `Palta`, `Cacao`, `Arándanos`, `Arroz`), el histórico NASA POWER 2025 y las fuentes técnicas (`INIA`, `SENASA`, `ICCO`, `OSU`, `Queensland`, `FAO`), sin ganancias ni ahorros inventados.
- Verificación: `npm test` en `render-site` aprueba 36 archivos, 53 referencias locales y las 17 pruebas automatizadas.
