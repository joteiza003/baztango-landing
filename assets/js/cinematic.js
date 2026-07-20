// ============================================================================
// BAZTANGO 20 · motor cinemático · PRESENTACIÓN POR SECCIONES (snapping)
//  - Cada gesto de scroll/tecla/swipe avanza UNA sección (nunca te quedas
//    entre medias).
//  - La transición entre secciones es una animación TEMPORIZADA: la duración
//    depende de la distancia de frames entre frames clave, con una velocidad
//    de efecto UNIFICADA (tuning.transRate).
//  - Frames servidos como secuencia de imágenes en <canvas>, con caché LRU y
//    prefetch anticipado de los tramos vecinos (arranque sin stutter).
//  - Fallback apilado (scroll normal) en móvil / prefers-reduced-motion.
// ============================================================================
import { media, tuning, sections, mediaMobile, tuningMobile, reservas } from "./config.js?v=11";
import { LANGS, LANG_LABEL, T, getPackDetails, getProgram, getExtras } from "./i18n.js?v=4";

/* ---------- utilidades ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const easeInOutSine = (t) => -(Math.cos(Math.PI * clamp(t)) - 1) / 2;
const clampIdx = (i) => Math.max(0, Math.min(media.frameCount - 1, i));

function framePath(index) {
  return media.framePath + String(clampIdx(index)).padStart(media.framePad, "0") + media.frameExt;
}
const keyToIndex = (sourceFrame) => clampIdx(Math.round(sourceFrame / media.frameStep));

/* ---------- estado de idioma (el detalle de packs se genera por idioma) ---------- */
let currentLang = "es";
let currentPackDetails = getPackDetails("es");

/* ---------- referencias DOM ---------- */
const body = document.body;
const loaderEl = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
const progressEl = document.getElementById("progress");
const headerEl = document.getElementById("siteHeader");
const cinematicEl = document.getElementById("cinematic");
const canvas = document.getElementById("frame");
const scrollCue = document.querySelector(".scroll-cue");
const dotsWrap = document.getElementById("dots");
const langPortada = document.getElementById("langPortada");
const headerLang = document.getElementById("headerLang");
const capEls = sections.map((s) => document.querySelector(`[data-cap="${s.id}"]`));
const navLinks = [...document.querySelectorAll("[data-nav]")];

/* ---------- modo ---------- */
const mqSmall = window.matchMedia("(max-width: 860px)");
const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
// Apilado (scroll normal) SOLO para reduce-motion. El móvil ahora también usa el
// motor de canvas, con el set de frames ligero (mediaMobile/tuningMobile).
const stacked = mqReduce.matches;
const mobileCanvas = mqSmall.matches && !stacked;

/* ---------- chrome común ---------- */
function setActiveNav(id) {
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("data-nav") === id));
}
function bindMenu() {
  const menu = document.getElementById("mobileMenu");
  const burger = document.getElementById("burger");
  const closeMenu = document.getElementById("closeMenu");
  if (burger) burger.addEventListener("click", () => menu.classList.add("open"));
  if (closeMenu) closeMenu.addEventListener("click", () => menu.classList.remove("open"));
  if (menu) menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));
}
function bindAnchors(go) {
  document.querySelectorAll('a[href^="#"], a[data-nav]').forEach((a) => {
    if (a.target === "_blank") return;
    a.addEventListener("click", (e) => {
      const raw = a.getAttribute("data-nav") || (a.getAttribute("href") || "").replace("#", "");
      e.preventDefault();
      go(raw === "" || raw === "top" ? "intro" : raw);
      const menu = document.getElementById("mobileMenu");
      if (menu) menu.classList.remove("open");
    });
  });
}
function reveal() {
  body.classList.remove("loading");
  body.classList.add("ready");
  if (loaderEl) { loaderEl.classList.add("done"); setTimeout(() => loaderEl.remove(), 700); }
}

/* ============================================================================
   CACHÉ LRU DE FRAMES (compartida)
   ========================================================================== */
