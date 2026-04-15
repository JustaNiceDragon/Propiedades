// ============================================================
//  MY PROPERTIES — app.js  (v2 — with Clients + Dashboard)
//  Firebase Realtime Database · Pure Vanilla JS
// ============================================================

// ── PIN LOCK ─────────────────────────────────────────────
const CORRECT_PIN = "3342"; // ← change this to update your PIN
let pinEntered = "";

function initLock() {
  const lockScreen = document.getElementById("lock-screen");
  if (sessionStorage.getItem("unlocked") === "yes") {
    lockScreen.classList.add("unlocked");
    return;
  }
  document.querySelectorAll(".numpad-btn[data-digit]").forEach(btn => {
    btn.addEventListener("click", () => addDigit(btn.dataset.digit));
  });
  document.getElementById("numpad-clear").addEventListener("click", removeDigit);
  document.addEventListener("keydown", e => {
    if (lockScreen.classList.contains("unlocked")) return;
    if (e.key >= "0" && e.key <= "9") addDigit(e.key);
    if (e.key === "Backspace") removeDigit();
  });
  updatePinBoxes();
}
function addDigit(d) {
  if (pinEntered.length >= 4) return;
  pinEntered += d;
  updatePinBoxes();
  if (pinEntered.length === 4) checkPin();
}
function removeDigit() {
  pinEntered = pinEntered.slice(0, -1);
  document.getElementById("pin-error").classList.add("hidden");
  updatePinBoxes();
}
function updatePinBoxes() {
  for (let i = 0; i < 4; i++) {
    const box = document.getElementById("pin-box-" + i);
    box.textContent = pinEntered[i] ? "●" : "";
    box.classList.remove("active","filled","error");
    if (i < pinEntered.length) box.classList.add("filled");
    if (i === pinEntered.length) box.classList.add("active");
  }
}
function checkPin() {
  if (pinEntered === CORRECT_PIN) {
    sessionStorage.setItem("unlocked", "yes");
    document.getElementById("lock-screen").classList.add("unlocked");
  } else {
    for (let i = 0; i < 4; i++) document.getElementById("pin-box-"+i).classList.add("error");
    document.getElementById("pin-error").classList.remove("hidden");
    setTimeout(() => { pinEntered = ""; updatePinBoxes(); }, 1200);
  }
}

// ── FIREBASE CONFIG ──────────────────────────────────────
// Replace the placeholder values after setting up Firebase
const FIREBASE_CONFIG = {
  apiKey:            "REPLACE_WITH_YOUR_apiKey",
  authDomain:        "REPLACE_WITH_YOUR_authDomain",
  databaseURL:       "REPLACE_WITH_YOUR_databaseURL",
  projectId:         "REPLACE_WITH_YOUR_projectId",
  storageBucket:     "REPLACE_WITH_YOUR_storageBucket",
  messagingSenderId: "REPLACE_WITH_YOUR_messagingSenderId",
  appId:             "REPLACE_WITH_YOUR_appId"
};
const FIREBASE_READY = !FIREBASE_CONFIG.apiKey.startsWith("REPLACE");

// ── STATE ────────────────────────────────────────────────
let properties   = [];
let clients      = [];
let currentId    = null;
let currency     = "XCG";
let searchQuery  = "";
let filterStatus = "all";
let sortMode     = "none";
let clientSearch = "";
let clientFilter = "all";
let dbRef        = null;
let submitting   = false;
let formImages_staged = [];

const CURRENCY_SYMBOLS = { XCG: "XCG ", USD: "$ ", EUR: "€ " };

