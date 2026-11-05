# NORTEX-TAMBO · Web independiente

Esta carpeta contiene la web estática completa y una configuración lista para Render.
El contenido de `dist/` es una copia de la versión 11 publicada en Sites. No necesita Sites para funcionar.

## Publicar

1. Sube el **contenido de esta carpeta** a un repositorio de GitHub. `render.yaml`, `package.json` y `dist/` deben quedar en la raíz del repositorio.
2. Conecta ese repositorio a tu cuenta de Render.
3. En Render elige **New → Blueprint**, selecciona el repositorio y revisa el servicio estático `nortex-tambo`.
4. Confirma la creación. Render ejecutará las comprobaciones y publicará `dist/`.
5. Usa la dirección `onrender.com` que devuelva Render después de un despliegue correcto.

También puedes crear **New → Static Site** con:

| Campo | Valor |
| --- | --- |
| Root Directory | Vacío |
| Build Command | `npm test` |
| Publish Directory | `dist` |
| Auto-Deploy | On Commit |
| NODE_VERSION | `24` |
| SKIP_INSTALL_DEPS | `true` |

La configuración no crea servidores de pago ni bases de datos. Revisa los límites y condiciones que muestre tu cuenta de Render antes de confirmar.

## Editar desde otros dispositivos

- La fuente editable de esta versión está en `dist/` (HTML, CSS y JavaScript sin compilación).
- Abre el mismo repositorio desde GitHub, tu editor o una sesión de Codex con acceso a ese repositorio.
- Da permisos de colaboración en GitHub a quien vaya a modificar el código.
- Guarda y sube los cambios a la rama conectada a Render. Render publicará los cambios si pasan las comprobaciones.
- `npm test` ejecuta comprobaciones de referencias locales, sintaxis y las pruebas existentes.

## Datos y funcionalidades

El alojamiento y la colaboración sobre el código no sincronizan los datos de las fincas.
Las parcelas y análisis siguen guardándose en el navegador donde se registraron. Cambiar de dominio o dispositivo no transfiere esos datos. Exporta tu respaldo desde el sitio anterior antes de cambiar. Esta copia no añade un importador ni una base de datos.

La semilla sigue siendo una representación del escenario, no una credencial para recuperar el expediente desde otra cuenta. Las llamadas climáticas se realizan desde el navegador a NASA POWER. El mapa utiliza Leaflet y OpenStreetMap. Requieren conexión.

## Publicación anterior

- Sitio anterior: https://nortex-tambo-valle-lab.musicalgrouse.chatgpt.site/
- Versión de origen: 11.
- Commit de origen en Sites: `62a63b6ae645972c389a45d87ae93a29a943f426`.

Los cambios posteriores realizados en este repositorio se publicarán en Render. No se sincronizan automáticamente con Sites.

Documentación de Render: https://render.com/docs/static-sites
