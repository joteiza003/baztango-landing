# Baztango 20 — landing inmersiva

Landing cinematográfica (scroll-video por secuencia de frames sobre `<canvas>`) para
**Baztango 20**, en 5 idiomas (ES/EU/EN/FR/DE). Pensada para embeberse a pantalla
completa en `joseba-bakartxo.com/baztango`.

## Estructura
- `index.html` — página única.
- `assets/css/styles.css` — estilos.
- `assets/js/config.js` — frames clave por sección y tuning.
- `assets/js/cinematic.js` — motor (presentación por secciones + caché de frames).
- `assets/js/i18n.js` — traducciones (5 idiomas).
- `assets/frames/` — secuencia de imágenes (1920×1080) que reproduce el vídeo.
- `assets/poster.jpg`, `flyer.jpg`, `hotel.jpg`.

> El vídeo fuente `web.mp4` (y `djs.mp4`) NO se publican: la web usa solo `assets/frames/`.
> Para regenerar los frames desde el vídeo: `scripts/extract-frames.ps1` (o ffmpeg
> `select='not(mod(n,5))',scale=1920:-2`, 1 de cada 5 frames a 60 fps).

## Servir en local
Requiere servidor HTTP (los módulos JS no cargan por `file://`):

```
python -m http.server 8765
```

y abrir http://localhost:8765

## Publicar (estático)
Subir esta carpeta (sin los `.mp4`) a cualquier hosting estático (GitHub Pages,
Netlify, Cloudflare Pages) y embeber la URL resultante en la página `/baztango` de Wix.

## Estado
- Reservas: deshabilitado («Próximamente»), pendiente fecha de apertura.
- DJs: Carlos Cabral, Ignacio Cavalieri, Gustavo Dicri y Joseba Pagola.
- Clases: Bakartxo Arabaolaza — Clase A (viernes) técnica de giro · Clase B (sábado) sacadas, ambos roles.
- Equipo artístico visible como subtítulo en la portada (4 DJs + profesora).
