// ============================================================
//  MY PROPERTIES — app.js  FINAL VERSION
//  · Firebase Realtime Database (cloud storage)
//  · 3 Languages: English / Spanish / Dutch
//  · PIN lock · Properties · Clients · Dashboard
// ============================================================

// ══════════════════════════════════════════════════════════
//  🔥 FIREBASE SETUP
//
//  STEP 1: Go to https://console.firebase.google.com
//  STEP 2: Create a project (any name)
//  STEP 3: Build → Realtime Database → Create Database → Test mode
//  STEP 4: Project Settings (gear icon) → Your apps → </> Web
//  STEP 5: Register app → copy the values below
//  STEP 6: Replace each "REPLACE_WITH_YOUR_..." with your real value
//  STEP 7: Save this file and re-upload to GitHub
// ══════════════════════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCaQrIeyL1JkPilBKjH2uMS0OdToVjWn0w",
  authDomain:        "my-properties-23288.firebaseapp.com",
  databaseURL:       "https://my-properties-23288-default-rtdb.firebaseio.com",
  projectId:         "my-properties-23288",
  storageBucket:     "my-properties-23288.firebasestorage.app",
  messagingSenderId: "768320523144",
  appId:             "1:768320523144:web:6a31a7f333ccdb9306883d"
};
// Automatically detects if Firebase has been configured
const FIREBASE_READY = !FIREBASE_CONFIG.apiKey.startsWith("REPLACE");