function createFrameCache(max = 200, decodeMax = 4) {
  const cache = new Map();
  const order = [];
  const pending = new Map();
  let onArrive = null;
  let keepIdx = 0;
  let decodeSlots = 0;
  const decodeQueue = [];

  function touch(i) { const k = order.indexOf(i); if (k >= 0) { order.splice(k, 1); order.push(i); } }
  function evict() {
    while (order.length > max) {
      const o = order.shift();
      if (o === keepIdx) { order.push(o); break; }
      const im = cache.get(o);
      if (im) { im.onload = null; im.src = ""; }
      cache.delete(o);
    }
  }
  function runDecodeQueue() {
    while (decodeSlots < decodeMax && decodeQueue.length) {
      const job = decodeQueue.shift();
      decodeSlots += 1;
      job().finally(() => {
        decodeSlots -= 1;
        runDecodeQueue();
      });
    }
  }
  function queueDecode(job) {
    return new Promise((resolve, reject) => {
      decodeQueue.push(() => job().then(resolve, reject));
      runDecodeQueue();
    });
  }
  function load(i) {
    i = clampIdx(i);
    if (cache.has(i)) { touch(i); return Promise.resolve(cache.get(i)); }
    if (pending.has(i)) return pending.get(i);
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous"; // frames desde el CDN (jsDelivr envía CORS *)
    // Pre-DECODIFICA el frame (no solo lo descarga): así dibujarlo durante la
    // reproducción no provoca el "decode-on-draw" que causa tirones.
    const p = queueDecode(async () => {
      try {
        img.src = framePath(i);
        // La descarga (onload) es la señal fiable de que el frame es dibujable.
        await new Promise((r, j) => { img.onload = r; img.onerror = j; });
        // Pre-decodificado best-effort con tope: evita el "decode-on-draw" en
        // navegadores normales, pero NUNCA bloquea si decode() no resuelve
        // (algunos entornos headless cuelgan decode() con imágenes grandes).
        if (img.decode) { try { await Promise.race([img.decode(), new Promise((r) => setTimeout(r, 500))]); } catch (_e) { /* dibujable igualmente */ } }
        cache.set(i, img); order.push(i); evict(); pending.delete(i);
        if (onArrive) onArrive(i);
        return img;
      } catch (e) { pending.delete(i); return null; }
    });
    pending.set(i, p);
    return p;
  }
  function nearest(i) {
    if (cache.has(i)) return i;
    for (let d = 1; d < media.frameCount; d += 1) {
      if (cache.has(i - d)) return i - d;
      if (cache.has(i + d)) return i + d;
    }
    return -1;
  }
  return {
    get: (i) => cache.get(i),
    has: (i) => cache.has(i),
    load, nearest,
    setKeep: (i) => { keepIdx = i; },
    setOnArrive: (fn) => { onArrive = fn; }
  };
}

/* Descarga (CALIENTA la caché HTTP del navegador) un rango de frames SIN
   mantenerlos decodificados en memoria: las imágenes se sueltan tras cargar, así
   no inflan la RAM, pero los bytes quedan en disco. El prefetch posterior los lee
   en local (rápido) y la reproducción deja de atascarse por la red. */
function warmFrames(from, to, concurrency = 6, onProgress = null, pauseWhenHidden = false) {
  from = clampIdx(from); to = clampIdx(to);
  const total = Math.max(0, to - from + 1);
  return new Promise((resolve) => {
    if (total === 0) { resolve(); return; }
    let next = from, done = 0, active = 0;
    const onVisible = () => { if (!document.hidden) pump(); };
    const finish = () => {
      if (pauseWhenHidden) document.removeEventListener("visibilitychange", onVisible);
      resolve();
    };
    const pump = () => {
      // Solo el calentamiento POST-revelado se pausa con la pestaña oculta (el
      // visitante puede estar ya en otra página, p.ej. el wizard); la precarga
      // inicial del loader NUNCA se pausa o el reveal no llegaría en pestañas
      // abiertas en segundo plano.
      while ((!pauseWhenHidden || !document.hidden) && active < concurrency && next <= to) {
        const im = new Image();
        im.decoding = "async";
        im.crossOrigin = "anonymous";
        im.onload = im.onerror = () => {
          active -= 1; done += 1;
          if (onProgress) onProgress(done, total);
          if (done >= total) finish(); else pump();
        };
        im.src = framePath(next);
        next += 1; active += 1;
      }
    };
    if (pauseWhenHidden) document.addEventListener("visibilitychange", onVisible);
    pump();
  });
}

/* ============================================================================
   MODO APILADO (móvil / reduced-motion) · scroll normal
   ========================================================================== */
