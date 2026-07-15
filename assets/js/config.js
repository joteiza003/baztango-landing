// ============================================================================
// BAZTANGO 20 · configuración del motor cinemático (presentación por secciones)
// ----------------------------------------------------------------------------
// El vídeo se sirve como SECUENCIA DE IMÁGENES (assets/frames/fNNNN.jpg) y se
// dibuja en <canvas>. Navegación por SECCIONES (snapping): cada gesto de scroll
// avanza una sección; la transición es una animación TEMPORIZADA cuya duración
// depende de la distancia de frames entre las frames clave.
//
//   web.mp4: 3840×2160 · 60 fps · 4512 frames · 75,2 s
//   frames extraídos: 1 de cada 5 (frameStep) → 903 imágenes a 1920×1080
//
//   frameStep            = nº de frames de vídeo por imagen extraída (source = idx*step).
//   frameWidth/Height    = resolución nativa de los frames (para no sobre-escalar el canvas).
//   key                  = frame CLAVE de origen (60 fps) en el que descansa cada sección.
//   align                = posición editorial del texto.
//
// Velocidad del efecto (unificada): transRate = frames de vídeo / s de transición.
//   Duración = distanciaDeFrames / transRate (acotada a min/max).
// ============================================================================

// CDN INMUTABLE para los fotogramas (jsDelivr sobre el tag fijo `frames-v1`).
// Motivo: GitHub Pages regenera el ETag de TODOS los ficheros en cada deploy,
// invalidando ~146 MB de caché de los visitantes con cada push. jsDelivr sirve
// desde el tag de git (caché 7 días + revalidación 304 estable), de modo que
// los deploys de la landing YA NO tocan los frames. Si algún día se regeneran
// los fotogramas: crear tag nuevo (frames-v2) y actualizar esta constante.
const FRAMES_CDN = "https://cdn.jsdelivr.net/gh/joteiza003/baztango-landing@frames-v1/";

export const media = {
  framePath: FRAMES_CDN + "assets/frames/f",
  framePad: 4,
  frameExt: ".jpg",
  frameCount: 903,
  frameStep: 5,
  sourceFrames: 4512,
  frameWidth: 1920,
  frameHeight: 1080
};

export const tuning = {
  transRate: 280,      // velocidad unificada del efecto (frames de vídeo / s) — menor = más lento
  transMin: 0.9,       // duración mínima de transición (s)
  transMax: 5.0,       // duración máxima de transición (s)
  wheelCooldown: 200,  // ms de calma de rueda tras una transición (anti-inercia)
  maxDpr: 2,           // tope de devicePixelRatio para el canvas
  cacheMax: 120,       // frames decodificados máx. en memoria (LRU) — a 1920×1080 ≈ 1 GB
  cacheDecodeMax: 4,   // decodificaciones simultáneas
  prefetchBurst: 40,   // frames a precargar por delante durante la transición
  preloadFraction: 0.25,// fracción a DESCARGAR antes de revelar (loader) — con el CDN inmutable basta 1/4
  preloadConcurrency: 6,// descargas en paralelo durante la precarga del loader
  warmMaxFraction: 0.7 // tope del calentamiento en 2º plano (el resto lo trae prefetchBurst bajo demanda)
};

// ----------------------------------------------------------------------------
// MÓVIL · mismo motor de canvas pero con secuencia de frames LIGERA (1280×720)
// y caché/precarga reducidas, para no reventar memoria ni gastar datos. Se
// fusiona sobre `media`/`tuning` cuando el viewport es pequeño (no reduce-motion).
// Los frames-m/ se extraen con la MISMA selección que los de escritorio, así las
// frames clave por sección coinciden.
// ----------------------------------------------------------------------------
export const mediaMobile = {
  framePath: FRAMES_CDN + "assets/frames-m/f",
  frameWidth: 1280,
  frameHeight: 720
};

export const tuningMobile = {
  cacheMax: 40,          // frames decodificados máx. (LRU) — a 1280×720 ≈ 150 MB
  cacheDecodeMax: 2,     // decodificaciones simultáneas (móvil = CPU limitada)
  prefetchBurst: 20,     // ventana de prefetch por delante
  maxDpr: 2,             // tope de DPR del canvas
  preloadFraction: 0.2,  // móvil: precarga menos antes de revelar (datos)
  warmMaxFraction: 0.5   // móvil: el calentamiento de fondo para en la mitad (datos)
};

export const sections = [
  { id: "intro",       key: 74,   align: "left"   },
  { id: "concepto",    key: 1068, align: "left"   },
  { id: "alojamiento", key: 2261, align: "right"  },
  { id: "programa",    key: 2491, align: "left"   },
  { id: "djs",         key: 2820, align: "right"  },
  { id: "clases",      key: 3125, align: "left"   },
  { id: "packs",       key: 3473, align: "center" },
  { id: "extras",      key: 3818, align: "left"   },
  { id: "reservas",    key: 4351, align: "center" }
];