// ══════════════════════════════════════════════════════════
//  🌍 TRANSLATIONS  (English / Spanish / Dutch)
// ══════════════════════════════════════════════════════════
const TRANSLATIONS = {
  en: {
    pinSubtitle:"Enter your PIN to continue", pinError:"Incorrect PIN. Try again.",
    appTitle:"My Properties", portfolio:"Portfolio", navProperties:"Properties",
    navClients:"Clients", navDashboard:"Dashboard", currency:"Currency",
    searchPlaceholder:"Search name or location…", filterAll:"All", forSale:"For Sale",
    forRent:"For Rent", sold:"Sold", sort:"Sort", sortNameAZ:"Name A–Z",
    sortPriceUp:"Price ↑", sortPriceDown:"Price ↓", sortAreaUp:"Area ↑", sortAreaDown:"Area ↓",
    addProperty:"+ Add Property", gallery:"🖼 Gallery", exportCSV:"↓ CSV",
    emptyTitle:"Nothing here yet", emptySubProp:"Tap '+ Add Property' to get started.",
    emptySubClient:"Tap '+ Add Client' to add your first client.",
    colName:"Name", colSalePrice:"Sale Price", colRent:"Rent/mo", colArea:"Area",
    colNearby:"Nearby", colLand:"Land", colStatus:"Status", colActions:"Actions",
    back:"← Back", print:"🖨 Print", markSold:"Mark Sold", markUndone:"Undo",
    galleryTitle:"Property Gallery", gallerySubtitle:"Showing For Sale and For Rent properties only.",
    crmEyebrow:"CRM", clientSearchPlaceholder:"Search name or phone…",
    buying:"Buying", selling:"Selling", renting:"Renting", multiple:"Multiple",
    addClient:"+ Add Client",
    fieldName:"Property Name", fieldNamePlaceholder:"e.g. Corner plot near Shell",
    fieldNameHint:"Address or nickname — your main identifier.",
    fieldNearby:"Nearby Landmark", fieldNearbyPlaceholder:"e.g. Near Rif Fort, Willemstad",
    fieldSalePrice:"Sale Price", fieldRentMonth:"Rent / month",
    fieldArea:"Area (m²)", fieldLandType:"Land Type",
    landOwned:"Owned Land", landGov:"Government Land", landLease:"Leasehold", other:"Other",
    fieldNotes:"Notes / Description", fieldNotesPlaceholder:"Extra details, conditions…",
    photos:"Photos (max 5)", addPhotos:"+ Tap to add photos",
    cancel:"Cancel", save:"Save",
    clientFullName:"Full Name", clientNamePlaceholder:"e.g. Maria Lopez",
    clientPhone:"Phone", clientEmail:"Email",
    clientInterestedIn:"Interested In",
    buyingProp:"Buying a property", sellingProp:"Selling a property",
    rentingProp:"Renting a property", multipleProp:"Multiple",
    clientBudget:"Budget", clientPrefArea:"Preferred Area", clientAreaPlaceholder:"e.g. Willemstad",
    clientNotesPlaceholder:"Requirements, follow-up info…",
    clientStatus:"Client Status",
    statusActive:"🟢 Active — looking now", statusWarm:"🟡 Warm — interested",
    statusClosed:"✅ Closed — deal done", statusInactive:"⚫ Inactive",
    overviewEyebrow:"Overview",
    dashProps:"Properties", dashForSale:"For Sale", dashForRent:"For Rent", dashSold:"Sold",
    dashClients:"Clients", dashActive:"Active Now", dashWantBuy:"Want to Buy", dashWantRent:"Want to Rent",
    dashRecentProps:"Recent Properties", dashRecentClients:"Recent Clients",
    quickEdit:"Quick Edit", notesSection:"Notes & Description", saveNotes:"Save Notes",
    fullEditBtn:"✏️ Full Edit Form",
    toastAdded:"✅ Property added", toastUpdated:"✅ Property updated",
    toastDeleted:"🗑 Property deleted", toastNotesSaved:"📝 Notes saved",
    toastPhotoAdded:"📸 Photos added", toastPhotoRemoved:"🗑 Photo removed",
    toastSaved:"✅ Saved", toastFileLarge:"⚠️ File too large (max 3MB)",
    toastMax5:"⚠️ Max 5 photos per property", toastStorageFull:"⚠️ Storage full",
    toastCsvExported:"📊 CSV exported", toastNothingExport:"Nothing to export",
    toastClientAdded:"✅ Client added", toastClientUpdated:"✅ Client updated",
    toastClientDeleted:"🗑 Client deleted",
    toastForSale:"🟢 For Sale", toastForRent:"🔵 For Rent", toastSoldStatus:"🔴 Sold",
    confirmDeleteProp:"Delete this property?\n\nThis cannot be undone.",
    confirmDeleteClient:"Delete this client?\n\nThis cannot be undone.",
    confirmRemovePhoto:"Remove this photo?",
    errNameRequired:"Property name is required.",
    errPriceInvalid:"Please enter a valid sale price.",
    errAreaInvalid:"Please enter a valid area.",
    errClientName:"Client name is required.",
    errNotEmpty:"Name cannot be empty.", errMustBeNumber:"Must be a number.",
    photosLabel:"Photos",
  },
  es: {
    pinSubtitle:"Ingresa tu PIN para continuar", pinError:"PIN incorrecto. Intenta de nuevo.",
    appTitle:"Mis Propiedades", portfolio:"Portafolio", navProperties:"Propiedades",
    navClients:"Clientes", navDashboard:"Panel", currency:"Moneda",
    searchPlaceholder:"Buscar nombre o ubicación…", filterAll:"Todos", forSale:"En Venta",
    forRent:"En Alquiler", sold:"Vendido", sort:"Ordenar", sortNameAZ:"Nombre A–Z",
    sortPriceUp:"Precio ↑", sortPriceDown:"Precio ↓", sortAreaUp:"Área ↑", sortAreaDown:"Área ↓",
    addProperty:"+ Agregar Propiedad", gallery:"🖼 Galería", exportCSV:"↓ CSV",
    emptyTitle:"Nada aquí aún", emptySubProp:"Toca '+ Agregar Propiedad' para comenzar.",
    emptySubClient:"Toca '+ Agregar Cliente' para añadir tu primer cliente.",
    colName:"Nombre", colSalePrice:"Precio Venta", colRent:"Alquiler/mes", colArea:"Área",
    colNearby:"Cerca de", colLand:"Tierra", colStatus:"Estado", colActions:"Acciones",
    back:"← Volver", print:"🖨 Imprimir", markSold:"Marcar Vendido", markUndone:"Deshacer",
    galleryTitle:"Galería de Propiedades", gallerySubtitle:"Mostrando propiedades en venta y en alquiler.",
    crmEyebrow:"CRM", clientSearchPlaceholder:"Buscar nombre o teléfono…",
    buying:"Comprando", selling:"Vendiendo", renting:"Alquilando", multiple:"Múltiple",
    addClient:"+ Agregar Cliente",
    fieldName:"Nombre de la Propiedad", fieldNamePlaceholder:"Ej. Parcela esquinera cerca de Shell",
    fieldNameHint:"Dirección o apodo — tu identificador principal.",
    fieldNearby:"Punto de referencia cercano", fieldNearbyPlaceholder:"Ej. Cerca del Fuerte Rif",
    fieldSalePrice:"Precio de Venta", fieldRentMonth:"Alquiler / mes",
    fieldArea:"Área (m²)", fieldLandType:"Tipo de Terreno",
    landOwned:"Terreno Propio", landGov:"Terreno del Gobierno", landLease:"Arrendamiento", other:"Otro",
    fieldNotes:"Notas / Descripción", fieldNotesPlaceholder:"Detalles extra, condiciones…",
    photos:"Fotos (máx 5)", addPhotos:"+ Toca para agregar fotos",
    cancel:"Cancelar", save:"Guardar",
    clientFullName:"Nombre Completo", clientNamePlaceholder:"Ej. María López",
    clientPhone:"Teléfono", clientEmail:"Correo",
    clientInterestedIn:"Interesado en",
    buyingProp:"Comprar una propiedad", sellingProp:"Vender una propiedad",
    rentingProp:"Alquilar una propiedad", multipleProp:"Múltiple",
    clientBudget:"Presupuesto", clientPrefArea:"Zona preferida", clientAreaPlaceholder:"Ej. Willemstad",
    clientNotesPlaceholder:"Requisitos, seguimiento…",
    clientStatus:"Estado del Cliente",
    statusActive:"🟢 Activo — buscando ahora", statusWarm:"🟡 Tibio — interesado",
    statusClosed:"✅ Cerrado — trato hecho", statusInactive:"⚫ Inactivo",
    overviewEyebrow:"Resumen",
    dashProps:"Propiedades", dashForSale:"En Venta", dashForRent:"En Alquiler", dashSold:"Vendidas",
    dashClients:"Clientes", dashActive:"Activos Ahora", dashWantBuy:"Quieren Comprar", dashWantRent:"Quieren Alquilar",
    dashRecentProps:"Propiedades Recientes", dashRecentClients:"Clientes Recientes",
    quickEdit:"Edición Rápida", notesSection:"Notas y Descripción", saveNotes:"Guardar Notas",
    fullEditBtn:"✏️ Formulario Completo",
    toastAdded:"✅ Propiedad añadida", toastUpdated:"✅ Propiedad actualizada",
    toastDeleted:"🗑 Propiedad eliminada", toastNotesSaved:"📝 Notas guardadas",
    toastPhotoAdded:"📸 Fotos añadidas", toastPhotoRemoved:"🗑 Foto eliminada",
    toastSaved:"✅ Guardado", toastFileLarge:"⚠️ Archivo muy grande (máx 3MB)",
    toastMax5:"⚠️ Máx 5 fotos por propiedad", toastStorageFull:"⚠️ Almacenamiento lleno",
    toastCsvExported:"📊 CSV exportado", toastNothingExport:"Nada para exportar",
    toastClientAdded:"✅ Cliente añadido", toastClientUpdated:"✅ Cliente actualizado",
    toastClientDeleted:"🗑 Cliente eliminado",
    toastForSale:"🟢 En Venta", toastForRent:"🔵 En Alquiler", toastSoldStatus:"🔴 Vendido",
    confirmDeleteProp:"¿Eliminar esta propiedad?\n\nEsto no se puede deshacer.",
    confirmDeleteClient:"¿Eliminar este cliente?\n\nEsto no se puede deshacer.",
    confirmRemovePhoto:"¿Eliminar esta foto?",
    errNameRequired:"El nombre de la propiedad es obligatorio.",
    errPriceInvalid:"Ingresa un precio válido.",
    errAreaInvalid:"Ingresa un área válida.",
    errClientName:"El nombre del cliente es obligatorio.",
    errNotEmpty:"El nombre no puede estar vacío.", errMustBeNumber:"Debe ser un número.",
    photosLabel:"Fotos",
  },
  nl: {
    pinSubtitle:"Voer je PIN in om door te gaan", pinError:"Onjuiste PIN. Probeer opnieuw.",
    appTitle:"Mijn Eigendommen", portfolio:"Portefeuille", navProperties:"Eigendommen",
    navClients:"Klanten", navDashboard:"Dashboard", currency:"Valuta",
    searchPlaceholder:"Zoek op naam of locatie…", filterAll:"Alles", forSale:"Te Koop",
    forRent:"Te Huur", sold:"Verkocht", sort:"Sorteren", sortNameAZ:"Naam A–Z",
    sortPriceUp:"Prijs ↑", sortPriceDown:"Prijs ↓", sortAreaUp:"Opp. ↑", sortAreaDown:"Opp. ↓",
    addProperty:"+ Eigendom Toevoegen", gallery:"🖼 Galerij", exportCSV:"↓ CSV",
    emptyTitle:"Nog niets hier", emptySubProp:"Tik op '+ Eigendom Toevoegen' om te beginnen.",
    emptySubClient:"Tik op '+ Klant Toevoegen' om je eerste klant toe te voegen.",
    colName:"Naam", colSalePrice:"Verkoopprijs", colRent:"Huur/mnd", colArea:"Opp.",
    colNearby:"In de buurt", colLand:"Grond", colStatus:"Status", colActions:"Acties",
    back:"← Terug", print:"🖨 Afdrukken", markSold:"Markeer Verkocht", markUndone:"Ongedaan",
    galleryTitle:"Eigendom Galerij", gallerySubtitle:"Toont alleen te koop en te huur eigendommen.",
    crmEyebrow:"CRM", clientSearchPlaceholder:"Zoek naam of telefoon…",
    buying:"Koopt", selling:"Verkoopt", renting:"Huurt", multiple:"Meerdere",
    addClient:"+ Klant Toevoegen",
    fieldName:"Naam Eigendom", fieldNamePlaceholder:"Bijv. Hoekperceel bij Shell",
    fieldNameHint:"Adres of bijnaam — jouw hoofdidentificatie.",
    fieldNearby:"Nabijgelegen herkenningspunt", fieldNearbyPlaceholder:"Bijv. Naast Rif Fort",
    fieldSalePrice:"Verkoopprijs", fieldRentMonth:"Huur / maand",
    fieldArea:"Oppervlakte (m²)", fieldLandType:"Type Grond",
    landOwned:"Eigen Grond", landGov:"Overheidsgrond", landLease:"Erfpacht", other:"Anders",
    fieldNotes:"Notities / Beschrijving", fieldNotesPlaceholder:"Extra details, voorwaarden…",
    photos:"Foto's (max 5)", addPhotos:"+ Tik om foto's toe te voegen",
    cancel:"Annuleren", save:"Opslaan",
    clientFullName:"Volledige Naam", clientNamePlaceholder:"Bijv. Maria Lopez",
    clientPhone:"Telefoon", clientEmail:"E-mail",
    clientInterestedIn:"Geïnteresseerd in",
    buyingProp:"Een eigendom kopen", sellingProp:"Een eigendom verkopen",
    rentingProp:"Een eigendom huren", multipleProp:"Meerdere",
    clientBudget:"Budget", clientPrefArea:"Voorkeurgebied", clientAreaPlaceholder:"Bijv. Willemstad",
    clientNotesPlaceholder:"Vereisten, opvolginfo…",
    clientStatus:"Klant Status",
    statusActive:"🟢 Actief — zoekt nu", statusWarm:"🟡 Warm — geïnteresseerd",
    statusClosed:"✅ Gesloten — deal gedaan", statusInactive:"⚫ Inactief",
    overviewEyebrow:"Overzicht",
    dashProps:"Eigendommen", dashForSale:"Te Koop", dashForRent:"Te Huur", dashSold:"Verkocht",
    dashClients:"Klanten", dashActive:"Nu Actief", dashWantBuy:"Wil Kopen", dashWantRent:"Wil Huren",
    dashRecentProps:"Recente Eigendommen", dashRecentClients:"Recente Klanten",
    quickEdit:"Snel Bewerken", notesSection:"Notities & Beschrijving", saveNotes:"Notities Opslaan",
    fullEditBtn:"✏️ Volledig Formulier",
    toastAdded:"✅ Eigendom toegevoegd", toastUpdated:"✅ Eigendom bijgewerkt",
    toastDeleted:"🗑 Eigendom verwijderd", toastNotesSaved:"📝 Notities opgeslagen",
    toastPhotoAdded:"📸 Foto's toegevoegd", toastPhotoRemoved:"🗑 Foto verwijderd",
    toastSaved:"✅ Opgeslagen", toastFileLarge:"⚠️ Bestand te groot (max 3MB)",
    toastMax5:"⚠️ Max 5 foto's per eigendom", toastStorageFull:"⚠️ Opslag vol",
    toastCsvExported:"📊 CSV geëxporteerd", toastNothingExport:"Niets te exporteren",
    toastClientAdded:"✅ Klant toegevoegd", toastClientUpdated:"✅ Klant bijgewerkt",
    toastClientDeleted:"🗑 Klant verwijderd",
    toastForSale:"🟢 Te Koop", toastForRent:"🔵 Te Huur", toastSoldStatus:"🔴 Verkocht",
    confirmDeleteProp:"Dit eigendom verwijderen?\n\nDit kan niet ongedaan worden gemaakt.",
    confirmDeleteClient:"Deze klant verwijderen?\n\nDit kan niet ongedaan worden gemaakt.",
    confirmRemovePhoto:"Deze foto verwijderen?",
    errNameRequired:"Naam van het eigendom is verplicht.",
    errPriceInvalid:"Voer een geldige verkoopprijs in.",
    errAreaInvalid:"Voer een geldige oppervlakte in.",
    errClientName:"Naam van de klant is verplicht.",
    errNotEmpty:"Naam mag niet leeg zijn.", errMustBeNumber:"Moet een getal zijn.",
    photosLabel:"Foto's",
  }
};