function initStacked() {
  body.classList.add("mode-stacked");
  capEls.forEach((el, i) => {
    if (!el) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { el.style.setProperty("--cap-bg", `url("${img.src}")`); el.classList.add("has-bg"); };
    img.src = framePath(keyToIndex(sections[i].key));
  });

  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        const id = en.target.getAttribute("data-cap");
        if (id) setActiveNav(id);
      }
    }),
    { threshold: 0.25, rootMargin: "-30% 0px -30% 0px" }
  );
  capEls.forEach((el) => el && io.observe(el));

  const onScroll = () => {
    const st = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progressEl) progressEl.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    if (headerEl) headerEl.classList.toggle("scrolled", st > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  bindMenu();
  bindAnchors((id) => {
    const el = document.querySelector(`[data-cap="${id}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
  reveal();
}

/* ============================================================================
   MODO PRESENTACIÓN (desktop) · snapping + transición temporizada
   ========================================================================== */
function initPresentation() {
  body.classList.add("mode-presentation");
  if (headerEl) headerEl.classList.add("scrolled");
  const ctx = canvas.getContext("2d", { alpha: false });
  const idx = sections.map((s) => keyToIndex(s.key));   // índice de imagen por sección
  const cache = createFrameCache(tuning.cacheMax, tuning.cacheDecodeMax);

  let current = 0;
  let animating = false;
  let lastDrawn = -1;
  let curRound = idx[0];
  cache.setKeep(curRound);

  /* --- canvas --- */
  function canvasDpr() {
    const sys = Math.min(tuning.maxDpr, window.devicePixelRatio || 1);
    const cw = canvas.clientWidth || window.innerWidth;
    const ch = canvas.clientHeight || window.innerHeight;
    const fw = media.frameWidth || 1920;
    const fh = media.frameHeight || 1080;
    // No escalar el canvas por encima de la resolución nativa del frame (evita blur extra).
    const cover = Math.max(fw / cw, fh / ch);
    return Math.min(sys, Math.max(1, cover));
  }
  function resize() {
    const dpr = canvasDpr();
    // el canvas ocupa todo el viewport; respaldo a innerWidth/Height por si el
    // CSS aún no ha dado tamaño al elemento al cargar (carrera CSS vs JS).
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    lastDrawn = -1;
    drawIndex(curRound, true);
    fitCaptions();
  }
  function drawIndex(index, force = false) {
    const i = cache.has(index) ? index : cache.nearest(index);
    if (i < 0) return;
    if (!force && i === lastDrawn) return;
    const img = cache.get(i);
    if (!img) return;
    lastDrawn = i;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(canvas.width / iw, canvas.height / ih);
    const dw = iw * scale, dh = ih * scale;
    const upscaling = scale > 1.02;
    ctx.imageSmoothingEnabled = upscaling;
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = upscaling ? "high" : "medium";
    ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  }
  cache.setOnArrive((i) => { if (i === curRound) drawIndex(curRound, true); });

  /* --- captions / indicadores --- */
  function showCaption(i, op) {
    const el = capEls[i]; if (!el) return;
    el.style.opacity = op.toFixed(3);
    el.style.transform = `translateY(${((1 - op) * 22).toFixed(1)}px)`;
    el.style.pointerEvents = op > 0.6 ? "auto" : "none";
    el.setAttribute("aria-hidden", op > 0.5 ? "false" : "true");
  }
  const dotEls = sections.map((s, i) => {
    const b = document.createElement("button");
    b.className = "dot";
    b.type = "button";
    b.setAttribute("aria-label", s.id);
    b.addEventListener("click", () => goTo(i));
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });
  function setIndicators(i) {
    setActiveNav(sections[i].id);
    dotEls.forEach((d, k) => d.classList.toggle("active", k === i));
    if (progressEl) progressEl.style.width = (sections.length > 1 ? (i / (sections.length - 1)) * 100 : 0) + "%";
    if (scrollCue) scrollCue.style.opacity = i === 0 ? "1" : "0";
    // Idiomas en la portada: visibles en la intro; el selector del header (escritorio)
    // se oculta en la intro para no duplicar y reaparece en el resto de secciones.
    const onIntro = i === 0;
    if (langPortada) { langPortada.style.opacity = onIntro ? "1" : "0"; langPortada.style.pointerEvents = onIntro ? "auto" : "none"; }
    if (headerLang) { headerLang.style.opacity = onIntro ? "0" : "1"; headerLang.style.pointerEvents = onIntro ? "none" : "auto"; }
  }
  function setIdle(i) {
    capEls.forEach((el, k) => showCaption(k, k === i ? 1 : 0));
    setIndicators(i);
  }

  // Encaja el texto de cada sección en el viewport (sin recortes en pantallas
  // bajas). En monitores normales no aplica escala.
  function fitCaptions() {
    capEls.forEach((el) => {
      if (!el) return;
      const inner = el.querySelector(".cap-inner");
      if (!inner) return;
      inner.style.transform = "";
      const cs = getComputedStyle(el);
      const avail = window.innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const h = inner.scrollHeight;
      const scale = h > avail ? Math.max(0.6, avail / h) : 1;
      const align = el.getAttribute("data-align");
      inner.style.transformOrigin = align === "right" ? "right center" : align === "center" ? "center center" : "left center";
      inner.style.transform = scale < 1 ? `scale(${scale.toFixed(3)})` : "";
    });
  }

  /* --- prefetch --- */
  function prefetchToward(from, to, count) {
    const dir = to >= from ? 1 : -1;
    for (let k = 0; k <= count; k += 1) cache.load(from + dir * k);
  }
  function idlePrefetch() {
    // Decodifica por adelantado una VENTANA hacia delante del tramo siguiente
    // (limitada para no exceder la caché a 1920×1080) y algo del previo.
    if (current < sections.length - 1) prefetchToward(idx[current], idx[current + 1], Math.min(90, Math.abs(idx[current + 1] - idx[current])));
    if (current > 0) prefetchToward(idx[current], idx[current - 1], 20);
  }

  /* --- transición temporizada --- */
  let animRafId = 0;
  let animWatchdog = 0;
  let captionFrom = 0;

  function sectionFromFrame(frameIdx) {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < idx.length; i += 1) {
      const dist = Math.abs(idx[i] - frameIdx);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }

  function durationMs(from, to) {
    const distSrc = Math.abs(sections[to].key - sections[from].key);
    return clamp(distSrc / tuning.transRate, tuning.transMin, tuning.transMax) * 1000;
  }

  function durationMsFromFrames(fromFrameIdx, toSection) {
    const fromKey = fromFrameIdx * media.frameStep;
    const toKey = sections[toSection].key;
    const distSrc = Math.abs(toKey - fromKey);
    return clamp(distSrc / tuning.transRate, tuning.transMin, tuning.transMax) * 1000;
  }

  function releaseNavLocks() {
    animating = false;
    wheelLock = false;
    if (animRafId) {
      cancelAnimationFrame(animRafId);
      animRafId = 0;
    }
    if (animWatchdog) {
      clearTimeout(animWatchdog);
      animWatchdog = 0;
    }
  }

  function finishTransition(target, fromSection) {
    current = target;
    curRound = idx[target];
    captionFrom = target;
    cache.setKeep(curRound);
    releaseNavLocks();
    drawIndex(curRound, true);
    setIdle(target);
    idlePrefetch();
  }

  function goTo(target) {
    target = Math.max(0, Math.min(sections.length - 1, target));
    if (!animating && target === current) return;

    const wasAnimating = animating;
    if (wasAnimating) {
      if (animRafId) cancelAnimationFrame(animRafId);
      animRafId = 0;
      if (animWatchdog) {
        clearTimeout(animWatchdog);
        animWatchdog = 0;
      }
    }

    const fromSection = wasAnimating ? sectionFromFrame(curRound) : current;
    const a = wasAnimating ? curRound : idx[fromSection];
    const b = idx[target];
    const dir = b >= a ? 1 : -1;
    const D = wasAnimating ? durationMsFromFrames(a, target) : durationMs(fromSection, target);
    const t0 = performance.now();

    animating = true;
    captionFrom = fromSection;
    prefetchToward(a, b, Math.min(Math.abs(b - a), 70));
    setIndicators(target);

    animWatchdog = setTimeout(() => {
      if (animating) finishTransition(target, fromSection);
    }, D + 900);

    function step(now) {
      if (!animating) return;
      const t = clamp((now - t0) / D);
      const e = easeInOutSine(t);
      curRound = clampIdx(Math.round(lerp(a, b, e)));
      cache.setKeep(curRound);
      cache.load(curRound);
      for (let k = 1; k <= tuning.prefetchBurst; k += 1) cache.load(curRound + dir * k);
      drawIndex(curRound, true);

      // crossfade de texto: sale en la 1ª mitad, entra en la 2ª (el vídeo respira)
      showCaption(captionFrom, 1 - smoothstep(t / 0.42));
      showCaption(target, smoothstep((t - 0.5) / 0.5));
      if (progressEl) progressEl.style.width = ((fromSection + (target - fromSection) * e) / (sections.length - 1) * 100) + "%";

      if (t < 1) {
        animRafId = requestAnimationFrame(step);
      } else {
        finishTransition(target, fromSection);
      }
    }
    animRafId = requestAnimationFrame(step);
  }

  function recoverPresentationState() {
    resize();
    if (!animating) {
      wheelLock = false;
      drawIndex(curRound, true);
      setIdle(current);
      return;
    }
    drawIndex(curRound, true);
  }
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  /* --- entrada: rueda (con anti-inercia) --- */
  let wheelLock = false;
  let lastWheel = 0;
  window.addEventListener("wheel", (e) => {
    if (document.body.classList.contains("pack-modal-open")) return; // deja desplazar el modal
    e.preventDefault();
    lastWheel = performance.now();
    if (animating || wheelLock) return;
    wheelLock = true;
    if (e.deltaY > 0) next(); else if (e.deltaY < 0) prev();
  }, { passive: false });
  setInterval(() => {
    if (wheelLock && !animating && performance.now() - lastWheel > tuning.wheelCooldown) wheelLock = false;
  }, 60);

  /* --- entrada: teclado --- */
  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("pack-modal-open")) return;
    if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) { e.preventDefault(); next(); }
    else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(sections.length - 1); }
  });

  /* --- entrada: táctil --- */
  let touchY = null;
  window.addEventListener("touchstart", (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchend", (e) => {
    if (touchY == null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 42) { if (dy > 0) next(); else prev(); }
    touchY = null;
  }, { passive: true });

  /* --- navegación por nombre --- */
  function goToId(id) { const i = sections.findIndex((s) => s.id === id); if (i >= 0) goTo(i); }

  /* --- arranque --- */
  async function start() {
    // 1) Frames CLAVE primero: dibujamos la primera sección cuanto antes.
    const list = [...new Set(idx)];
    await Promise.all(list.map((i) => cache.load(i)));
    resize();
    drawIndex(idx[0], true);
    setIdle(0);
    fitCaptions();

    // 2) PRECARGA antes de revelar: descargamos una buena parte de la animación
    //    (por defecto la mitad) para que en producción la red no atasque las
    //    transiciones. La barra del loader refleja esta descarga.
    const frac = clamp(tuning.preloadFraction != null ? tuning.preloadFraction : 0.5, 0, 1);
    const conc = tuning.preloadConcurrency || 6;
    const preloadTo = Math.round((media.frameCount - 1) * frac);
    await warmFrames(0, preloadTo, conc, (d, t) => {
      if (loaderBar) loaderBar.style.width = Math.round((d / t) * 100) + "%";
    });

    // 3) Revelamos y seguimos calentando el RESTO de frames en segundo plano,
    //    de modo que cuando el visitante llegue allí ya estén en local.
    resize();
    drawIndex(idx[0], true);
    setIdle(0);
    fitCaptions();
    reveal();
    prefetchToward(idx[0], idx[1], 70);  // primer tramo decodificado, ya visible
    idlePrefetch();
    // Calentamiento de fondo con TOPE (warmMaxFraction): no monopoliza el ancho
    // de banda del visitante durante minutos; el tramo final lo trae
    // prefetchBurst bajo demanda según se navega.
    const warmFrac = clamp(tuning.warmMaxFraction != null ? tuning.warmMaxFraction : 1, frac, 1);
    const warmTo = Math.round((media.frameCount - 1) * warmFrac);
    if (preloadTo < warmTo) warmFrames(preloadTo + 1, warmTo, conc, null, true);
  }

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") recoverPresentationState();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      releaseNavLocks();
      recoverPresentationState();
    }
  });
  window.addEventListener("focus", recoverPresentationState);
  bindMenu();
  bindAnchors(goToId);
  start();

  // si se cruza el breakpoint hacia móvil, recargar para el layout apilado.
  // EXCEPCIÓN: nunca recargar con el vídeo abierto (girar el móvil al ver el
  // vídeo cruza el breakpoint y mataba la reproducción); se recarga al cerrarlo.
  const wasSmall = mqSmall.matches;
  window.addEventListener("resize", () => {
    if (mqSmall.matches === wasSmall) return;
    const videoAbierto =
      document.body.classList.contains("video-lightbox-open") ||
      document.querySelector(".hero-video.is-playing");
    if (videoAbierto) {
      window.__jbPendingBreakpointReload = true;
      return;
    }
    location.reload();
  }, { passive: true });
}

/* ============================================================================
   MODAL DE DETALLE DE PACK (común a ambos modos)
   ========================================================================== */
function initPackModal() {
  const modal = document.getElementById("packModal");
  if (!modal) return;
  const content = modal.querySelector(".pack-modal-content");
  const closeBtn = modal.querySelector(".pack-modal-close");
  const backdrop = modal.querySelector(".pack-modal-backdrop");
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  function open(slug) {
    const p = currentPackDetails[slug];
    if (!p) return;
    content.innerHTML =
      `<h4>${esc(p.name)}</h4>` +
      `<p class="pack-detail-price">${esc(p.price)}</p>` +
      (p.meta ? `<div class="pack-meta">${p.meta.map((m) => `<p>${esc(m)}</p>`).join("")}</div>` : "") +
      `<p class="pack-incl">${esc((T[currentLang] || T.es).pack_incl)}</p>` +
      `<div class="pack-agenda">${p.days.map((d) => `<div class="pack-day"><h5>${esc(d.d)}</h5><ul>${d.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></div>`).join("")}</div>`;
    modal.hidden = false;
    document.body.classList.add("pack-modal-open");
    if (modal.querySelector(".pack-modal-panel")) modal.querySelector(".pack-modal-panel").scrollTop = 0;
    closeBtn.focus();
  }
  function close() { modal.hidden = true; document.body.classList.remove("pack-modal-open"); }

  document.querySelectorAll(".pack[data-pack]").forEach((card) => {
    const slug = card.getAttribute("data-pack");
    card.addEventListener("click", () => open(slug));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(slug); } });
  });
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
}

/* ============================================================================
   VÍDEO YouTube · PC: reproductor en línea en el hero · Móvil: lightbox
   (click-to-play: el iframe se inyecta solo al pulsar, no en la carga)
   ========================================================================== */
function initVideo() {
  const FALLBACK_ID = "Ye7BTm0GPLE";
  // autoplay SOLO si el entorno lo permite. Embebida en Wix, la cadena de
  // iframes solo delega "fullscreen" (sin autoplay): con autoplay=1 el player
  // móvil se queda en un spinner infinito al tocar play (el play() programático
  // queda vetado). Sin el parámetro, el toque en el play de YouTube reproduce
  // por gesto directo, que no necesita permiso de autoplay.
  const autoplayAllowed = (() => {
    const framed = (() => { try { return window.top !== window.self; } catch (_e) { return true; } })();
    if (!framed) return true; // visita directa a la landing
    try {
      const fp = document.featurePolicy || document.permissionsPolicy;
      if (fp && typeof fp.allowsFeature === "function") return fp.allowsFeature("autoplay");
    } catch (_e) { /* sin API: asumir denegado dentro de iframe */ }
    return false;
  })();
  const embedSrc = (id) =>
    `https://www.youtube-nocookie.com/embed/${id}?${autoplayAllowed ? "autoplay=1&" : ""}rel=0&modestbranding=1&playsinline=1`;
  const facade = document.querySelector(".hero-video");
  const mobileBtn = document.querySelector(".hero-video-btn");
  const lightbox = document.getElementById("videoLightbox");
  const embedBox = document.getElementById("videoEmbed");

  function makeIframe(id) {
    const f = document.createElement("iframe");
    f.src = embedSrc(id);
    f.title = "Vídeo de Baztango 20";
    f.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
    f.setAttribute("allowfullscreen", "");
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    return f;
  }

  // PC: sustituye la miniatura por el iframe (reproducción en línea)
  if (facade) {
    const playInline = () => {
      if (facade.classList.contains("is-playing")) return;
      const f = makeIframe(facade.getAttribute("data-video") || FALLBACK_ID);
      f.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0";
      facade.innerHTML = "";
      facade.appendChild(f);
      facade.classList.add("is-playing");
    };
    facade.addEventListener("click", playInline);
    facade.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playInline(); } });
  }

  // Móvil (y fallback): lightbox a pantalla completa
  function openLightbox(id) {
    if (!lightbox || !embedBox) return;
    embedBox.innerHTML = "";
    embedBox.appendChild(makeIframe(id));
    lightbox.hidden = false;
    document.body.classList.add("video-lightbox-open");
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (embedBox) embedBox.innerHTML = "";   // detiene la reproducción
    document.body.classList.remove("video-lightbox-open");
    // Si durante el vídeo se cruzó el breakpoint (p.ej. giro del móvil), la
    // recarga pendiente se ejecuta ahora que ya no interrumpe nada.
    if (window.__jbPendingBreakpointReload) {
      window.__jbPendingBreakpointReload = false;
      location.reload();
    }
  }
  if (mobileBtn) mobileBtn.addEventListener("click", () => openLightbox(mobileBtn.getAttribute("data-video") || FALLBACK_ID));
  if (lightbox) {
    lightbox.querySelectorAll("[data-vl-close]").forEach((el) => el.addEventListener("click", closeLightbox));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });
  }
}

