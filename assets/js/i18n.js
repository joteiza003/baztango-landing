// ============================================================================
// BAZTANGO 20 · traducciones de la landing (ES / EU / EN / FR / DE)
// Reutiliza el copy de la web Wix para coherencia de marca.
// ============================================================================

export const LANGS = ["es", "eu", "en", "fr", "de"];
export const LANG_LABEL = { es: "ES", eu: "EU", en: "EN", fr: "FR", de: "DE" };

// Horarios fijos por actividad (no se traducen)
const TIME = {
  coctel: "20:00 – 21:00",
  vespertina: "18:00 – 20:45",
  sidra: "19:00 – 21:00",
  txakoli: "12:45 – 14:15",
  comida: "14:30 – 16:00",
  amanecer: "23:00 – 07:00",
  atardecer: "16:00 – 20:00",
  bienvenida: "18:00 – 21:00"
};

// Etiquetas de actividad por idioma
const ACT = {
  es: { bienvenida: "Milonga de bienvenida", coctel: "Cóctel de bienvenida", vespertina: "Milonga Vespertina", sidra: "Degustación de Sidra al Son Cubano", txakoli: "Bailables con Txakoli", comida: "Comida de Despedida", amanecer: "Milonga hasta el amanecer", atardecer: "Milonga hasta el atardecer", claseA: "Clase A", claseB: "Clase B" },
  eu: { bienvenida: "Ongietorri milonga", coctel: "Ongietorri koktela", vespertina: "Arratsaldeko milonga", sidra: "Sagardo dastaketa doinu kubatarrekin", txakoli: "Txakoliarekin dantzaldiak", comida: "Agur bazkaria", amanecer: "Milonga egunsentira arte", atardecer: "Milonga ilunabarrera arte", claseA: "A klasea", claseB: "B klasea" },
  en: { bienvenida: "Welcome milonga", coctel: "Welcome cocktail", vespertina: "Afternoon milonga", sidra: "Cider tasting with Cuban music", txakoli: "Dancing with Txakoli", comida: "Farewell lunch", amanecer: "Milonga until dawn", atardecer: "Milonga until sunset", claseA: "Class A", claseB: "Class B" },
  fr: { bienvenida: "Milonga de bienvenue", coctel: "Cocktail de bienvenue", vespertina: "Milonga de l'après-midi", sidra: "Dégustation de cidre au son cubain", txakoli: "Danses avec txakoli", comida: "Déjeuner d'adieu", amanecer: "Milonga jusqu'à l'aube", atardecer: "Milonga jusqu'au coucher du soleil", claseA: "Cours A", claseB: "Cours B" },
  de: { bienvenida: "Willkommensmilonga", coctel: "Willkommenscocktail", vespertina: "Nachmittagsmilonga", sidra: "Cider-Verkostung mit kubanischer Musik", txakoli: "Tanz mit Txakoli", comida: "Abschiedsessen", amanecer: "Milonga bis zum Morgengrauen", atardecer: "Milonga bis zum Sonnenuntergang", claseA: "Kurs A", claseB: "Kurs B" }
};

// Nombres de día (cortos, para tarjetas y modal)
const DAY = {
  es: { jue: "Jueves 26", vie: "Viernes 27", sab: "Sábado 28", dom: "Domingo 29" },
  eu: { jue: "Osteguna 26", vie: "Ostirala 27", sab: "Larunbata 28", dom: "Igandea 29" },
  en: { jue: "Thursday 26", vie: "Friday 27", sab: "Saturday 28", dom: "Sunday 29" },
  fr: { jue: "Jeudi 26", vie: "Vendredi 27", sab: "Samedi 28", dom: "Dimanche 29" },
  de: { jue: "Donnerstag 26", vie: "Freitag 27", sab: "Samstag 28", dom: "Sonntag 29" }
};
const DAY_SHORT = {
  es: { jue: "Jue 26", vie: "Vie 27", sab: "Sáb 28", dom: "Dom 29" },
  eu: { jue: "Og. 26", vie: "Or. 27", sab: "Lr. 28", dom: "Ig. 29" },
  en: { jue: "Thu 26", vie: "Fri 27", sab: "Sat 28", dom: "Sun 29" },
  fr: { jue: "Jeu 26", vie: "Ven 27", sab: "Sam 28", dom: "Dim 29" },
  de: { jue: "Do 26", vie: "Fr 27", sab: "Sa 28", dom: "So 29" }
};