// ══════════════════════════════════════════════════════════
//  PIN LOCK (password: 3342)
// ══════════════════════════════════════════════════════════
const CORRECT_PIN = "3342";
let pinEntered = "";

function initLock() {
  const ls = document.getElementById("lock-screen");
  if (sessionStorage.getItem("unlocked") === "yes") { ls.classList.add("unlocked"); return; }
  document.querySelectorAll(".numpad-btn[data-digit]").forEach(b => b.addEventListener("click", () => addDigit(b.dataset.digit)));
  document.getElementById("numpad-clear").addEventListener("click", removeDigit);
  document.addEventListener("keydown", e => {
    if (ls.classList.contains("unlocked")) return;
    if (e.key >= "0" && e.key <= "9") addDigit(e.key);
    if (e.key === "Backspace") removeDigit();
  });
  updatePinBoxes();
}
function addDigit(d) { if (pinEntered.length >= 4) return; pinEntered += d; updatePinBoxes(); if (pinEntered.length === 4) checkPin(); }
function removeDigit() { pinEntered = pinEntered.slice(0,-1); document.getElementById("pin-error").classList.add("hidden"); updatePinBoxes(); }
function updatePinBoxes() {
  for (let i=0;i<4;i++) {
    const b=document.getElementById("pin-box-"+i);
    b.textContent = pinEntered[i]?"●":"";
    b.classList.remove("active","filled","error");
    if (i<pinEntered.length) b.classList.add("filled");
    if (i===pinEntered.length) b.classList.add("active");
  }
}
function checkPin() {
  if (pinEntered===CORRECT_PIN) { sessionStorage.setItem("unlocked","yes"); document.getElementById("lock-screen").classList.add("unlocked"); }
  else {
    for(let i=0;i<4;i++) document.getElementById("pin-box-"+i).classList.add("error");
    document.getElementById("pin-error").classList.remove("hidden");
    setTimeout(()=>{ pinEntered=""; updatePinBoxes(); }, 1200);
  }
}

// ══════════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════════
let properties   = [];
let clients      = [];
let currentId    = null;
let currency     = "XCG";
let lang         = "en";
let searchQuery  = "";
let filterStatus = "all";
let sortMode     = "none";
let clientSearch = "";
let clientFilter = "all";
let dbRef        = null;
let submitting   = false;
let formImages_staged = [];