/* ============================================================================
   I18N · aplica el idioma por selectores (reconstruye programa/extras/modal)
   ========================================================================== */
function applyLang(lang) {
  if (!LANGS.includes(lang)) lang = "es";
  const t = T[lang];
  currentLang = lang;
  currentPackDetails = getPackDetails(lang);
  document.documentElement.setAttribute("lang", t.htmlLang || lang);

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const setText = (sel, v) => { const el = document.querySelector(sel); if (el && v != null) el.textContent = v; };
  const setHtml = (sel, v) => { const el = document.querySelector(sel); if (el && v != null) el.innerHTML = v; };
  const cap = (id) => `[data-cap="${id}"]`;

  // cabecera + menú móvil
  document.querySelectorAll(".home-btn").forEach((el) => (el.textContent = t.home_btn));
  document.querySelectorAll(".mm-home").forEach((el) => (el.textContent = t.mm_home));
  document.querySelectorAll("[data-reserva-cta]").forEach((el) => (el.textContent = reservasOpen() ? t.reservas_cta : t.reservas_soon));
  const navKey = { concepto: "nav_concepto", alojamiento: "nav_hotel", programa: "nav_programa", djs: "nav_djs", clases: "nav_clases", packs: "nav_packs", extras: "nav_extras", reservas: "nav_reservas" };
  document.querySelectorAll("[data-nav]").forEach((a) => { const k = navKey[a.getAttribute("data-nav")]; if (k) a.textContent = t[k]; });
  setText(".scroll-cue span", t.scroll_cue);

  // hero
  setText(`${cap("intro")} .eyebrow`, t.hero_eyebrow);
  setHtml(`${cap("intro")} h1`, t.hero_h1);
  setText(`${cap("intro")} .lead`, t.hero_lead);
  setText(`${cap("intro")} .btn-ghost`, t.hero_prog);
  const metas = document.querySelectorAll(`${cap("intro")} .hero-meta > div`);
  [[t.meta1v, t.meta1l], [t.meta2v, t.meta2l], [t.meta3v, t.meta3l]].forEach((m, i) => {
    if (metas[i]) { const b = metas[i].querySelector("b"), s = metas[i].querySelector("span"); if (b) b.textContent = m[0]; if (s) s.textContent = m[1]; }
  });
  setText(`${cap("intro")} .hero-team .ht-label`, t.eb_djs);
  setText(`${cap("intro")} .hero-team .ht-list li:last-child span`, t.role_teacher);

  // concepto / alojamiento
  setText(`${cap("concepto")} .eyebrow`, t.eb_concepto);
  setHtml(`${cap("concepto")} h2`, t.concepto_h2);
  const cp = document.querySelectorAll(`${cap("concepto")} .lead`);
  [t.concepto_p1, t.concepto_p2, t.concepto_p3].forEach((v, i) => { if (cp[i]) cp[i].textContent = v; });
  setText(`${cap("alojamiento")} .eyebrow`, t.eb_aloj);
  setHtml(`${cap("alojamiento")} h2`, t.aloj_h2);
  const ap = document.querySelectorAll(`${cap("alojamiento")} .lead`);
  [t.aloj_p1, t.aloj_p2].forEach((v, i) => { if (ap[i]) ap[i].textContent = v; });
  const af = document.querySelectorAll(`${cap("alojamiento")} .fact span`);
  [t.fact1, t.fact2, t.fact3].forEach((v, i) => { if (af[i]) af[i].textContent = v; });

  // djs / clases
  setText(`${cap("djs")} .eyebrow`, t.eb_djs);
  setHtml(`${cap("djs")} h2`, t.djs_h2);
  setText(`${cap("djs")} .lead`, t.djs_lead);
  setText(`${cap("clases")} .eyebrow`, t.eb_clases);
  setHtml(`${cap("clases")} h2`, t.clases_h2);
  setText(`${cap("clases")} .lead`, t.clases_lead);
  const clf = document.querySelectorAll(`${cap("clases")} .facts .fact span`);
  [t.clases_a, t.clases_b].forEach((v, i) => { if (clf[i]) clf[i].textContent = v; });

  // programa (rejilla)
  setText(`${cap("programa")} .eyebrow`, t.nav_programa);
  setHtml(`${cap("programa")} h2`, t.programa_h2);
  const pg = document.querySelector(`${cap("programa")} .prog-grid`);
  if (pg) pg.innerHTML = getProgram(lang).map((d) => `<article class="prog-card"><h3>${esc(d.day)}</h3>${d.rows.map(([ti, w]) => `<div class="prog-item"><span class="t">${esc(ti)}</span><span class="w">${esc(w)}</span></div>`).join("")}</article>`).join("");

  // packs
  setText(`${cap("packs")} .eyebrow`, t.eb_packs);
  setHtml(`${cap("packs")} h2`, t.packs_h2);
  setText(`${cap("packs")} .lead`, t.packs_lead);
  setText(`${cap("packs")} .pack.feat .pn`, t.pack_feat);

  // extras (lista)
  setText(`${cap("extras")} .eyebrow`, t.eb_extras);
  setHtml(`${cap("extras")} h2`, t.extras_h2);
  const ex = document.querySelector(`${cap("extras")} .extras`);
  if (ex) ex.innerHTML = getExtras(lang).map(([ti, p]) => `<div class="extra"><strong>${esc(ti)}</strong><span class="ep">${esc(p)}</span></div>`).join("");

  // reservas
  setText(`${cap("reservas")} .eyebrow`, t.eb_reservas);
  setHtml(`${cap("reservas")} h2`, t.reservas_h2);
  const rl = document.querySelectorAll(`${cap("reservas")} .lead`);
  if (rl[0]) rl[0].textContent = reservasOpen() ? t.reservas_lead_open : t.reservas_lead;
  setText(`${cap("reservas")} .quote`, t.reservas_quote);

  // footer
  setText(".footer-brand p", t.foot_brand);
  const fh = document.querySelectorAll(".site-footer h4");
  if (fh[0]) fh[0].textContent = t.foot_evento;
  if (fh[1]) fh[1].textContent = t.foot_contacto;

  // selector activo + persistencia + re-encaje
  document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("active", b.getAttribute("data-lang") === lang));
  try { localStorage.setItem("baztango.lang", lang); } catch (e) { void e; }
  window.dispatchEvent(new Event("resize"));
}