// Composición de cada pack (datos reales de la web publicada)
const PACK_BASE = [
  { id: "ep", name: "Estado Puro + Hotel", price: "417 €", meta: true },
  { id: "dar", name: "Darienzo", price: "175 €" },
  { id: "tro", name: "Troilo", price: "155 €" },
  { id: "pug", name: "Pugliese", price: "150 €" },
  { id: "dis", name: "Disarli", price: "125 €" },
  { id: "can", name: "Canaro", price: "95 €" },
  { id: "p1", name: "P.1", price: "65 €" },
  { id: "p2", name: "P.2", price: "70 €" },
  { id: "uab", name: "Último abrazo", price: "60 €" }
];
const PACK_COMP = {
  ep:  { jue: ["coctel", "amanecer"], vie: ["vespertina", "amanecer"], sab: ["sidra", "amanecer"], dom: ["txakoli", "comida", "atardecer"] },
  dar: { jue: ["coctel", "amanecer"], vie: ["vespertina", "amanecer"], sab: ["sidra", "amanecer"], dom: ["txakoli", "comida", "atardecer"] },
  tro: { vie: ["vespertina", "amanecer"], sab: ["sidra", "amanecer"], dom: ["txakoli", "comida", "atardecer"] },
  pug: { jue: ["amanecer"], vie: ["amanecer"], sab: ["amanecer"], dom: ["txakoli", "comida", "atardecer"] },
  dis: { vie: ["amanecer"], sab: ["amanecer"], dom: ["txakoli", "comida", "atardecer"] },
  can: { jue: ["amanecer"], vie: ["amanecer"], sab: ["amanecer"] },
  p1:  { jue: ["amanecer"], vie: ["amanecer"] },
  p2:  { vie: ["amanecer"], sab: ["amanecer"] },
  uab: { dom: ["txakoli", "comida", "atardecer"] }
};
const EP_META = {
  es: ["Pack Estado Puro · 165 €", "Hotel · 252 €", "Total · 417 €"],
  eu: ["Estado Puro paketea · 165 €", "Hotela · 252 €", "Guztira · 417 €"],
  en: ["Estado Puro package · 165 €", "Hotel · 252 €", "Total · 417 €"],
  fr: ["Forfait Estado Puro · 165 €", "Hôtel · 252 €", "Total · 417 €"],
  de: ["Paket Estado Puro · 165 €", "Hotel · 252 €", "Gesamt · 417 €"]
};

// Construye el detalle de packs (para el modal) en el idioma dado
export function getPackDetails(lang) {
  const a = ACT[lang] || ACT.es;
  const d = DAY[lang] || DAY.es;
  const order = ["jue", "vie", "sab", "dom"];
  const out = {};
  for (const p of PACK_BASE) {
    const comp = PACK_COMP[p.id];
    const days = order.filter((k) => comp[k]).map((k) => ({
      d: d[k],
      items: comp[k].map((act) => `${a[act]} · ${TIME[act]}`)
    }));
    out[p.id] = { name: p.name, price: p.price, days };
    if (p.meta) out[p.id].meta = EP_META[lang] || EP_META.es;
  }
  return out;
}

// Construye programa y extras en el idioma dado (tarjetas / lista)
export function getProgram(lang) {
  const a = ACT[lang] || ACT.es;
  const d = DAY[lang] || DAY.es;
  return [
    { day: d.jue, rows: [[TIME.bienvenida, a.bienvenida], [TIME.coctel, a.coctel], [TIME.amanecer, a.amanecer]] },
    { day: d.vie, rows: [["12:45 – 14:00", a.claseA], [TIME.vespertina, a.vespertina], [TIME.amanecer, a.amanecer]] },
    { day: d.sab, rows: [["12:45 – 14:00", a.claseB], [TIME.sidra, a.sidra], [TIME.amanecer, a.amanecer]] },
    { day: d.dom, rows: [[TIME.txakoli, a.txakoli], [TIME.comida, a.comida], [TIME.atardecer, a.atardecer]] }
  ];
}
export function getExtras(lang) {
  const a = ACT[lang] || ACT.es;
  const s = DAY_SHORT[lang] || DAY_SHORT.es;
  return [
    [`${s.jue} · ${a.coctel} · ${TIME.coctel}`, "15 €"],
    [`${s.jue} · ${a.amanecer} · ${TIME.amanecer}`, "30 €"],
    [`${s.vie} · ${a.vespertina} · ${TIME.vespertina}`, "20 €"],
    [`${s.sab} · ${a.sidra} · ${TIME.sidra}`, "25 €"],
    [`${s.dom} · ${a.atardecer} · ${TIME.atardecer}`, "20 €"]
  ];
}