const CURRENCY_SYMBOLS = { XCG:"XCG ", USD:"$ ", EUR:"€ " };
const $ = id => document.getElementById(id);

// ══════════════════════════════════════════════════════════
//  i18n — TRANSLATIONS ENGINE
// ══════════════════════════════════════════════════════════
function t(key) { return (TRANSLATIONS[lang]||TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key; }

function applyTranslations() {
  // text content
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (val) el.textContent = val;
  });
  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const val = t(key);
    if (val) el.placeholder = val;
  });
  // update html lang attribute
  document.documentElement.lang = lang;
}

function initLangSwitcher() {
  // Auto-detect browser language on first visit
  const saved = localStorage.getItem("app_lang");
  if (saved && TRANSLATIONS[saved]) {
    lang = saved;
  } else {
    const browser = (navigator.language || "en").toLowerCase().slice(0,2);
    lang = TRANSLATIONS[browser] ? browser : "en";
    localStorage.setItem("app_lang", lang);
  }
  updateLangButtons();
  applyTranslations();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      lang = btn.dataset.lang;
      localStorage.setItem("app_lang", lang);
      updateLangButtons();
      applyTranslations();
      // Re-render dynamic content
      renderTable();
      renderClients();
      renderDashboard();
      if (currentId) {
        const p = properties.find(p => p.id === currentId);
        if (p) renderDetail(p);
      }
    });
  });
}

function updateLangButtons() {
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
}

// ══════════════════════════════════════════════════════════
//  FIREBASE
// ══════════════════════════════════════════════════════════
async function initFirebase() {
  if (!FIREBASE_READY) { loadFromLocalStorage(); return; }
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getDatabase, ref, onValue, set } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
    const app = initializeApp(FIREBASE_CONFIG);
    const db  = getDatabase(app);
    dbRef = { db, ref, set };
    // Listen to properties
    onValue(ref(db,"properties"), snap => {
      properties = snap.val() ? Object.values(snap.val()) : [];
      renderAll();
    });
    // Listen to clients
    onValue(ref(db,"clients"), snap => {
      clients = snap.val() ? Object.values(snap.val()) : [];
      renderClients(); renderDashboard();
    });
  } catch(err) {
    console.error("Firebase error, falling back to LocalStorage:", err);
    loadFromLocalStorage();
  }
}

async function saveProperties() {
  if (FIREBASE_READY && dbRef) {
    const obj = {}; properties.forEach(p => { obj[p.id]=p; });
    await dbRef.set(dbRef.ref(dbRef.db,"properties"), obj);
  } else {
    try { localStorage.setItem("my_properties", JSON.stringify(properties)); } catch { showToast(t("toastStorageFull")); }
    renderAll();
  }
}
async function saveClients() {
  if (FIREBASE_READY && dbRef) {
    const obj = {}; clients.forEach(c => { obj[c.id]=c; });
    await dbRef.set(dbRef.ref(dbRef.db,"clients"), obj);
  } else {
    try { localStorage.setItem("my_clients", JSON.stringify(clients)); } catch { showToast(t("toastStorageFull")); }
    renderClients(); renderDashboard();
  }
}
function loadFromLocalStorage() {
  try { properties = JSON.parse(localStorage.getItem("my_properties")||"[]"); } catch { properties=[]; }
  try { clients    = JSON.parse(localStorage.getItem("my_clients")||"[]"); }    catch { clients=[]; }
  renderAll(); renderClients(); renderDashboard();
}

// ══════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════
function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
function escHtml(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function formatPrice(num) {
  const n=parseFloat(num);
  if (!num||isNaN(n)) return "—";
  return (CURRENCY_SYMBOLS[currency]||"")+n.toLocaleString("en-US");
}
function showToast(msg,dur=2800) {
  const t=$("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),dur);
}
function toBase64(file) {
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=()=>rej(); r.readAsDataURL(file); });
}
function downloadCSV(rows,filename) {
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
function showErr(id,msg){ $(id).textContent=msg; $(id).classList.add("visible"); }

// ══════════════════════════════════════════════════════════
//  TAB NAVIGATION
// ══════════════════════════════════════════════════════════
function initTabs() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(t=>{t.classList.remove("active");t.classList.add("hidden");});
      btn.classList.add("active");
      const tc=$("tab-"+btn.dataset.tab);
      tc.classList.remove("hidden"); tc.classList.add("active");
      if (btn.dataset.tab==="dashboard") renderDashboard();
    });
  });
}

// ══════════════════════════════════════════════════════════
//  PROPERTY TABLE
// ══════════════════════════════════════════════════════════
function showPropertyView(name) {
  ["view-home","view-detail","view-gallery"].forEach(id=>{
    const v=$(id); v.classList.remove("active"); v.classList.add("hidden");
  });
  const v=$(name); v.classList.remove("hidden"); v.classList.add("active");
  window.scrollTo(0,0);
}

function getFiltered() {
  let list=[...properties];
  if (searchQuery) { const q=searchQuery.toLowerCase(); list=list.filter(p=>p.name.toLowerCase().includes(q)||(p.location||"").toLowerCase().includes(q)); }
  if (filterStatus!=="all") list=list.filter(p=>p.status===filterStatus);
  switch(sortMode){
    case "name-asc":   list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case "price-asc":  list.sort((a,b)=>a.price-b.price); break;
    case "price-desc": list.sort((a,b)=>b.price-a.price); break;
    case "area-asc":   list.sort((a,b)=>a.area-b.area); break;
    case "area-desc":  list.sort((a,b)=>b.area-a.area); break;
  }
  return list;
}

