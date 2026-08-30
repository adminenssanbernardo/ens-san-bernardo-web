# Sitio web — Escuela Normal Superior de San Bernardo

Sitio institucional desplegado como **Cloudflare Worker con Static Assets**
(reemplazo actual de Cloudflare Pages). El contenido dinámico (noticias,
calendario, documentos, PQRSD) vive en Supabase.

## Estructura

```
public/            ← todo lo que se sirve al navegador
  index.html        ← página de inicio
  js/
    supabase-client.js  ← funciones para leer/escribir en Supabase (sin SDK)
wrangler.jsonc      ← configuración del Worker (nombre, dominio, variables)
package.json
```

## Supabase ya configurado

- Proyecto: `ens-san-bernardo-web` (región us-east-1)
- URL: `https://wvckbobdqnmeazupbnmy.supabase.co`
- Tablas: `noticias`, `calendario_escolar`, `documentos_institucionales`,
  `directorio`, `pqrsd_solicitudes` — todas con RLS activado.
- Bucket de Storage: `documentos-institucionales` (público para lectura).

La *anon key* que aparece en `wrangler.jsonc` y en `supabase-client.js`
**no es secreta** — está pensada para el navegador. La seguridad real la da
RLS: el público solo puede leer contenido marcado como publicado, y solo
puede *insertar* en PQRSD, nunca leer solicitudes ajenas.

## Cómo desplegar (sin usar la terminal)

Cloudflare permite conectar el repo de git directamente, sin instalar nada
localmente:

1. Suban esta carpeta como repositorio a la organización de GitHub del
   colegio (ver "Subir a GitHub" abajo).
2. En el dashboard de Cloudflare: **Workers & Pages → Create → Connect to Git**.
3. Elijan el repo. Cloudflare detecta `wrangler.jsonc` automáticamente.
4. Build command: (vacío, no hay build). Output/deploy: se despliega con
   `wrangler deploy` automáticamente en cada push a `main`.
5. En **Settings → Domains**, agreguen `enssanbernardo.edu.co` como dominio
   personalizado (el dominio ya debe estar en esta misma cuenta de Cloudflare
   como zona DNS).

## Subir a GitHub (primera vez)

```bash
git init
git add .
git commit -m "Sitio inicial ENS San Bernardo"
git branch -M main
git remote add origin https://github.com/<org-del-colegio>/ens-san-bernardo-web.git
git push -u origin main
```

## Próximos pasos sugeridos

- Reemplazar las noticias/calendario de ejemplo en `index.html` por datos
  reales, cargados con `obtenerNoticias()` / `obtenerCalendario()` desde
  `supabase-client.js`.
- Construir las páginas de "Nuestro Colegio", "Oferta Educativa", "Trámites
  y Servicios", etc. como archivos `.html` dentro de `public/`.
- Conectar el formulario de PQRSD real a `radicarPQRSD()`.
- Subir los PDFs (PEI, Manual de Convivencia, SIEE) al bucket
  `documentos-institucionales` y registrarlos en la tabla
  `documentos_institucionales`.