function initI18n() {
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); applyLang(b.getAttribute("data-lang")); }));
  let saved = "es";
  try { saved = localStorage.getItem("baztango.lang") || "es"; } catch (e) { void e; }
  applyLang(LANGS.includes(saved) ? saved : "es");
}

/* ============================================================================
   RESERVAS · apertura programada (reservas.opensAtUtcMs en config.js)
   Antes de la hora: placeholders "Próximamente" deshabilitados. Al llegar la
   hora (incluso con la página ya abierta), cada placeholder se convierte en un
   enlace al formulario. target="_top" porque la landing corre en un iframe.
   ========================================================================== */
function reservasOpen() { return Date.now() >= reservas.opensAtUtcMs; }

function activateReservas() {
  document.querySelectorAll("[data-reserva-cta]").forEach((el) => {
    if (el.tagName === "A") return; // ya activado (idempotente)
    const a = document.createElement("a");
    a.setAttribute("data-reserva-cta", "");
    a.href = reservas.url;
    a.target = "_top";
    if (el.classList.contains("cta-pill")) a.className = "cta-pill";
    else if (el.classList.contains("mm-disabled")) a.className = "mm-cta";
    else if (el.classList.contains("foot-disabled")) a.className = "";
    else a.className = "btn btn-primary";
    a.textContent = (T[currentLang] || T.es).reservas_cta;
    el.replaceWith(a);
  });
  const rl = document.querySelector('[data-cap="reservas"] .lead');
  if (rl) rl.textContent = (T[currentLang] || T.es).reservas_lead_open;
}

function initReservasGate() {
  if (reservasOpen()) { activateReservas(); return; }
  // setTimeout se congela en pestañas en 2º plano: visibilitychange lo cubre.
  const delay = Math.min(reservas.opensAtUtcMs - Date.now() + 500, 0x7fffffff);
  setTimeout(() => { if (reservasOpen()) activateReservas(); }, delay);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && reservasOpen()) activateReservas(); });
}

/* ---------- arranque ---------- */
// En móvil, fusionamos el set ligero ANTES de crear la caché y arrancar.
if (mobileCanvas) {
  Object.assign(media, mediaMobile);
  Object.assign(tuning, tuningMobile);
}
if (stacked) initStacked();
else initPresentation();
initPackModal();
initVideo();
initI18n();
initReservasGate();