function renderTable() {
  const list=getFiltered();
  const total=properties.length, avail=properties.filter(p=>p.status==="available").length, rent=properties.filter(p=>p.status==="rent").length;
  $("property-count").textContent=`${total} · ${avail} ${t("forSale").toLowerCase()} · ${rent} ${t("forRent").toLowerCase()}`;

  // Update table headers
  const headers=["colName","colSalePrice","colRent","colArea","colNearby","colLand","colStatus","colActions"];
  document.querySelectorAll(".property-table thead th").forEach((th,i)=>{ if(headers[i]) th.textContent=t(headers[i]); });

  // Update filter options
  const fs=$("filter-status");
  fs.options[0].text=t("filterAll"); fs.options[1].text=t("forSale"); fs.options[2].text=t("forRent"); fs.options[3].text=t("sold");

  const empty=$("empty-state"), table=$("property-table");
  if (list.length===0) { empty.classList.remove("hidden"); table.style.display="none"; return; }
  empty.classList.add("hidden"); table.style.display="";

  const landMap={owned:t("landOwned"),government:t("landGov"),leasehold:t("landLease"),other:t("other")};
  const frag=document.createDocumentFragment();
  list.forEach(p=>{
    const tr=document.createElement("tr"); tr.dataset.id=p.id;
    if(p.status==="sold") tr.classList.add("row-sold");
    if(p.status==="rent") tr.classList.add("row-rent");
    const badge=p.status==="sold"?`<span class="status-badge status-sold">${t("sold")}</span>`:p.status==="rent"?`<span class="status-badge status-rent">${t("forRent")}</span>`:`<span class="status-badge status-available">${t("forSale")}</span>`;
    const icon=p.status==="sold"?"🔴":p.status==="rent"?"🔵":"🟢";
    tr.innerHTML=`
      <td><div class="name-cell"><button class="name-link" data-action="open" data-id="${p.id}">${escHtml(p.name)}</button>${p.location?`<span class="name-sub">${escHtml(p.location)}</span>`:""}</div></td>
      <td class="price-cell">${formatPrice(p.price)}</td>
      <td class="rent-cell">${p.rentPrice?formatPrice(p.rentPrice)+"/mo":"—"}</td>
      <td>${p.area?p.area+" m²":"—"}</td>
      <td style="font-size:0.8rem;color:var(--text-muted);max-width:100px;white-space:normal">${escHtml(p.location||"—")}</td>
      <td style="font-size:0.8rem">${landMap[p.landType]||p.landType||"—"}</td>
      <td>${badge}</td>
      <td><div class="actions-cell">
        <button class="action-icon-btn" data-action="toggle-sold" data-id="${p.id}">${icon}</button>
        <button class="action-icon-btn" data-action="edit"        data-id="${p.id}">✏️</button>
        <button class="action-icon-btn" data-action="delete"      data-id="${p.id}">🗑</button>
      </div></td>`;
    frag.appendChild(tr);
  });
  $("property-tbody").innerHTML=""; $("property-tbody").appendChild(frag);
}

function renderAll() { renderTable(); renderDashboard(); }

$("property-tbody").addEventListener("click", e=>{
  const btn=e.target.closest("[data-action]"); if(!btn) return;
  const {action,id}=btn.dataset;
  if(action==="open")        openDetail(id);
  if(action==="toggle-sold") cycleStatus(id);
  if(action==="edit")        openEditModal(id);
  if(action==="delete")      deleteProperty(id);
});

async function cycleStatus(id) {
  const p=properties.find(p=>p.id===id); if(!p) return;
  const next={available:"rent",rent:"sold",sold:"available"};
  p.status=next[p.status]||"available";
  await saveProperties();
  const labels={available:t("toastForSale"),rent:t("toastForRent"),sold:t("toastSoldStatus")};
  showToast(labels[p.status]);
}

async function deleteProperty(id) {
  const p=properties.find(p=>p.id===id); if(!p) return;
  if(!confirm(t("confirmDeleteProp"))) return;
  properties=properties.filter(p=>p.id!==id);
  await saveProperties(); showToast(t("toastDeleted"));
}

// Search / Filter / Sort
$("search-input").addEventListener("input",()=>{ searchQuery=$("search-input").value.trim(); $("search-clear").classList.toggle("hidden",!searchQuery); renderTable(); });
$("search-clear").addEventListener("click",()=>{ $("search-input").value=""; searchQuery=""; $("search-clear").classList.add("hidden"); renderTable(); });
$("filter-status").addEventListener("change",()=>{ filterStatus=$("filter-status").value; renderTable(); });
$("sort-select").addEventListener("change",()=>{ sortMode=$("sort-select").value; renderTable(); });

// Currency
document.querySelectorAll(".currency-pill").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".currency-pill").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); currency=btn.dataset.currency;
    renderTable();
    if(currentId){const p=properties.find(p=>p.id===currentId);if(p) renderDetail(p);}
  });
});

// ══════════════════════════════════════════════════════════
//  ADD / EDIT PROPERTY MODAL
// ══════════════════════════════════════════════════════════
$("btn-add-property").addEventListener("click", openAddModal);