// ── DOM SHORTCUTS ────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── FIREBASE / LOCALSTORAGE ──────────────────────────────
async function initFirebase() {
  if (!FIREBASE_READY) { loadFromLocalStorage(); return; }
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getDatabase, ref, onValue, set } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
    const app = initializeApp(FIREBASE_CONFIG);
    const db  = getDatabase(app);
    dbRef = { db, ref, set };
    onValue(ref(db, "properties"), snap => {
      const d = snap.val();
      properties = d ? Object.values(d) : [];
      renderAll();
    });
    onValue(ref(db, "clients"), snap => {
      const d = snap.val();
      clients = d ? Object.values(d) : [];
      renderClients();
      renderDashboard();
    });
  } catch(err) {
    console.error("Firebase failed, using LocalStorage", err);
    loadFromLocalStorage();
  }
}
async function saveProperties() {
  if (FIREBASE_READY && dbRef) {
    const obj = {};
    properties.forEach(p => { obj[p.id] = p; });
    await dbRef.set(dbRef.ref(dbRef.db, "properties"), obj);
  } else {
    try { localStorage.setItem("my_properties", JSON.stringify(properties)); } catch(e) { showToast("⚠️ Storage full"); }
    renderAll();
  }
}
async function saveClients() {
  if (FIREBASE_READY && dbRef) {
    const obj = {};
    clients.forEach(c => { obj[c.id] = c; });
    await dbRef.set(dbRef.ref(dbRef.db, "clients"), obj);
  } else {
    try { localStorage.setItem("my_clients", JSON.stringify(clients)); } catch(e) { showToast("⚠️ Storage full"); }
    renderClients();
    renderDashboard();
  }
}
function loadFromLocalStorage() {
  try { properties = JSON.parse(localStorage.getItem("my_properties") || "[]"); } catch { properties = []; }
  try { clients    = JSON.parse(localStorage.getItem("my_clients")    || "[]"); } catch { clients = []; }
  renderAll();
  renderClients();
  renderDashboard();
}

// ── HELPERS ──────────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function escHtml(s) {
  return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function formatPrice(num) {
  const n = parseFloat(num);
  if (!num || isNaN(n)) return "—";
  return (CURRENCY_SYMBOLS[currency]||"") + n.toLocaleString("en-US");
}
function showToast(msg, dur=2800) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), dur);
}
function toBase64(file) {
  return new Promise((res,rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

// ── TAB NAVIGATION ───────────────────────────────────────
function initTabs() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(t => { t.classList.remove("active"); t.classList.add("hidden"); });
      btn.classList.add("active");
      const tc = $("tab-" + tab);
      tc.classList.remove("hidden");
      tc.classList.add("active");
      if (tab === "dashboard") renderDashboard();
    });
  });
}

// ── PROPERTY TABLE ───────────────────────────────────────
function showPropertyView(name) {
  ["view-home","view-detail","view-gallery"].forEach(id => {
    const v = $(id);
    v.classList.remove("active");
    v.classList.add("hidden");
  });
  const t = $(name);
  t.classList.remove("hidden");
  t.classList.add("active");
  window.scrollTo(0,0);
}

function getFiltered() {
  let list = [...properties];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.location||"").toLowerCase().includes(q));
  }
  if (filterStatus !== "all") list = list.filter(p => p.status === filterStatus);
  switch(sortMode) {
    case "name-asc":   list.sort((a,b) => a.name.localeCompare(b.name)); break;
    case "price-asc":  list.sort((a,b) => a.price - b.price); break;
    case "price-desc": list.sort((a,b) => b.price - a.price); break;
    case "area-asc":   list.sort((a,b) => a.area - b.area); break;
    case "area-desc":  list.sort((a,b) => b.area - a.area); break;
  }
  return list;
}

function renderTable() {
  const list  = getFiltered();
  const total = properties.length;
  const avail = properties.filter(p => p.status==="available").length;
  const rent  = properties.filter(p => p.status==="rent").length;
  $("property-count").textContent = `${total} listing${total!==1?"s":""} · ${avail} sale · ${rent} rent`;

  const tbody = $("property-tbody");
  const empty = $("empty-state");
  const table = $("property-table");

  if (list.length === 0) { empty.classList.remove("hidden"); table.style.display="none"; return; }
  empty.classList.add("hidden"); table.style.display="";

  const landMap = { owned:"Owned", government:"Gov't", leasehold:"Lease", other:"Other" };
  const frag = document.createDocumentFragment();

  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;
    if (p.status==="sold") tr.classList.add("row-sold");
    if (p.status==="rent") tr.classList.add("row-rent");

    const statusBadge = p.status==="sold"
      ? `<span class="status-badge status-sold">Sold</span>`
      : p.status==="rent"
      ? `<span class="status-badge status-rent">For Rent</span>`
      : `<span class="status-badge status-available">For Sale</span>`;

    const soldIcon = p.status==="sold" ? "🔴" : p.status==="rent" ? "🔵" : "🟢";

    tr.innerHTML = `
      <td>
        <div class="name-cell">
          <button class="name-link" data-action="open" data-id="${p.id}">${escHtml(p.name)}</button>
          ${p.location ? `<span class="name-sub">${escHtml(p.location)}</span>` : ""}
        </div>
      </td>
      <td class="price-cell">${formatPrice(p.price)}</td>
      <td class="rent-cell">${p.rentPrice ? formatPrice(p.rentPrice)+"/mo" : "—"}</td>
      <td>${p.area ? p.area+" m²" : "—"}</td>
      <td style="font-size:0.8rem;color:var(--text-muted);max-width:100px;white-space:normal">${escHtml(p.location||"—")}</td>
      <td style="font-size:0.8rem">${landMap[p.landType]||p.landType||"—"}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="actions-cell">
          <button class="action-icon-btn" data-action="toggle-sold" data-id="${p.id}" title="Toggle status">${soldIcon}</button>
          <button class="action-icon-btn" data-action="edit"        data-id="${p.id}" title="Edit">✏️</button>
          <button class="action-icon-btn" data-action="delete"      data-id="${p.id}" title="Delete">🗑</button>
        </div>
      </td>
    `;
    frag.appendChild(tr);
  });
  tbody.innerHTML = "";
  tbody.appendChild(frag);
}