// Cadenas planas / títulos (los títulos con <em> van como HTML)
export const T = {
  es: {
    htmlLang: "es",
    nav_concepto: "Concepto", nav_hotel: "Hotel", nav_programa: "Programa", nav_djs: "DJs", nav_clases: "Clases", nav_packs: "Packs", nav_extras: "Extras", nav_reservas: "Reservas",
    home_btn: "↩ Inicio", mm_home: "↩ Volver al inicio", reservas_soon: "Reservas · Próximamente", scroll_cue: "Scroll para avanzar",
    hero_eyebrow: "26 – 29 Noviembre 2026 · Berrioplano",
    hero_h1: "Milongas hasta el <em>amanecer.</em>",
    hero_lead: "Baztango 20 reúne milongas hasta el amanecer, clases, DJs, convivencia y reservas del 26 al 29 de noviembre de 2026 en Berrioplano, Hotel Luze El Toro, cerca de Pamplona.",
    hero_prog: "Ver programa",
    meta1v: "20ª", meta1l: "Edición", meta2v: "4", meta2l: "Días de tango", meta3v: "500 m²", meta3l: "Pista de madera",
    eb_concepto: "Concepto", concepto_h2: "Días y noches de <em>intenso color y sabor.</em>",
    concepto_p1: "Milongas hasta el amanecer que ofrecen Joseba y Bakartxo para los días 26, 27, 28 y 29 de noviembre de 2026.",
    concepto_p2: "El encuentro se celebra en Berrioplano, en el Hotel Luze El Toro, a pocos kilómetros de Pamplona, en pleno corazón de Navarra.",
    concepto_p3: "Cuenta con un salón de baile de 500 m² y pista de madera para clases y milongas. Todas las actividades se desarrollan dentro de las instalaciones del hotel.",
    eb_aloj: "Alojamiento", aloj_h2: "Hotel y pista en el <em>mismo lugar.</em>",
    aloj_p1: "Hotel de 4 estrellas situado en el pueblo de Berrioplano, a 7 kilómetros de Pamplona, capital de Navarra.",
    aloj_p2: "El hotel fue totalmente renovado en 2016 y ofrece un ambiente rústico-provenzal para alojarse, bailar y compartir el encuentro sin desplazamientos.",
    fact1: "Parking privado gratuito al aire libre.", fact2: "62 habitaciones totalmente renovadas, exteriores y con vistas.", fact3: "El hotel y el buffet libre del desayuno tras la milonga quedan reservados solo para la tarifa Baztango en estado puro.",
    eb_djs: "Equipo artístico", djs_h2: "DJs de Baztango <em>20.</em>", djs_lead: "Cuatro DJs para las milongas hasta el amanecer.", role_teacher: "Profesora",
    eb_clases: "Clases", clases_h2: "<em>Clases.</em>", clases_lead: "Dos clases con Bakartxo Arabaolaza, abiertas a ambos roles.", clases_a: "Viernes · 12:45 – 14:00 · Técnica de giro · ambos roles", clases_b: "Sábado · 12:45 – 14:00 · Sacadas · ambos roles",
    programa_h2: "Cuatro días de <em>tango.</em>",
    eb_packs: "Packs y tarifas", packs_h2: "<em>Packs.</em>", packs_lead: "Combinaciones de hotel, milongas, comidas, clases y extras.", pack_feat: "Estado Puro + Hotel · 165 € + 252 € hotel", pack_incl: "Actividades incluidas:",
    eb_extras: "Extras", extras_h2: "Actividades <em>sueltas.</em>",
    eb_reservas: "Reservas", reservas_h2: "Reserva tu <em>plaza.</em>",
    reservas_lead: "El plazo de reservas se abrirá próximamente. Anunciaremos la fecha de apertura; mientras tanto, escríbenos para cualquier consulta.",
    reservas_quote: "Hasta el 31 de octubre: si se ha pagado la fianza, se devuelve el 50 %; el importe completo, el 85 %. Del 1 al 18 de noviembre: la fianza no se devuelve; el importe completo, el 50 %.",
    foot_brand: "Escuela de baile en Andoain con recorrido en docencia, escena y comunidad. Baztango es nuestro encuentro anual de tango.",
    foot_evento: "Evento", foot_info: "Información", foot_contacto: "Contacto"
  },
  eu: {
    htmlLang: "eu",
    nav_concepto: "Kontzeptua", nav_hotel: "Hotela", nav_programa: "Programa", nav_djs: "DJak", nav_clases: "Klaseak", nav_packs: "Paketeak", nav_extras: "Extrak", nav_reservas: "Erreserbak",
    home_btn: "↩ Hasiera", mm_home: "↩ Hasierara itzuli", reservas_soon: "Erreserbak · Laster", scroll_cue: "Egin scroll aurrera",
    hero_eyebrow: "2026ko azaroak 26 – 29 · Berrioplano",
    hero_h1: "Milongak <em>egunsentira arte.</em>",
    hero_lead: "Baztango 20: milongak egunsentira arte, klaseak, DJak, elkarbizitza eta erreserbak 2026ko azaroaren 26tik 29ra, Berrioplanon, Hotel Luze El Toron, Iruñetik gertu.",
    hero_prog: "Ikusi programa",
    meta1v: "20.", meta1l: "Edizioa", meta2v: "4", meta2l: "Tango egun", meta3v: "500 m²", meta3l: "Egurrezko pista",
    eb_concepto: "Kontzeptua", concepto_h2: "Kolore eta zapore <em>biziko egun eta gauak.</em>",
    concepto_p1: "Egunsentira arteko milongak, Josebak eta Bakartxok eskainiak 2026ko azaroaren 26, 27, 28 eta 29an.",
    concepto_p2: "Topaketa Berrioplanon egiten da, Hotel Luze El Toron, Iruñetik kilometro gutxira, Nafarroaren bihotzean.",
    concepto_p3: "500 m²-ko dantza-aretoa eta egurrezko pista ditu klase eta milongetarako. Jarduera guztiak hotelaren instalazioetan egiten dira.",
    eb_aloj: "Ostatua", aloj_h2: "Hotela eta pista <em>leku berean.</em>",
    aloj_p1: "4 izarreko hotela, Berrioplano herrian, Iruñetik —Nafarroako hiriburua— 7 kilometrora.",
    aloj_p2: "Hotela erabat berritu zuten 2016an, eta giro rustiko-provenzala eskaintzen du bertan lo egiteko, dantzatzeko eta topaketa partekatzeko, joan-etorririk gabe.",
    fact1: "Aire zabaleko aparkaleku pribatu doakoa.", fact2: "Erabat berritutako 62 logela, kanpokoak eta bistadunak.", fact3: "Hotela eta milonga ondoko gosari-buffet librea 'Baztango bere egoera puruan' tarifarako bakarrik daude.",
    eb_djs: "Talde artistikoa", djs_h2: "Baztango 20ko <em>DJak.</em>", djs_lead: "Lau DJ egunsentira arteko milongetarako.", role_teacher: "Irakaslea",
    eb_clases: "Klaseak", clases_h2: "<em>Klaseak.</em>", clases_lead: "Bi klase Bakartxo Arabaolazarekin, bi rolentzat irekiak.", clases_a: "Ostirala · 12:45 – 14:00 · Biraketa teknika · bi rolak", clases_b: "Larunbata · 12:45 – 14:00 · Sacadak · bi rolak",
    programa_h2: "Lau tango <em>egun.</em>",
    eb_packs: "Paketeak eta prezioak", packs_h2: "<em>Paketeak.</em>", packs_lead: "Hotela, milongak, otorduak, klaseak eta extrak konbinatzen ditu.", pack_feat: "Estado Puro + Hotela · 165 € + 252 € hotela", pack_incl: "Sartutako jarduerak:",
    eb_extras: "Extrak", extras_h2: "Jarduera <em>solteak.</em>",
    eb_reservas: "Erreserbak", reservas_h2: "Erreserbatu zure <em>lekua.</em>",
    reservas_lead: "Erreserba epea laster zabalduko da. Zabalpen-data iragarriko dugu; bitartean, idatzi guri edozein zalantzarako.",
    reservas_quote: "Urriaren 31ra arte: seinalea ordainduta badago, %50 itzuliko da; zenbateko osoa ordainduta, %85. Azaroaren 1etik 18ra: seinalea ez da itzuliko; zenbateko osoa ordainduta, %50.",
    foot_brand: "Andoaingo dantza-eskola, irakaskuntzan, eszenan eta komunitatean ibilbidea duena. Baztango gure urteroko tango topaketa da.",
    foot_evento: "Ekitaldia", foot_info: "Informazioa", foot_contacto: "Harremana"
  },
  en: {
    htmlLang: "en",
    nav_concepto: "Concept", nav_hotel: "Hotel", nav_programa: "Programme", nav_djs: "DJs", nav_clases: "Classes", nav_packs: "Packages", nav_extras: "Extras", nav_reservas: "Bookings",
    home_btn: "↩ Home", mm_home: "↩ Back to home", reservas_soon: "Bookings · Coming soon", scroll_cue: "Scroll to advance",
    hero_eyebrow: "26 – 29 November 2026 · Berrioplano",
    hero_h1: "Milongas until <em>dawn.</em>",
    hero_lead: "Baztango 20 brings together late-night milongas, classes, DJs, community and bookings from 26 to 29 November 2026 in Berrioplano, Hotel Luze El Toro, near Pamplona.",
    hero_prog: "See programme",
    meta1v: "20th", meta1l: "Edition", meta2v: "4", meta2l: "Days of tango", meta3v: "500 m²", meta3l: "Wooden floor",
    eb_concepto: "Concept", concepto_h2: "Days and nights of <em>intense colour and flavour.</em>",
    concepto_p1: "Milongas until dawn, offered by Joseba and Bakartxo on 26, 27, 28 and 29 November 2026.",
    concepto_p2: "The gathering takes place in Berrioplano, at Hotel Luze El Toro, a few kilometres from Pamplona, in the very heart of Navarra.",
    concepto_p3: "It has a 500 m² ballroom with a wooden floor for classes and milongas. All activities take place within the hotel facilities.",
    eb_aloj: "Accommodation", aloj_h2: "Hotel and dance floor in <em>one place.</em>",
    aloj_p1: "A 4-star hotel in the village of Berrioplano, 7 kilometres from Pamplona, capital of Navarra.",
    aloj_p2: "The hotel was fully renovated in 2016 and offers a rustic-Provençal atmosphere to stay, dance and share the gathering with no travelling.",
    fact1: "Free private outdoor parking.", fact2: "62 fully renovated rooms, outward-facing and with views.", fact3: "The hotel and the post-milonga breakfast buffet are reserved only for the Baztango in its pure state package.",
    eb_djs: "Artistic team", djs_h2: "Baztango 20 <em>DJs.</em>", djs_lead: "Four DJs for the milongas until dawn.", role_teacher: "Teacher",
    eb_clases: "Classes", clases_h2: "<em>Classes.</em>", clases_lead: "Two classes with Bakartxo Arabaolaza, open to both roles.", clases_a: "Friday · 12:45 – 14:00 · Turn technique · both roles", clases_b: "Saturday · 12:45 – 14:00 · Sacadas · both roles",
    programa_h2: "Four days of <em>tango.</em>",
    eb_packs: "Packages and prices", packs_h2: "<em>Packages.</em>", packs_lead: "Combinations of hotel, milongas, meals, classes and extras.", pack_feat: "Estado Puro + Hotel · 165 € + 252 € hotel", pack_incl: "Included activities:",
    eb_extras: "Extras", extras_h2: "Individual <em>activities.</em>",
    eb_reservas: "Bookings", reservas_h2: "Book your <em>place.</em>",
    reservas_lead: "Bookings will open soon. We will announce the opening date; in the meantime, write to us with any questions.",
    reservas_quote: "Until 31 October: if the deposit has been paid, 50 % is refunded; the full amount, 85 %. From 1 to 18 November: the deposit is not refunded; the full amount, 50 %.",
    foot_brand: "A dance school in Andoain with a long path in teaching, stage and community. Baztango is our annual tango gathering.",
    foot_evento: "Event", foot_info: "Information", foot_contacto: "Contact"
  },
  fr: {
    htmlLang: "fr",
    nav_concepto: "Concept", nav_hotel: "Hôtel", nav_programa: "Programme", nav_djs: "DJs", nav_clases: "Cours", nav_packs: "Forfaits", nav_extras: "Extras", nav_reservas: "Réservations",
    home_btn: "↩ Accueil", mm_home: "↩ Retour à l'accueil", reservas_soon: "Réservations · Bientôt", scroll_cue: "Défile pour avancer",
    hero_eyebrow: "26 – 29 novembre 2026 · Berrioplano",
    hero_h1: "Milongas <em>jusqu'à l'aube.</em>",
    hero_lead: "Baztango 20 réunit milongas jusqu'à l'aube, cours, DJs, convivialité et réservations du 26 au 29 novembre 2026 à Berrioplano, Hôtel Luze El Toro, près de Pampelune.",
    hero_prog: "Voir le programme",
    meta1v: "20e", meta1l: "Édition", meta2v: "4", meta2l: "Jours de tango", meta3v: "500 m²", meta3l: "Piste en bois",
    eb_concepto: "Concept", concepto_h2: "Jours et nuits d'<em>intense couleur et saveur.</em>",
    concepto_p1: "Milongas jusqu'à l'aube, proposées par Joseba et Bakartxo les 26, 27, 28 et 29 novembre 2026.",
    concepto_p2: "La rencontre se tient à Berrioplano, à l'Hôtel Luze El Toro, à quelques kilomètres de Pampelune, en plein cœur de la Navarre.",
    concepto_p3: "Elle dispose d'une salle de bal de 500 m² avec parquet pour les cours et les milongas. Toutes les activités se déroulent dans les installations de l'hôtel.",
    eb_aloj: "Hébergement", aloj_h2: "Hôtel et piste au <em>même endroit.</em>",
    aloj_p1: "Hôtel 4 étoiles situé dans le village de Berrioplano, à 7 kilomètres de Pampelune, capitale de la Navarre.",
    aloj_p2: "L'hôtel a été entièrement rénové en 2016 et offre une ambiance rustique-provençale pour se loger, danser et partager la rencontre sans déplacements.",
    fact1: "Parking privé extérieur gratuit.", fact2: "62 chambres entièrement rénovées, extérieures et avec vues.", fact3: "L'hôtel et le buffet du petit-déjeuner après la milonga sont réservés uniquement à la formule Baztango à l'état pur.",
    eb_djs: "Équipe artistique", djs_h2: "Les <em>DJs de Baztango 20.</em>", djs_lead: "Quatre DJs pour les milongas jusqu'à l'aube.", role_teacher: "Professeure",
    eb_clases: "Cours", clases_h2: "<em>Cours.</em>", clases_lead: "Deux cours avec Bakartxo Arabaolaza, ouverts aux deux rôles.", clases_a: "Vendredi · 12:45 – 14:00 · Technique de giro · les deux rôles", clases_b: "Samedi · 12:45 – 14:00 · Sacadas · les deux rôles",
    programa_h2: "Quatre jours de <em>tango.</em>",
    eb_packs: "Forfaits et tarifs", packs_h2: "<em>Forfaits.</em>", packs_lead: "Combinaisons d'hôtel, milongas, repas, cours et extras.", pack_feat: "Estado Puro + Hôtel · 165 € + 252 € hôtel", pack_incl: "Activités incluses :",
    eb_extras: "Extras", extras_h2: "Activités <em>à l'unité.</em>",
    eb_reservas: "Réservations", reservas_h2: "Réserve ta <em>place.</em>",
    reservas_lead: "Les réservations ouvriront prochainement. Nous annoncerons la date d'ouverture ; en attendant, écris-nous pour toute question.",
    reservas_quote: "Jusqu'au 31 octobre : si l'acompte a été versé, 50 % est remboursé ; le montant total, 85 %. Du 1er au 18 novembre : l'acompte n'est pas remboursé ; le montant total, 50 %.",
    foot_brand: "Une école de danse à Andoain avec un long parcours dans l'enseignement, la scène et la communauté. Baztango est notre rencontre annuelle de tango.",
    foot_evento: "Événement", foot_info: "Information", foot_contacto: "Contact"
  },
  de: {
    htmlLang: "de",
    nav_concepto: "Konzept", nav_hotel: "Hotel", nav_programa: "Programm", nav_djs: "DJs", nav_clases: "Kurse", nav_packs: "Pakete", nav_extras: "Extras", nav_reservas: "Buchungen",
    home_btn: "↩ Start", mm_home: "↩ Zurück zur Startseite", reservas_soon: "Buchungen · In Kürze", scroll_cue: "Zum Weiter scrollen",
    hero_eyebrow: "26. – 29. November 2026 · Berrioplano",
    hero_h1: "Milongas bis zum <em>Morgengrauen.</em>",
    hero_lead: "Baztango 20 vereint Milongas bis zum Morgengrauen, Kurse, DJs, Gemeinschaft und Buchungen vom 26. bis 29. November 2026 in Berrioplano, Hotel Luze El Toro, bei Pamplona.",
    hero_prog: "Programm ansehen",
    meta1v: "20.", meta1l: "Ausgabe", meta2v: "4", meta2l: "Tage Tango", meta3v: "500 m²", meta3l: "Holzparkett",
    eb_concepto: "Konzept", concepto_h2: "Tage und Nächte voller <em>Farbe und Geschmack.</em>",
    concepto_p1: "Milongas bis zum Morgengrauen, angeboten von Joseba und Bakartxo am 26., 27., 28. und 29. November 2026.",
    concepto_p2: "Das Treffen findet in Berrioplano statt, im Hotel Luze El Toro, wenige Kilometer von Pamplona entfernt, im Herzen Navarras.",
    concepto_p3: "Es verfügt über einen 500 m² großen Tanzsaal mit Holzparkett für Kurse und Milongas. Alle Aktivitäten finden in den Anlagen des Hotels statt.",
    eb_aloj: "Unterkunft", aloj_h2: "Hotel und Tanzfläche am <em>selben Ort.</em>",
    aloj_p1: "4-Sterne-Hotel im Dorf Berrioplano, 7 Kilometer von Pamplona, der Hauptstadt Navarras, entfernt.",
    aloj_p2: "Das Hotel wurde 2016 komplett renoviert und bietet ein rustikal-provenzalisches Ambiente zum Übernachten, Tanzen und gemeinsamen Erleben — ganz ohne Anfahrt.",
    fact1: "Kostenloser privater Außenparkplatz.", fact2: "62 komplett renovierte Zimmer, außenliegend und mit Aussicht.", fact3: "Das Hotel und das Frühstücksbuffet nach der Milonga sind nur für das Paket Baztango im reinen Zustand reserviert.",
    eb_djs: "Künstlerisches Team", djs_h2: "Die <em>DJs von Baztango 20.</em>", djs_lead: "Vier DJs für die Milongas bis zum Morgengrauen.", role_teacher: "Lehrerin",
    eb_clases: "Kurse", clases_h2: "<em>Kurse.</em>", clases_lead: "Zwei Kurse mit Bakartxo Arabaolaza, offen für beide Rollen.", clases_a: "Freitag · 12:45 – 14:00 · Drehtechnik · beide Rollen", clases_b: "Samstag · 12:45 – 14:00 · Sacadas · beide Rollen",
    programa_h2: "Vier Tage <em>Tango.</em>",
    eb_packs: "Pakete und Preise", packs_h2: "<em>Pakete.</em>", packs_lead: "Kombinationen aus Hotel, Milongas, Mahlzeiten, Kursen und Extras.", pack_feat: "Estado Puro + Hotel · 165 € + 252 € Hotel", pack_incl: "Enthaltene Aktivitäten:",
    eb_extras: "Extras", extras_h2: "<em>Einzelaktivitäten.</em>",
    eb_reservas: "Buchungen", reservas_h2: "Reserviere deinen <em>Platz.</em>",
    reservas_lead: "Die Buchungen öffnen in Kürze. Wir geben das Eröffnungsdatum bekannt; schreib uns in der Zwischenzeit bei Fragen.",
    reservas_quote: "Bis zum 31. Oktober: Wurde die Anzahlung bezahlt, werden 50 % erstattet; der Gesamtbetrag, 85 %. Vom 1. bis 18. November: keine Erstattung der Anzahlung; der Gesamtbetrag, 50 %.",
    foot_brand: "Eine Tanzschule in Andoain mit langem Weg in Lehre, Bühne und Gemeinschaft. Baztango ist unser jährliches Tango-Treffen.",
    foot_evento: "Event", foot_info: "Information", foot_contacto: "Kontakt"
  }
};