function openAddModal() {
  $("form-id").value=""; $("form-name").value=""; $("form-location").value="";
  $("form-price").value=""; $("form-rent").value=""; $("form-area").value="";
  $("form-land-type").value="owned"; $("form-status").value="available";
  $("form-description").value=""; formImages_staged=[]; $("image-preview-grid").innerHTML="";
  $("form-error").classList.remove("visible");
  $("modal-title").textContent=t("addProperty");
  $("modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("form-name").focus(),100);
}
function openEditModal(id) {
  const p=properties.find(p=>p.id===id); if(!p) return;
  $("form-id").value=p.id; $("form-name").value=p.name; $("form-location").value=p.location||"";
  $("form-price").value=p.price; $("form-rent").value=p.rentPrice||""; $("form-area").value=p.area;
  $("form-land-type").value=p.landType||"owned"; $("form-status").value=p.status||"available";
  $("form-description").value=p.description||"";
  formImages_staged=p.images?[...p.images]:[]; renderFormImagePreviews();
  $("form-error").classList.remove("visible");
  $("modal-title").textContent=escHtml(p.name);
  $("modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("form-name").focus(),100);
}
function closePropertyModal(){ $("modal-overlay").classList.add("hidden"); submitting=false; }
$("modal-close").addEventListener("click",closePropertyModal);
$("form-cancel").addEventListener("click",closePropertyModal);
$("modal-overlay").addEventListener("click",e=>{if(e.target===$("modal-overlay"))closePropertyModal();});

$("form-images").addEventListener("change",async e=>{
  const files=Array.from(e.target.files);
  if(formImages_staged.length+files.length>5){showToast(t("toastMax5"));return;}
  for(const f of files){if(f.size>3*1024*1024){showToast(t("toastFileLarge"));continue;} formImages_staged.push(await toBase64(f));}
  $("form-images").value=""; renderFormImagePreviews();
});
function renderFormImagePreviews(){
  const g=$("image-preview-grid"); g.innerHTML="";
  formImages_staged.forEach((src,i)=>{
    const w=document.createElement("div"); w.className="preview-thumb-wrap";
    w.innerHTML=`<img src="${src}"/><button class="thumb-remove" data-index="${i}" type="button">✕</button>`;
    g.appendChild(w);
  });
}
$("image-preview-grid").addEventListener("click",e=>{
  const btn=e.target.closest(".thumb-remove"); if(!btn) return;
  formImages_staged.splice(parseInt(btn.dataset.index),1); renderFormImagePreviews();
});

$("property-form").addEventListener("submit",async e=>{
  e.preventDefault(); if(submitting) return;
  const name=($("form-name").value||"").trim();
  const price=parseFloat($("form-price").value);
  const area=parseFloat($("form-area").value);
  const rentPrice=parseFloat($("form-rent").value)||0;
  if(!name)          {showErr("form-error",t("errNameRequired"));return;}
  if(isNaN(price)||price<0){showErr("form-error",t("errPriceInvalid"));return;}
  if(isNaN(area)||area<0)  {showErr("form-error",t("errAreaInvalid"));return;}
  submitting=true; $("form-submit").textContent=t("save")+"…";
  const id=$("form-id").value||uid();
  const prop={id,name,location:($("form-location").value||"").trim(),price,rentPrice,area,landType:$("form-land-type").value,status:$("form-status").value,description:($("form-description").value||"").trim(),images:[...formImages_staged],updatedAt:Date.now()};
  const idx=properties.findIndex(p=>p.id===id);
  if(idx>=0){prop.createdAt=properties[idx].createdAt;properties[idx]=prop;}
  else{prop.createdAt=Date.now();properties.push(prop);}
  await saveProperties(); closePropertyModal();
  submitting=false; $("form-submit").textContent=t("save");
  showToast(idx>=0?t("toastUpdated"):t("toastAdded"));
});

// ══════════════════════════════════════════════════════════
//  DETAIL VIEW
// ══════════════════════════════════════════════════════════
function openDetail(id){const p=properties.find(p=>p.id===id);if(!p) return;currentId=id;renderDetail(p);showPropertyView("view-detail");}

function renderDetail(p){
  const isSold=p.status==="sold", isRent=p.status==="rent";
  const sb=$("detail-sold-btn");
  sb.textContent=isSold?t("markUndone")+" ↩":isRent?t("markUndone")+" ↩":t("markSold");
  sb.className="btn-sold-toggle"+(isSold||isRent?" is-sold":"");
  const landLabel={owned:t("landOwned"),government:t("landGov"),leasehold:t("landLease"),other:t("other")}[p.landType]||p.landType||"—";
  const badge=isSold?`<span class="status-badge status-sold">${t("sold")}</span>`:isRent?`<span class="status-badge status-rent">${t("forRent")}</span>`:`<span class="status-badge status-available">${t("forSale")}</span>`;
  const imgs=(p.images||[]).map((src,i)=>`<div class="detail-img-wrap" data-index="${i}"><img src="${src}" alt="Photo ${i+1}" loading="lazy"/><button class="detail-img-remove" data-action="remove-img" data-index="${i}" type="button">✕</button></div>`).join("");

  $("detail-body").innerHTML=`
    <div class="detail-status-row">${badge}<span style="font-size:0.75rem;color:var(--text-light)">${landLabel}</span></div>
    <h2 class="detail-title">${escHtml(p.name)}</h2>
    ${p.location?`<p class="detail-location">📍 ${escHtml(p.location)}</p>`:""}
    <div class="detail-grid">
      <div class="detail-card"><div class="detail-card-label">${t("fieldSalePrice")}</div><div class="detail-card-value">${formatPrice(p.price)}</div></div>
      <div class="detail-card"><div class="detail-card-label">${t("fieldRentMonth")}</div><div class="detail-card-value" style="color:var(--rent-text)">${p.rentPrice?formatPrice(p.rentPrice):"—"}</div></div>
      <div class="detail-card"><div class="detail-card-label">${t("fieldArea")}</div><div class="detail-card-value">${p.area?p.area+" m²":"—"}</div></div>
      <div class="detail-card"><div class="detail-card-label">${t("fieldLandType")}</div><div class="detail-card-value" style="font-size:1rem">${landLabel}</div></div>
    </div>
    <div class="detail-inline-edit">
      <div class="detail-section-label">${t("quickEdit")}</div>
      <div class="detail-field-row"><span class="detail-field-label">${t("colName")}</span><input class="detail-field-input" id="de-name" value="${escHtml(p.name)}"/><button class="detail-field-save" data-action="save-field" data-field="name">${t("save")}</button></div>
      <div class="detail-field-row"><span class="detail-field-label">${t("colNearby")}</span><input class="detail-field-input" id="de-location" value="${escHtml(p.location||"")}"/><button class="detail-field-save" data-action="save-field" data-field="location">${t("save")}</button></div>
      <div class="detail-field-row"><span class="detail-field-label">${t("colSalePrice")}</span><input class="detail-field-input" id="de-price" type="number" value="${p.price}"/><button class="detail-field-save" data-action="save-field" data-field="price">${t("save")}</button></div>
      <div class="detail-field-row"><span class="detail-field-label">${t("colRent")}</span><input class="detail-field-input" id="de-rent" type="number" value="${p.rentPrice||0}"/><button class="detail-field-save" data-action="save-field" data-field="rentPrice">${t("save")}</button></div>
      <div class="detail-field-row"><span class="detail-field-label">${t("colArea")}</span><input class="detail-field-input" id="de-area" type="number" value="${p.area}"/><button class="detail-field-save" data-action="save-field" data-field="area">${t("save")}</button></div>
    </div>
    <div style="margin-bottom:22px">
      <div class="detail-section-label">${t("notesSection")}</div>
      <textarea class="detail-notes-area" id="detail-notes" placeholder="${t("fieldNotesPlaceholder")}">${escHtml(p.description||"")}</textarea>
      <button class="detail-notes-save" id="detail-notes-save">${t("saveNotes")}</button>
    </div>
    <div>
      <div class="detail-section-label">${t("photosLabel")} (${(p.images||[]).length} / 5)</div>
      <div class="detail-images-grid" id="detail-images-grid">${imgs}</div>
      ${(p.images||[]).length<5?`<label class="detail-add-image-label"><span>${t("addPhotos")}</span><input type="file" id="detail-img-input" accept="image/*" multiple style="display:none"/></label>`:""}
    </div>
    <div style="margin-top:26px;padding-top:18px;border-top:1px solid var(--border)">
      <button class="btn btn-ghost" id="detail-full-edit" style="width:100%">${t("fullEditBtn")}</button>
    </div>`;

  $("detail-notes-save").addEventListener("click",async()=>{
    const p2=properties.find(p=>p.id===currentId);if(!p2)return;
    p2.description=$("detail-notes").value; await saveProperties(); showToast(t("toastNotesSaved"));
  });
  $("detail-images-grid").addEventListener("click",e=>{
    const rm=e.target.closest("[data-action='remove-img']");
    if(rm){removeDetailImage(parseInt(rm.dataset.index));return;}
    const wrap=e.target.closest(".detail-img-wrap");
    if(wrap){const p2=properties.find(p=>p.id===currentId);if(p2&&p2.images[parseInt(wrap.dataset.index)])openImageModal(p2.images[parseInt(wrap.dataset.index)]);}
  });
  const dii=$("detail-img-input");
  if(dii){dii.addEventListener("change",async e=>{
    const p2=properties.find(p=>p.id===currentId);if(!p2)return;
    p2.images=p2.images||[];
    for(const f of Array.from(e.target.files).slice(0,5-p2.images.length)){if(f.size>3*1024*1024){showToast(t("toastFileLarge"));continue;}p2.images.push(await toBase64(f));}
    await saveProperties(); renderDetail(p2); showToast(t("toastPhotoAdded"));
  });}
  $("detail-body").addEventListener("click",async e=>{
    const btn=e.target.closest("[data-action='save-field']");if(!btn)return;
    const field=btn.dataset.field, p2=properties.find(p=>p.id===currentId);if(!p2)return;
    const inputMap={name:"de-name",location:"de-location",price:"de-price",rentPrice:"de-rent",area:"de-area"};
    const val=$(inputMap[field])?.value;
    if(field==="name"&&!val.trim()){showToast(t("errNotEmpty"));return;}
    if(["price","rentPrice","area"].includes(field)&&isNaN(parseFloat(val))){showToast(t("errMustBeNumber"));return;}
    p2[field]=["price","rentPrice","area"].includes(field)?parseFloat(val):val.trim();
    await saveProperties(); renderDetail(p2); showToast(t("toastSaved"));
  });
  $("detail-full-edit").addEventListener("click",()=>{showPropertyView("view-home");setTimeout(()=>openEditModal(currentId),50);});
}
async function removeDetailImage(idx){
  if(!confirm(t("confirmRemovePhoto")))return;
  const p=properties.find(p=>p.id===currentId);if(!p)return;
  p.images.splice(idx,1);await saveProperties();renderDetail(p);showToast(t("toastPhotoRemoved"));
}
$("detail-sold-btn").addEventListener("click",async()=>{
  const p=properties.find(p=>p.id===currentId);if(!p)return;
  await cycleStatus(p.id); renderDetail(properties.find(p=>p.id===currentId));
});
$("detail-print-btn").addEventListener("click",()=>window.print());
$("back-btn").addEventListener("click",()=>{currentId=null;showPropertyView("view-home");});

// ══════════════════════════════════════════════════════════
//  GALLERY
// ══════════════════════════════════════════════════════════
$("btn-gallery-view").addEventListener("click",()=>{renderGallery();showPropertyView("view-gallery");});
$("gallery-back-btn").addEventListener("click",()=>showPropertyView("view-home"));
function renderGallery(){
  const list=properties.filter(p=>p.status==="available"||p.status==="rent");
  const grid=$("gallery-grid"); grid.innerHTML="";
  if(!list.length){grid.innerHTML=`<div style="padding:40px;text-align:center;color:var(--text-muted);grid-column:1/-1">${t("emptyTitle")}</div>`;return;}
  const frag=document.createDocumentFragment();
  list.forEach(p=>{
    const card=document.createElement("div");card.className="gallery-card";
    const hasImg=p.images&&p.images.length>0;
    card.innerHTML=`${hasImg?`<img class="gallery-card-img" src="${p.images[0]}" alt="${escHtml(p.name)}" loading="lazy"/>`:`<div class="gallery-card-img">🏡</div>`}
      <div class="gallery-card-info">
        <div class="gallery-card-name">${escHtml(p.name)}</div>
        <div class="gallery-card-price">${formatPrice(p.price)}</div>
        ${p.status==="rent"?`<div style="font-size:0.72rem;color:var(--rent-text);font-weight:600;margin-top:2px">${t("forRent")} · ${formatPrice(p.rentPrice)}/mo</div>`:""}
        <div class="gallery-card-area">${p.area?p.area+" m²":""} ${p.location?"· "+p.location:""}</div>
      </div>`;
    card.addEventListener("click",()=>{showPropertyView("view-home");setTimeout(()=>openDetail(p.id),50);});
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

// ══════════════════════════════════════════════════════════
//  CSV EXPORT (Properties)
// ══════════════════════════════════════════════════════════
$("btn-export-csv").addEventListener("click",()=>{
  if(!properties.length){showToast(t("toastNothingExport"));return;}
  const rows=[[t("colName"),t("colNearby"),t("colSalePrice"),t("colRent"),t("colArea"),t("fieldLandType"),t("colStatus"),t("fieldNotes")]];
  properties.forEach(p=>rows.push([p.name,p.location||"",p.price,p.rentPrice||"",p.area,p.landType,p.status,(p.description||"").replace(/\n/g," ")]));
  downloadCSV(rows,"my-properties.csv"); showToast(t("toastCsvExported"));
});

// ══════════════════════════════════════════════════════════
//  IMAGE PREVIEW MODAL
// ══════════════════════════════════════════════════════════
function openImageModal(src){$("modal-image-src").src=src;$("image-modal").classList.remove("hidden");}
$("close-image-modal").addEventListener("click",()=>$("image-modal").classList.add("hidden"));
$("image-modal").addEventListener("click",e=>{if(e.target===$("image-modal")||e.target.classList.contains("image-modal-backdrop"))$("image-modal").classList.add("hidden");});

// ══════════════════════════════════════════════════════════
//  CLIENTS
// ══════════════════════════════════════════════════════════
$("btn-add-client").addEventListener("click",openAddClientModal);

function getFilteredClients(){
  let list=[...clients];
  if(clientSearch){const q=clientSearch.toLowerCase();list=list.filter(c=>c.name.toLowerCase().includes(q)||(c.phone||"").includes(q)||(c.email||"").toLowerCase().includes(q));}
  if(clientFilter!=="all") list=list.filter(c=>c.interest===clientFilter);
  return list;
}
function renderClients(){
  const list=getFilteredClients();
  $("client-count").textContent=`${clients.length} ${t("navClients").toLowerCase()}`;
  const container=$("client-list"),emptyEl=$("empty-clients");
  Array.from(container.querySelectorAll(".client-card")).forEach(el=>el.remove());
  if(!list.length){emptyEl.classList.remove("hidden");return;}
  emptyEl.classList.add("hidden");
  const intLabel={buy:t("buying"),sell:t("selling"),rent:t("renting"),multiple:t("multiple")};
  const intClass={buy:"interest-buy",sell:"interest-sell",rent:"interest-rent",multiple:"interest-multiple"};
  const stClass={active:"client-status-active",warm:"client-status-warm",closed:"client-status-closed",inactive:"client-status-inactive"};
  const frag=document.createDocumentFragment();
  list.forEach(c=>{
    const card=document.createElement("div");card.className="client-card";card.dataset.id=c.id;
    const budget=c.budget?` · ${(CURRENCY_SYMBOLS[currency]||"")+parseFloat(c.budget).toLocaleString("en-US")}`:"";
    const area=c.areaPref?` · ${escHtml(c.areaPref)}`:"";
    card.innerHTML=`
      <div class="client-card-top"><div class="client-name">${escHtml(c.name)}</div><span class="client-status-badge ${stClass[c.status]||"client-status-inactive"}">${c.status||"active"}</span></div>
      <div class="client-meta">
        <span class="client-interest-tag ${intClass[c.interest]||""}">${intLabel[c.interest]||c.interest}</span>
        ${c.phone?`<span class="client-meta-tag">📞 ${escHtml(c.phone)}</span>`:""}
        ${c.email?`<span class="client-meta-tag">✉️ ${escHtml(c.email)}</span>`:""}
        ${budget||area?`<span class="client-meta-tag">${budget}${area}</span>`:""}
      </div>
      ${c.notes?`<div class="client-notes-preview">${escHtml(c.notes.slice(0,120))}${c.notes.length>120?"…":""}</div>`:""}
      <div class="client-actions">
        <button class="client-action-btn" data-action="edit-client"   data-id="${c.id}">✏️ ${t("colActions")}</button>
        <button class="client-action-btn danger" data-action="delete-client" data-id="${c.id}">🗑</button>
      </div>`;
    frag.appendChild(card);
  });
  container.appendChild(frag);
}
$("client-list").addEventListener("click",e=>{
  const btn=e.target.closest("[data-action]");if(!btn)return;
  const {action,id}=btn.dataset;
  if(action==="edit-client")   openEditClientModal(id);
  if(action==="delete-client") deleteClient(id);
});
$("client-search").addEventListener("input",()=>{ clientSearch=$("client-search").value.trim(); $("client-search-clear").classList.toggle("hidden",!clientSearch); renderClients(); });
$("client-search-clear").addEventListener("click",()=>{ $("client-search").value="";clientSearch="";$("client-search-clear").classList.add("hidden");renderClients(); });
$("client-filter").addEventListener("change",()=>{ clientFilter=$("client-filter").value; renderClients(); });

function openAddClientModal(){
  $("client-form-id").value="";$("client-name").value="";$("client-phone").value="";
  $("client-email").value="";$("client-interest").value="buy";$("client-budget").value="";
  $("client-area-pref").value="";$("client-notes").value="";$("client-status").value="active";
  $("client-form-error").classList.remove("visible");
  $("client-modal-title").textContent=t("addClient");
  $("client-modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("client-name").focus(),100);
}
function openEditClientModal(id){
  const c=clients.find(c=>c.id===id);if(!c)return;
  $("client-form-id").value=c.id;$("client-name").value=c.name;$("client-phone").value=c.phone||"";
  $("client-email").value=c.email||"";$("client-interest").value=c.interest||"buy";
  $("client-budget").value=c.budget||"";$("client-area-pref").value=c.areaPref||"";
  $("client-notes").value=c.notes||"";$("client-status").value=c.status||"active";
  $("client-form-error").classList.remove("visible");
  $("client-modal-title").textContent=escHtml(c.name);
  $("client-modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("client-name").focus(),100);
}
function closeClientModal(){$("client-modal-overlay").classList.add("hidden");}
$("client-modal-close").addEventListener("click",closeClientModal);
$("client-form-cancel").addEventListener("click",closeClientModal);
$("client-modal-overlay").addEventListener("click",e=>{if(e.target===$("client-modal-overlay"))closeClientModal();});

$("client-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const name=($("client-name").value||"").trim();
  if(!name){showErr("client-form-error",t("errClientName"));return;}
  const id=$("client-form-id").value||uid();
  const client={id,name,phone:($("client-phone").value||"").trim(),email:($("client-email").value||"").trim(),interest:$("client-interest").value,budget:parseFloat($("client-budget").value)||0,areaPref:($("client-area-pref").value||"").trim(),notes:($("client-notes").value||"").trim(),status:$("client-status").value,updatedAt:Date.now()};
  const idx=clients.findIndex(c=>c.id===id);
  if(idx>=0){client.createdAt=clients[idx].createdAt;clients[idx]=client;}
  else{client.createdAt=Date.now();clients.push(client);}
  await saveClients(); closeClientModal();
  showToast(idx>=0?t("toastClientUpdated"):t("toastClientAdded"));
});
async function deleteClient(id){
  const c=clients.find(c=>c.id===id);if(!c)return;
  if(!confirm(t("confirmDeleteClient")))return;
  clients=clients.filter(c=>c.id!==id);await saveClients();showToast(t("toastClientDeleted"));
}
$("btn-export-clients-csv").addEventListener("click",()=>{
  if(!clients.length){showToast(t("toastNothingExport"));return;}
  const rows=[[t("clientFullName"),"Phone","Email",t("clientInterestedIn"),t("clientBudget"),t("clientPrefArea"),t("clientStatus"),t("fieldNotes")]];
  clients.forEach(c=>rows.push([c.name,c.phone||"",c.email||"",c.interest,c.budget||"",c.areaPref||"",c.status,(c.notes||"").replace(/\n/g," ")]));
  downloadCSV(rows,"my-clients.csv");showToast(t("toastCsvExported"));
});

// ══════════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════════
function renderDashboard(){
  const totalProps=properties.length,forSaleN=properties.filter(p=>p.status==="available").length,forRentN=properties.filter(p=>p.status==="rent").length,soldN=properties.filter(p=>p.status==="sold").length;
  const totalCl=clients.length,activeCl=clients.filter(c=>c.status==="active").length,buyingCl=clients.filter(c=>c.interest==="buy").length,rentingCl=clients.filter(c=>c.interest==="rent").length;
  const recentP=[...properties].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,5);
  const recentC=[...clients].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,5);
  $("dashboard-body").innerHTML=`
    <div><div class="dash-section-title">${t("dashProps")}</div><div class="dash-grid">
      <div class="dash-card accent"><div class="dash-card-value">${totalProps}</div><div class="dash-card-label">${t("dashProps")}</div></div>
      <div class="dash-card green"><div class="dash-card-value">${forSaleN}</div><div class="dash-card-label">${t("dashForSale")}</div></div>
      <div class="dash-card blue"><div class="dash-card-value">${forRentN}</div><div class="dash-card-label">${t("dashForRent")}</div></div>
      <div class="dash-card red"><div class="dash-card-value">${soldN}</div><div class="dash-card-label">${t("dashSold")}</div></div>
    </div></div>
    <div><div class="dash-section-title">${t("dashClients")}</div><div class="dash-grid">
      <div class="dash-card accent"><div class="dash-card-value">${totalCl}</div><div class="dash-card-label">${t("dashClients")}</div></div>
      <div class="dash-card green"><div class="dash-card-value">${activeCl}</div><div class="dash-card-label">${t("dashActive")}</div></div>
      <div class="dash-card blue"><div class="dash-card-value">${buyingCl}</div><div class="dash-card-label">${t("dashWantBuy")}</div></div>
      <div class="dash-card blue"><div class="dash-card-value">${rentingCl}</div><div class="dash-card-label">${t("dashWantRent")}</div></div>
    </div></div>
    ${recentP.length?`<div><div class="dash-section-title">${t("dashRecentProps")}</div><div class="dash-recent">${recentP.map(p=>`<div class="dash-recent-item"><span class="dash-recent-name">${escHtml(p.name)}</span><span class="dash-recent-price">${formatPrice(p.price)}</span></div>`).join("")}</div></div>`:""}
    ${recentC.length?`<div><div class="dash-section-title">${t("dashRecentClients")}</div><div class="dash-recent">${recentC.map(c=>`<div class="dash-recent-item"><span class="dash-recent-name">${escHtml(c.name)}</span><span class="dash-recent-price" style="color:var(--text-muted)">${c.interest}</span></div>`).join("")}</div></div>`:""}`;
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", ()=>{
  initLock();
  initLangSwitcher();
  initTabs();
  initFirebase();
  showPropertyView("view-home");
});