function renderAll() { renderTable(); renderDashboard(); }

// Table click events
$("property-tbody").addEventListener("click", e => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action==="open")        openDetail(id);
  if (action==="toggle-sold") cycleStatus(id);
  if (action==="edit")        openEditModal(id);
  if (action==="delete")      deleteProperty(id);
});

// Cycle through Available → For Rent → Sold → Available
async function cycleStatus(id) {
  const p = properties.find(p => p.id===id);
  if (!p) return;
  const next = { available:"rent", rent:"sold", sold:"available" };
  p.status = next[p.status] || "available";
  await saveProperties();
  const labels = { available:"🟢 For Sale", rent:"🔵 For Rent", sold:"🔴 Sold" };
  showToast(labels[p.status]);
}

async function deleteProperty(id) {
  const p = properties.find(p => p.id===id);
  if (!p) return;
  if (!confirm(`Delete "${p.name}"?\nThis cannot be undone.`)) return;
  properties = properties.filter(p => p.id!==id);
  await saveProperties();
  showToast("🗑 Property deleted");
}

// Search / filter / sort
$("search-input").addEventListener("input", () => {
  searchQuery = $("search-input").value.trim();
  $("search-clear").classList.toggle("hidden", !searchQuery);
  renderTable();
});
$("search-clear").addEventListener("click", () => {
  $("search-input").value = ""; searchQuery = "";
  $("search-clear").classList.add("hidden"); renderTable();
});
$("filter-status").addEventListener("change", () => { filterStatus=$("filter-status").value; renderTable(); });
$("sort-select").addEventListener("change",   () => { sortMode=$("sort-select").value; renderTable(); });

// Currency
document.querySelectorAll(".currency-pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".currency-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active"); currency = btn.dataset.currency;
    renderTable();
    if (currentId) { const p=properties.find(p=>p.id===currentId); if(p) renderDetail(p); }
  });
});

// ── ADD / EDIT PROPERTY MODAL ────────────────────────────
$("btn-add-property").addEventListener("click", openAddModal);

