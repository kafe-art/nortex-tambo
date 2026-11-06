# NORTEX-TAMBO: proceso de creación y estado

Actualizado: 6 de noviembre de 2026 (America/Lima).
Este registro reconstruye lo realizado a partir del historial de trabajo y los archivos. No certifica una validación agronómica ni una revisión visual de todas las versiones.

## Propósito y alcance
Apoyar decisiones agrícolas en la zona piloto provisional del Valle de San Lorenzo, asociada a Tambogrande. El límite no es un polígono oficial. Los seis cultivos definidos por el usuario son palta, arándanos, cacao, arroz, mango y limón. Su inclusión no demuestra aptitud ni presencia comprobada en cada sector.

## Recorrido construido
Inicio → buscar y dibujar finca → revisar y confirmar geometría → Qué cultivar.
La nueva entrada ofrece Qué cultivas y Rotaciones. Ambas pasan por una transición animada: consulta histórica NASA si hay finca confirmada, reconoce datos faltantes y deja continuar al resultado. Hay un botón para cancelar.
Qué cultivas muestra el cultivo del escenario, señales comprensibles y datos técnicos opcionales. Rotaciones muestra alternativas y un recorrido temporal conceptual del cultivo actual al propuesto y su continuidad. En perennes es manejo o reconversión, no rotación anual.

## Historia de cambios
1. MVP: mapa, polígono editable, revisión de zona, clima histórico 2025, simulaciones, módulos experimentales y semilla visual.
2. Simplificación de navegación: finca, agua/clima, decisiones y compartir. Inicio ilustrado y menú desplegable.
3. Migración de Sites a GitHub + Render conservando inicialmente la versión 11. La integración GitHub respondió 403 hasta que se concedió escritura. Se comprobó después que subir un commit no garantiza publicación: Render llegó a servir archivos anteriores.
4. Decisiones al centro: comparador visual y guía de navegación. Los primeros ejemplos generales (maíz, leguminosa, yuca) se retiraron por petición del usuario; también se retiró banano del catálogo.
5. Experiencia inmersiva: finca animada, selección de alternativas, pantalla completa y comparación. Posteriormente se incorporó mapa con paradas.
6. Evidencia: formularios de suelo, agua e historial, fuentes técnicas y expediente descargable. Sin datos de laboratorio inventados.
7. Catálogo exclusivo de seis cultivos y eliminación de puntajes/demandas/plazos ilustrativos no validados.
8. Consulta NASA por finca confirmada, años 2021–2025 y comprobaciones por cultivo. Se agregaron pruebas para faltantes, años bisiestos y separación de reglas.
9. Versión actual: entrada de dos opciones, transición animada, vistas diferenciadas y línea temporal de cultivos en lugar de paradas de tareas.

## Versiones trazables en GitHub
Repositorio: https://github.com/kafe-art/nortex-tambo
- 2db35c1: copia inicial y configuración Render.
- ec97186: comparación y flujo centrado en decisiones.
- e719aa1: recorrido animado de rotación.
- 9270a39: pantalla completa.
- aaafa73: selección de caminos y comparación inmersiva.
- 4702865: seis cultivos y evaluación de evidencias.
- 1c2a109: NASA real y comprobaciones preliminares.
- ce5543f: mapa interactivo.
- La versión que contiene este documento añade las dos entradas y la transición. Su SHA se consulta en el historial de GitHub.

## Datos: qué es real y qué no
NASA POWER: se solicita T2M_MAX y PRECTOTCORR para el punto interior de referencia del polígono. Son datos de rejilla; no un promedio del área ni mediciones individuales de árboles. El motor de consulta anual calcula totales solo con todos los días válidos. No rellena faltantes con demostraciones.
El paso de bienvenida consulta 2025; el panel detallado permite 2021–2025. No hay pronóstico operativo actual.
Cultivo, etapa y lecturas iniciales pueden ser valores de demostración. La humedad superficial no es humedad radicular; no hay sensor de raíces conectado.
El modelo Random Forest es un experimento histórico de temperatura, no un modelo de rendimiento o aptitud de rotaciones. No determina automáticamente qué sembrar.
La comparación real revisa lluvia para cacao, pH para arándanos/limón y drenaje para palta. Mango y arroz mantienen requisitos pendientes. Ningún resultado valida por sí solo una siembra, rentabilidad o secuencia de cultivos.
Fuentes: ICCO (cacao), SENASA (limón), extensión universitaria de Oregon (arándanos), Queensland (palta), INIA (mango) y FAO (arroz). Referencias internacionales no sustituyen calibración local. Enlaces exactos están en real-crop-data.js y field-assessment.js.

## Arquitectura y archivos
Web estática HTML/CSS/JavaScript, sin servidor ni base de datos de fincas.
- app.js: estado y navegación; onboarding.js: mapa y confirmación.
- decision.js: dos entradas, consulta durante transición y vista del cultivo actual.
- rotation-stage.js: experiencia de alternativas a pantalla completa.
- journey-map.js: recorrido temporal interactivo.
- crop-catalog.js: los seis cultivos; core.js: restricciones, no puntajes inventados.
- real-crop-data.js: consulta NASA, calidad y evaluación preliminar.
- field-assessment.js: datos declarados, fuentes y exportación del expediente.
- ai/: experimento y reglas existentes. seed-experience.js: semilla visual.
- decision.css: presentación de decisiones y animaciones con reducción de movimiento.
En el equipo de trabajo, render-site/dist es la fuente de publicación y web/dist conserva una copia. En GitHub la raíz publicable es dist. No editar ambas copias de forma divergente.

## Pruebas y publicación
npm test valida referencias, sintaxis y pruebas automatizadas. Actualmente 17 entradas de prueba pasan; no sustituyen una revisión de interfaz ni ensayos con agricultores.
Render ejecuta npm test y publica dist, con Node 24. La rama es main y autoDeployTrigger es commit. No afirmar que una versión está publicada hasta comprobar Live y/o comparar sus archivos públicos.
Web: https://nortex-tambo.onrender.com/
Sites anterior permanece independiente y no recibe estos commits.

## Limitaciones y trabajo pendiente
- Revisar visualmente la nueva transición y la navegación móvil/teclado.
- Validar cultivo/variedad, dotación y calidad de agua, suelo y fechas de campo.
- No existe un optimizador validado de secuencias entre los seis cultivos; el mapa muestra propuestas, no recomendaciones calculadas.
- Faltan modelos locales por variedad, balance hídrico de campaña, costos y mercado.
- Falta validación de utilidad y comprensión con productores y agrónomos de Tambogrande.
- Datos locales del navegador no sincronizan entre equipos. La semilla no es un token de acceso seguro de servidor.
- Formularios de evidencia requieren exportación; no se ha añadido almacenamiento persistente de todos los formularios.

## Cómo continuar documentando
Con cada cambio, actualizar este documento y CHANGELOG.md con problema, comportamiento final, archivos relevantes, pruebas, límites y estado de despliegue. No describir funciones planeadas como terminadas. Mantener fuentes, unidades, periodo y alcance de cada regla; nunca rellenar datos de la finca con números plausibles.
