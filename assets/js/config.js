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

export const media = {
  framePath: "assets/frames/f",
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
  preloadFraction: 0.5,// fracción de la animación a DESCARGAR antes de revelar (loader) — sube a 0.7/1 si la red es lenta
  preloadConcurrency: 6// descargas en paralelo durante la precarga del loader
};

// ----------------------------------------------------------------------------
// MÓVIL · mismo motor de canvas pero con secuencia de frames LIGERA (1280×720)
// y caché/precarga reducidas, para no reventar memoria ni gastar datos. Se
// fusiona sobre `media`/`tuning` cuando el viewport es pequeño (no reduce-motion).
// Los frames-m/ se extraen con la MISMA selección que los de escritorio, así las
// frames clave por sección coinciden.
// ----------------------------------------------------------------------------
export const mediaMobile = {
  framePath: "assets/frames-m/f",
  frameWidth: 1280,
  frameHeight: 720
};

export const tuningMobile = {
  cacheMax: 40,          // frames decodificados máx. (LRU) — a 1280×720 ≈ 150 MB
  cacheDecodeMax: 2,     // decodificaciones simultáneas (móvil = CPU limitada)
  prefetchBurst: 20,     // ventana de prefetch por delante
  maxDpr: 2,             // tope de DPR del canvas
  preloadFraction: 0.3   // móvil: precarga menos antes de revelar (datos)
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