function openAddModal() {
  $("form-id").value=""; $("form-name").value=""; $("form-location").value="";
  $("form-price").value=""; $("form-rent").value=""; $("form-area").value="";
  $("form-land-type").value="owned"; $("form-status").value="available";
  $("form-description").value="";
  formImages_staged=[]; $("image-preview-grid").innerHTML="";
  $("form-error").classList.remove("visible");
  $("modal-title").textContent="Add Property";
  $("modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("form-name").focus(), 100);
}

function openEditModal(id) {
  const p = properties.find(p=>p.id===id);
  if (!p) return;
  $("form-id").value=p.id; $("form-name").value=p.name; $("form-location").value=p.location||"";
  $("form-price").value=p.price; $("form-rent").value=p.rentPrice||""; $("form-area").value=p.area;
  $("form-land-type").value=p.landType||"owned"; $("form-status").value=p.status||"available";
  $("form-description").value=p.description||"";
  formImages_staged=p.images?[...p.images]:[];
  renderFormImagePreviews();
  $("form-error").classList.remove("visible");
  $("modal-title").textContent="Edit Property";
  $("modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("form-name").focus(), 100);
}

function closePropertyModal() { $("modal-overlay").classList.add("hidden"); submitting=false; }
$("modal-close").addEventListener("click", closePropertyModal);
$("form-cancel").addEventListener("click", closePropertyModal);
$("modal-overlay").addEventListener("click", e => { if(e.target===$("modal-overlay")) closePropertyModal(); });

// Image upload in form
$("form-images").addEventListener("change", async e => {
  const files = Array.from(e.target.files);
  if (formImages_staged.length+files.length>5) { showToast("⚠️ Max 5 photos"); return; }
  for (const file of files) {
    if (file.size>3*1024*1024) { showToast(`⚠️ ${file.name} too large (max 3MB)`); continue; }
    formImages_staged.push(await toBase64(file));
  }
  $("form-images").value="";
  renderFormImagePreviews();
});
function renderFormImagePreviews() {
  const grid=$("image-preview-grid"); grid.innerHTML="";
  formImages_staged.forEach((src,i)=>{
    const w=document.createElement("div"); w.className="preview-thumb-wrap";
    w.innerHTML=`<img src="${src}" alt=""/><button class="thumb-remove" data-index="${i}" type="button">✕</button>`;
    grid.appendChild(w);
  });
}
$("image-preview-grid").addEventListener("click", e => {
  const btn=e.target.closest(".thumb-remove"); if(!btn) return;
  formImages_staged.splice(parseInt(btn.dataset.index),1); renderFormImagePreviews();
});

// Form submit
$("property-form").addEventListener("submit", async e => {
  e.preventDefault(); if(submitting) return;
  const name=($("form-name").value||"").trim();
  const price=parseFloat($("form-price").value);
  const area=parseFloat($("form-area").value);
  const rentPrice=parseFloat($("form-rent").value)||0;
  if (!name)             { showErr("form-error","Property name is required."); return; }
  if (isNaN(price)||price<0) { showErr("form-error","Enter a valid sale price."); return; }
  if (isNaN(area)||area<0)   { showErr("form-error","Enter a valid area."); return; }

  submitting=true; $("form-submit").textContent="Saving…";
  const id=$("form-id").value||uid();
  const prop = {
    id, name,
    location:    ($("form-location").value||"").trim(),
    price, rentPrice: rentPrice||0,
    area,
    landType:    $("form-land-type").value,
    status:      $("form-status").value,
    description: ($("form-description").value||"").trim(),
    images:      [...formImages_staged],
    updatedAt:   Date.now()
  };
  const idx=properties.findIndex(p=>p.id===id);
  if (idx>=0) { prop.createdAt=properties[idx].createdAt; properties[idx]=prop; }
  else        { prop.createdAt=Date.now(); properties.push(prop); }

  await saveProperties();
  closePropertyModal();
  submitting=false; $("form-submit").textContent="Save Property";
  showToast(idx>=0?"✅ Property updated":"✅ Property added");
});

// ── DETAIL VIEW ──────────────────────────────────────────
function openDetail(id) {
  const p=properties.find(p=>p.id===id); if(!p) return;
  currentId=id; renderDetail(p); showPropertyView("view-detail");
}
function renderDetail(p) {
  const isSold=p.status==="sold", isRent=p.status==="rent";
  const sb=$("detail-sold-btn");
  sb.textContent = isSold?"✓ Sold — Undo" : isRent?"✓ For Rent — Undo" : "Mark as Sold";
  sb.className="btn-sold-toggle"+(isSold?" is-sold":isRent?" is-sold":"");

  const landLabel={owned:"Owned Land",government:"Government Land",leasehold:"Leasehold",other:"Other"}[p.landType]||p.landType||"—";
  const statusBadge = isSold
    ? `<span class="status-badge status-sold">Sold</span>`
    : isRent
    ? `<span class="status-badge status-rent">For Rent</span>`
    : `<span class="status-badge status-available">For Sale</span>`;

  const imgs=(p.images||[]).map((src,i)=>`
    <div class="detail-img-wrap" data-index="${i}">
      <img src="${src}" alt="Photo ${i+1}" loading="lazy"/>
      <button class="detail-img-remove" data-action="remove-img" data-index="${i}" type="button">✕</button>
    </div>`).join("");

  $("detail-body").innerHTML=`
    <div class="detail-status-row">${statusBadge}<span style="font-size:0.75rem;color:var(--text-light)">${landLabel}</span></div>
    <h2 class="detail-title">${escHtml(p.name)}</h2>
    ${p.location?`<p class="detail-location">📍 ${escHtml(p.location)}</p>`:""}
    <div class="detail-grid">
      <div class="detail-card"><div class="detail-card-label">Sale Price</div><div class="detail-card-value">${formatPrice(p.price)}</div></div>
      <div class="detail-card"><div class="detail-card-label">Rent / mo</div><div class="detail-card-value" style="color:var(--rent-text)">${p.rentPrice?formatPrice(p.rentPrice):"—"}</div></div>
      <div class="detail-card"><div class="detail-card-label">Area</div><div class="detail-card-value">${p.area?p.area+" m²":"—"}</div></div>
      <div class="detail-card"><div class="detail-card-label">Land Type</div><div class="detail-card-value" style="font-size:1rem">${landLabel}</div></div>
    </div>
    <div class="detail-inline-edit">
      <div class="detail-section-label">Quick Edit</div>
      <div class="detail-field-row"><span class="detail-field-label">Name</span><input class="detail-field-input" id="de-name" value="${escHtml(p.name)}"/><button class="detail-field-save" data-action="save-field" data-field="name">Save</button></div>
      <div class="detail-field-row"><span class="detail-field-label">Nearby</span><input class="detail-field-input" id="de-location" value="${escHtml(p.location||"")}"/><button class="detail-field-save" data-action="save-field" data-field="location">Save</button></div>
      <div class="detail-field-row"><span class="detail-field-label">Sale Price</span><input class="detail-field-input" id="de-price" type="number" value="${p.price}"/><button class="detail-field-save" data-action="save-field" data-field="price">Save</button></div>
      <div class="detail-field-row"><span class="detail-field-label">Rent/mo</span><input class="detail-field-input" id="de-rent" type="number" value="${p.rentPrice||0}"/><button class="detail-field-save" data-action="save-field" data-field="rentPrice">Save</button></div>
      <div class="detail-field-row"><span class="detail-field-label">Area m²</span><input class="detail-field-input" id="de-area" type="number" value="${p.area}"/><button class="detail-field-save" data-action="save-field" data-field="area">Save</button></div>
    </div>
    <div style="margin-bottom:24px">
      <div class="detail-section-label">Notes & Description</div>
      <textarea class="detail-notes-area" id="detail-notes" placeholder="Write any notes, conditions, info…">${escHtml(p.description||"")}</textarea>
      <button class="detail-notes-save" id="detail-notes-save">Save Notes</button>
    </div>
    <div>
      <div class="detail-section-label">Photos (${(p.images||[]).length} / 5)</div>
      <div class="detail-images-grid" id="detail-images-grid">${imgs}</div>
      ${(p.images||[]).length<5?`<label class="detail-add-image-label"><span>+ Add Photos</span><input type="file" id="detail-img-input" accept="image/*" multiple style="display:none"/></label>`:""}
    </div>
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border)">
      <button class="btn btn-ghost" id="detail-full-edit" style="width:100%">✏️ Full Edit Form</button>
    </div>`;

  $("detail-notes-save").addEventListener("click", async()=>{
    const p2=properties.find(p=>p.id===currentId); if(!p2) return;
    p2.description=$("detail-notes").value;
    await saveProperties(); showToast("📝 Notes saved");
  });
  $("detail-images-grid").addEventListener("click", e=>{
    const rm=e.target.closest("[data-action='remove-img']");
    if(rm){removeDetailImage(parseInt(rm.dataset.index));return;}
    const wrap=e.target.closest(".detail-img-wrap");
    if(wrap){const p2=properties.find(p=>p.id===currentId);if(p2&&p2.images[parseInt(wrap.dataset.index)])openImageModal(p2.images[parseInt(wrap.dataset.index)]);}
  });
  const dii=$("detail-img-input");
  if(dii){
    dii.addEventListener("change", async e=>{
      const p2=properties.find(p=>p.id===currentId); if(!p2) return;
      p2.images=p2.images||[];
      for(const file of Array.from(e.target.files).slice(0,5-p2.images.length)){
        if(file.size>3*1024*1024){showToast("⚠️ File too large");continue;}
        p2.images.push(await toBase64(file));
      }
      await saveProperties(); renderDetail(p2); showToast("📸 Photos added");
    });
  }
  $("detail-body").addEventListener("click", async e=>{
    const btn=e.target.closest("[data-action='save-field']"); if(!btn) return;
    const field=btn.dataset.field;
    const p2=properties.find(p=>p.id===currentId); if(!p2) return;
    const inputMap={name:"de-name",location:"de-location",price:"de-price",rentPrice:"de-rent",area:"de-area"};
    const val=$(inputMap[field])?.value;
    if(field==="name"&&!val.trim()){showToast("⚠️ Name cannot be empty");return;}
    if(["price","rentPrice","area"].includes(field)&&isNaN(parseFloat(val))){showToast("⚠️ Must be a number");return;}
    p2[field]=["price","rentPrice","area"].includes(field)?parseFloat(val):val.trim();
    await saveProperties(); renderDetail(p2); showToast("✅ Saved");
  });
  $("detail-full-edit").addEventListener("click",()=>{showPropertyView("view-home");setTimeout(()=>openEditModal(currentId),50);});
}

async function removeDetailImage(idx){
  if(!confirm("Remove this photo?")) return;
  const p=properties.find(p=>p.id===currentId); if(!p) return;
  p.images.splice(idx,1); await saveProperties(); renderDetail(p); showToast("🗑 Photo removed");
}
$("detail-sold-btn").addEventListener("click", async()=>{
  const p=properties.find(p=>p.id===currentId); if(!p) return;
  await cycleStatus(p.id); renderDetail(properties.find(p=>p.id===currentId));
});
$("detail-print-btn").addEventListener("click", ()=>window.print());
$("back-btn").addEventListener("click",()=>{currentId=null;showPropertyView("view-home");});

// ── GALLERY ──────────────────────────────────────────────
$("btn-gallery-view").addEventListener("click",()=>{renderGallery();showPropertyView("view-gallery");});
$("gallery-back-btn").addEventListener("click",()=>showPropertyView("view-home"));

function renderGallery(){
  const list=properties.filter(p=>p.status==="available"||p.status==="rent");
  const grid=$("gallery-grid"); grid.innerHTML="";
  if(list.length===0){grid.innerHTML=`<div style="padding:40px;text-align:center;color:var(--text-muted);grid-column:1/-1">No available properties to show.</div>`;return;}
  const frag=document.createDocumentFragment();
  list.forEach(p=>{
    const card=document.createElement("div"); card.className="gallery-card";
    const hasImg=p.images&&p.images.length>0;
    const rentLabel=p.status==="rent"?`<div style="font-size:0.72rem;color:var(--rent-text);font-weight:600;margin-top:2px">For Rent · ${formatPrice(p.rentPrice)}/mo</div>`:"";
    card.innerHTML=`
      ${hasImg?`<img class="gallery-card-img" src="${p.images[0]}" alt="${escHtml(p.name)}" loading="lazy"/>`:`<div class="gallery-card-img">🏡</div>`}
      <div class="gallery-card-info">
        <div class="gallery-card-name">${escHtml(p.name)}</div>
        <div class="gallery-card-price">${formatPrice(p.price)}</div>
        ${rentLabel}
        <div class="gallery-card-area">${p.area?p.area+" m²":""} ${p.location?"· "+p.location:""}</div>
      </div>`;
    card.addEventListener("click",()=>{showPropertyView("view-home");setTimeout(()=>openDetail(p.id),50);});
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

// ── CSV EXPORT (Properties) ──────────────────────────────
$("btn-export-csv").addEventListener("click",()=>{
  if(!properties.length){showToast("Nothing to export");return;}
  const rows=[["Name","Nearby","Sale Price","Rent/mo","Area m²","Land Type","Status","Notes"]];
  properties.forEach(p=>rows.push([p.name,p.location||"",p.price,p.rentPrice||"",p.area,p.landType,p.status,(p.description||"").replace(/\n/g," ")]));
  downloadCSV(rows,"my-properties.csv"); showToast("📊 CSV exported");
});

// ── IMAGE MODAL ──────────────────────────────────────────
function openImageModal(src){$("modal-image-src").src=src;$("image-modal").classList.remove("hidden");}
$("close-image-modal").addEventListener("click",()=>$("image-modal").classList.add("hidden"));
$("image-modal").addEventListener("click",e=>{if(e.target===$("image-modal")||e.target.classList.contains("image-modal-backdrop"))$("image-modal").classList.add("hidden");});

// ════════════════════════════════════════════════════════
//  CLIENTS
// ════════════════════════════════════════════════════════
$("btn-add-client").addEventListener("click", openAddClientModal);

function getFilteredClients(){
  let list=[...clients];
  if(clientSearch){const q=clientSearch.toLowerCase();list=list.filter(c=>c.name.toLowerCase().includes(q)||(c.phone||"").includes(q)||(c.email||"").toLowerCase().includes(q));}
  if(clientFilter!=="all") list=list.filter(c=>c.interest===clientFilter);
  return list;
}

function renderClients(){
  const list=getFilteredClients();
  $("client-count").textContent=`${clients.length} client${clients.length!==1?"s":""}`;
  const container=$("client-list");
  const emptyEl=$("empty-clients");

  // Remove existing cards
  Array.from(container.querySelectorAll(".client-card")).forEach(el=>el.remove());

  if(list.length===0){emptyEl.classList.remove("hidden");return;}
  emptyEl.classList.add("hidden");

  const interestLabel={buy:"Buying",sell:"Selling",rent:"Renting",multiple:"Multiple"};
  const interestClass={buy:"interest-buy",sell:"interest-sell",rent:"interest-rent",multiple:"interest-multiple"};
  const statusClass={active:"client-status-active",warm:"client-status-warm",closed:"client-status-closed",inactive:"client-status-inactive"};

  const frag=document.createDocumentFragment();
  list.forEach(c=>{
    const card=document.createElement("div"); card.className="client-card"; card.dataset.id=c.id;
    const budget=c.budget?` · Budget: ${(CURRENCY_SYMBOLS[currency]||"")+parseFloat(c.budget).toLocaleString("en-US")}`:"";
    const area=c.areaPref?` · ${escHtml(c.areaPref)}`:"";
    card.innerHTML=`
      <div class="client-card-top">
        <div class="client-name">${escHtml(c.name)}</div>
        <span class="client-status-badge ${statusClass[c.status]||"client-status-inactive"}">${c.status||"active"}</span>
      </div>
      <div class="client-meta">
        <span class="client-interest-tag ${interestClass[c.interest]||""}">${interestLabel[c.interest]||c.interest}</span>
        ${c.phone?`<span class="client-meta-tag">📞 ${escHtml(c.phone)}</span>`:""}
        ${c.email?`<span class="client-meta-tag">✉️ ${escHtml(c.email)}</span>`:""}
        ${budget||area?`<span class="client-meta-tag">${budget||""}${area||""}</span>`:""}
      </div>
      ${c.notes?`<div class="client-notes-preview">${escHtml(c.notes.slice(0,120))}${c.notes.length>120?"…":""}</div>`:""}
      <div class="client-actions">
        <button class="client-action-btn" data-action="edit-client" data-id="${c.id}">✏️ Edit</button>
        <button class="client-action-btn danger" data-action="delete-client" data-id="${c.id}">🗑 Delete</button>
      </div>`;
    frag.appendChild(card);
  });
  container.appendChild(frag);
}

$("client-list").addEventListener("click", e=>{
  const btn=e.target.closest("[data-action]"); if(!btn) return;
  const {action,id}=btn.dataset;
  if(action==="edit-client")   openEditClientModal(id);
  if(action==="delete-client") deleteClient(id);
});

$("client-search").addEventListener("input",()=>{
  clientSearch=$("client-search").value.trim();
  $("client-search-clear").classList.toggle("hidden",!clientSearch);
  renderClients();
});
$("client-search-clear").addEventListener("click",()=>{
  $("client-search").value=""; clientSearch="";
  $("client-search-clear").classList.add("hidden"); renderClients();
});
$("client-filter").addEventListener("change",()=>{ clientFilter=$("client-filter").value; renderClients(); });

function openAddClientModal(){
  $("client-form-id").value=""; $("client-name").value=""; $("client-phone").value="";
  $("client-email").value=""; $("client-interest").value="buy"; $("client-budget").value="";
  $("client-area-pref").value=""; $("client-notes").value=""; $("client-status").value="active";
  $("client-form-error").classList.remove("visible");
  $("client-modal-title").textContent="Add Client";
  $("client-modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("client-name").focus(),100);
}
function openEditClientModal(id){
  const c=clients.find(c=>c.id===id); if(!c) return;
  $("client-form-id").value=c.id; $("client-name").value=c.name; $("client-phone").value=c.phone||"";
  $("client-email").value=c.email||""; $("client-interest").value=c.interest||"buy";
  $("client-budget").value=c.budget||""; $("client-area-pref").value=c.areaPref||"";
  $("client-notes").value=c.notes||""; $("client-status").value=c.status||"active";
  $("client-form-error").classList.remove("visible");
  $("client-modal-title").textContent="Edit Client";
  $("client-modal-overlay").classList.remove("hidden");
  setTimeout(()=>$("client-name").focus(),100);
}
function closeClientModal(){ $("client-modal-overlay").classList.add("hidden"); }
$("client-modal-close").addEventListener("click", closeClientModal);
$("client-form-cancel").addEventListener("click", closeClientModal);
$("client-modal-overlay").addEventListener("click", e=>{ if(e.target===$("client-modal-overlay")) closeClientModal(); });

$("client-form").addEventListener("submit", async e=>{
  e.preventDefault();
  const name=($("client-name").value||"").trim();
  if(!name){showErr("client-form-error","Client name is required.");return;}
  const id=$("client-form-id").value||uid();
  const client={
    id, name,
    phone:($("client-phone").value||"").trim(),
    email:($("client-email").value||"").trim(),
    interest:$("client-interest").value,
    budget:parseFloat($("client-budget").value)||0,
    areaPref:($("client-area-pref").value||"").trim(),
    notes:($("client-notes").value||"").trim(),
    status:$("client-status").value,
    updatedAt:Date.now()
  };
  const idx=clients.findIndex(c=>c.id===id);
  if(idx>=0){client.createdAt=clients[idx].createdAt;clients[idx]=client;}
  else{client.createdAt=Date.now();clients.push(client);}
  await saveClients();
  closeClientModal();
  showToast(idx>=0?"✅ Client updated":"✅ Client added");
});

async function deleteClient(id){
  const c=clients.find(c=>c.id===id); if(!c) return;
  if(!confirm(`Delete client "${c.name}"?\nThis cannot be undone.`)) return;
  clients=clients.filter(c=>c.id!==id);
  await saveClients(); showToast("🗑 Client deleted");
}

// Export clients CSV
$("btn-export-clients-csv").addEventListener("click",()=>{
  if(!clients.length){showToast("No clients to export");return;}
  const rows=[["Name","Phone","Email","Interest","Budget","Preferred Area","Status","Notes"]];
  clients.forEach(c=>rows.push([c.name,c.phone||"",c.email||"",c.interest,c.budget||"",c.areaPref||"",c.status,(c.notes||"").replace(/\n/g," ")]));
  downloadCSV(rows,"my-clients.csv"); showToast("📊 Clients exported");
});

// ════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════
function renderDashboard(){
  const totalProps  = properties.length;
  const forSale     = properties.filter(p=>p.status==="available").length;
  const forRent     = properties.filter(p=>p.status==="rent").length;
  const sold        = properties.filter(p=>p.status==="sold").length;
  const totalClients= clients.length;
  const activeClients=clients.filter(c=>c.status==="active").length;
  const buyingClients=clients.filter(c=>c.interest==="buy").length;
  const rentingClients=clients.filter(c=>c.interest==="rent").length;

  const recentProps=[...properties].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,5);
  const recentClients=[...clients].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,5);

  $("dashboard-body").innerHTML=`
    <div>
      <div class="dash-section-title">Properties</div>
      <div class="dash-grid">
        <div class="dash-card accent"><div class="dash-card-value">${totalProps}</div><div class="dash-card-label">Total Properties</div></div>
        <div class="dash-card green"><div class="dash-card-value">${forSale}</div><div class="dash-card-label">For Sale</div></div>
        <div class="dash-card blue"><div class="dash-card-value">${forRent}</div><div class="dash-card-label">For Rent</div></div>
        <div class="dash-card red"><div class="dash-card-value">${sold}</div><div class="dash-card-label">Sold</div></div>
      </div>
    </div>
    <div>
      <div class="dash-section-title">Clients</div>
      <div class="dash-grid">
        <div class="dash-card accent"><div class="dash-card-value">${totalClients}</div><div class="dash-card-label">Total Clients</div></div>
        <div class="dash-card green"><div class="dash-card-value">${activeClients}</div><div class="dash-card-label">Active Now</div></div>
        <div class="dash-card blue"><div class="dash-card-value">${buyingClients}</div><div class="dash-card-label">Want to Buy</div></div>
        <div class="dash-card blue"><div class="dash-card-value">${rentingClients}</div><div class="dash-card-label">Want to Rent</div></div>
      </div>
    </div>
    ${recentProps.length?`
    <div>
      <div class="dash-section-title">Recent Properties</div>
      <div class="dash-recent">
        ${recentProps.map(p=>`
          <div class="dash-recent-item">
            <span class="dash-recent-name">${escHtml(p.name)}</span>
            <span class="dash-recent-price">${formatPrice(p.price)}</span>
          </div>`).join("")}
      </div>
    </div>`:""}
    ${recentClients.length?`
    <div>
      <div class="dash-section-title">Recent Clients</div>
      <div class="dash-recent">
        ${recentClients.map(c=>`
          <div class="dash-recent-item">
            <span class="dash-recent-name">${escHtml(c.name)}</span>
            <span class="dash-recent-price" style="color:var(--text-muted)">${c.interest}</span>
          </div>`).join("")}
      </div>
    </div>`:""}
  `;
}

// ── SHARED HELPERS ───────────────────────────────────────
function showErr(id, msg){ $(id).textContent=msg; $(id).classList.add("visible"); }

function downloadCSV(rows, filename){
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
}

// ── INIT ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", ()=>{
  initLock();
  initTabs();
  initFirebase();
  showPropertyView("view-home");
});
