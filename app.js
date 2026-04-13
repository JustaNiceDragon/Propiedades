// ============================================================
//  MY PROPERTIES — app.js
//  Firebase Realtime Database for cloud storage
//  Pure Vanilla JS, no frameworks
// ============================================================

// ============================================================
//  PIN LOCK — your password is 3342
//  To change it, just change the number in CORRECT_PIN below
// ============================================================
const CORRECT_PIN = "3342";
let pinEntered = "";

function initLock() {
  const lockScreen = document.getElementById("lock-screen");
  // Already unlocked this browser session? Skip the PIN screen
  if (sessionStorage.getItem("unlocked") === "yes") {
    lockScreen.classList.add("unlocked");
    return;
  }
  // Tap a number on the pad
  document.querySelectorAll(".numpad-btn[data-digit]").forEach(btn => {
    btn.addEventListener("click", () => addDigit(btn.dataset.digit));
  });
  // Backspace / delete button
  document.getElementById("numpad-clear").addEventListener("click", removeDigit);
  // Physical keyboard support (for desktop)
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
    box.classList.remove("active", "filled", "error");
    if (i < pinEntered.length) box.classList.add("filled");
    if (i === pinEntered.length) box.classList.add("active");
  }
}

function checkPin() {
  if (pinEntered === CORRECT_PIN) {
    // Correct! Unlock for this browser session
    sessionStorage.setItem("unlocked", "yes");
    document.getElementById("lock-screen").classList.add("unlocked");
  } else {
    // Wrong — turn boxes red, reset after 1.2 seconds
    for (let i = 0; i < 4; i++) {
      document.getElementById("pin-box-" + i).classList.add("error");
    }
    document.getElementById("pin-error").classList.remove("hidden");
    setTimeout(() => {
      pinEntered = "";
      updatePinBoxes();
      document.getElementById("pin-error").classList.remove("hidden");
    }, 1200);
  }
}

// ──────────────────────────────────────────────────────────
//  🔥 FIREBASE CONFIG
//  1. Go to https://firebase.google.com and sign in with Google
//  2. Click "Add project" → give it a name → Continue
//  3. In the left menu click "Build" → "Realtime Database"
//  4. Click "Create Database" → choose a location → Start in TEST mode
//  5. Go to Project Settings (gear icon) → "Your apps" → </> Web
//  6. Register app → copy the config values below and replace the placeholders
// ──────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "REPLACE_WITH_YOUR_apiKey",
  authDomain:        "REPLACE_WITH_YOUR_authDomain",
  databaseURL:       "REPLACE_WITH_YOUR_databaseURL",
  projectId:         "REPLACE_WITH_YOUR_projectId",
  storageBucket:     "REPLACE_WITH_YOUR_storageBucket",
  messagingSenderId: "REPLACE_WITH_YOUR_messagingSenderId",
  appId:             "REPLACE_WITH_YOUR_appId"
};

// ──────────────────────────────────────────────────────────
//  DEMO MODE
//  If Firebase is not yet configured, the app uses LocalStorage
//  so you can still test everything locally.
// ──────────────────────────────────────────────────────────
const FIREBASE_READY = !FIREBASE_CONFIG.apiKey.startsWith("REPLACE");

// ──────────────────────────────────────────────────────────
//  STATE
// ──────────────────────────────────────────────────────────
let properties   = [];   // master array of property objects
let currentId    = null; // property open in detail view
let currency     = "XCG";
let searchQuery  = "";
let filterStatus = "all";
let sortMode     = "none";
let dbRef        = null;  // Firebase db reference
let formImages   = [];    // images staged in the add/edit form
let submitting   = false; // prevent double-tap

// Currency symbols
const CURRENCY_SYMBOLS = { XCG: "XCG ", USD: "$ ", EUR: "€ " };

// ──────────────────────────────────────────────────────────
//  DOM REFERENCES (grabbed once on load)
// ──────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// Views
const viewHome    = $("view-home");
const viewDetail  = $("view-detail");
const viewGallery = $("view-gallery");

// Home
const searchInput  = $("search-input");
const searchClear  = $("search-clear");
const filterSel    = $("filter-status");
const sortSel      = $("sort-select");
const tbody        = $("property-tbody");
const emptyState   = $("empty-state");
const propTable    = $("property-table");
const propCount    = $("property-count");

// Detail
const detailBody     = $("detail-body");
const detailSoldBtn  = $("detail-sold-btn");
const detailPrintBtn = $("detail-print-btn");

// Gallery
const galleryGrid = $("gallery-grid");

// Modal form
const modalOverlay = $("modal-overlay");
const modalTitle   = $("modal-title");
const modalClose   = $("modal-close");
const formEl       = $("property-form");
const formId       = $("form-id");
const formName     = $("form-name");
const formLocation = $("form-location");
const formPrice    = $("form-price");
const formArea     = $("form-area");
const formLandType = $("form-land-type");
const formStatus   = $("form-status");
const formDesc     = $("form-description");
const formError    = $("form-error");
const formCancel   = $("form-cancel");
const imgInput     = $("form-images");
const imgGrid      = $("image-preview-grid");

// Image preview modal
const imageModal      = $("image-modal");
const modalImgSrc     = $("modal-image-src");
const closeImageModal = $("close-image-modal");

// Toast
const toastEl = $("toast");

// ============================================================
//  FIREBASE INIT & DATA SYNC
// ============================================================
async function initFirebase() {
  if (!FIREBASE_READY) {
    loadFromLocalStorage();
    return;
  }

  // Dynamically import Firebase ESM modules from CDN
  try {
    const { initializeApp }         = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getDatabase, ref, onValue, set } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");

    const app = initializeApp(FIREBASE_CONFIG);
    const db  = getDatabase(app);
    dbRef     = { db, ref, set };

    // Listen for real-time changes
    const propertiesRef = ref(db, "properties");
    onValue(propertiesRef, snapshot => {
      const data = snapshot.val();
      properties = data ? Object.values(data) : [];
      renderAll();
    });

  } catch (err) {
    console.error("Firebase failed, falling back to LocalStorage", err);
    loadFromLocalStorage();
  }
}

// Save to Firebase (or LocalStorage in demo mode)
async function saveData() {
  if (FIREBASE_READY && dbRef) {
    const { db, ref, set } = dbRef;
    const propertiesRef = ref(db, "properties");
    // Convert array to object keyed by id for Firebase
    const obj = {};
    properties.forEach(p => { obj[p.id] = p; });
    await set(propertiesRef, obj);
  } else {
    // LocalStorage fallback
    try {
      localStorage.setItem("my_properties", JSON.stringify(properties));
    } catch(e) {
      showToast("⚠️ Storage full — try removing some images");
    }
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem("my_properties");
    properties = raw ? JSON.parse(raw) : [];
  } catch {
    properties = [];
  }
  renderAll();
}

// ============================================================
//  HELPERS
// ============================================================
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatPrice(num) {
  const sym = CURRENCY_SYMBOLS[currency] || "";
  const n   = parseFloat(num);
  if (isNaN(n)) return sym + "—";
  return sym + n.toLocaleString("en-US");
}

function showToast(msg, duration = 2800) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), duration);
}

function showView(id) {
  [viewHome, viewDetail, viewGallery].forEach(v => {
    v.classList.remove("active");
    v.classList.add("hidden");
  });
  const target = document.getElementById("view-" + id);
  target.classList.remove("hidden");
  target.classList.add("active");
  window.scrollTo(0, 0);
}

function getFiltered() {
  let list = [...properties];

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.location || "").toLowerCase().includes(q)
    );
  }

  // Filter
  if (filterStatus !== "all") {
    list = list.filter(p => p.status === filterStatus);
  }

  // Sort
  switch (sortMode) {
    case "name-asc":   list.sort((a,b) => a.name.localeCompare(b.name)); break;
    case "price-asc":  list.sort((a,b) => a.price - b.price); break;
    case "price-desc": list.sort((a,b) => b.price - a.price); break;
    case "area-asc":   list.sort((a,b) => a.area - b.area); break;
    case "area-desc":  list.sort((a,b) => b.area - a.area); break;
  }

  return list;
}

// ============================================================
//  RENDER: HOME TABLE
// ============================================================
function renderTable() {
  const list = getFiltered();

  // Update count
  const total = properties.length;
  const avail = properties.filter(p => p.status === "available").length;
  propCount.textContent = `${total} listing${total !== 1 ? "s" : ""} · ${avail} available`;

  // Empty state
  if (list.length === 0) {
    emptyState.classList.remove("hidden");
    propTable.style.display = "none";
    return;
  }
  emptyState.classList.add("hidden");
  propTable.style.display = "";

  const frag = document.createDocumentFragment();

  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;
    if (p.status === "sold") tr.classList.add("row-sold");

    const landLabel = {
      owned: "Owned", government: "Gov't", leasehold: "Lease", other: "Other"
    }[p.landType] || p.landType || "—";

    tr.innerHTML = `
      <td>
        <div class="name-cell">
          <button class="name-link" data-action="open" data-id="${p.id}">${escHtml(p.name)}</button>
          ${p.location ? `<span class="name-sub">${escHtml(p.location)}</span>` : ""}
        </div>
      </td>
      <td class="price-cell">${formatPrice(p.price)}</td>
      <td>${p.area ? p.area + " m²" : "—"}</td>
      <td style="max-width:120px;white-space:normal;font-size:0.8rem;color:var(--text-muted)">${escHtml(p.location || "—")}</td>
      <td style="font-size:0.8rem">${landLabel}</td>
      <td>
        <span class="status-badge ${p.status === "sold" ? "status-sold" : "status-available"}">
          ${p.status === "sold" ? "Sold" : "Available"}
        </span>
      </td>
      <td>
        <div class="actions-cell">
          <button class="action-icon-btn sell-btn ${p.status === "sold" ? "active" : ""}"
            data-action="toggle-sold" data-id="${p.id}" title="${p.status === "sold" ? "Mark Available" : "Mark Sold"}">
            ${p.status === "sold" ? "🔴" : "🟢"}
          </button>
          <button class="action-icon-btn" data-action="edit" data-id="${p.id}" title="Edit">✏️</button>
          <button class="action-icon-btn" data-action="delete" data-id="${p.id}" title="Delete">🗑</button>
        </div>
      </td>
    `;

    frag.appendChild(tr);
  });

  tbody.innerHTML = "";
  tbody.appendChild(frag);
}

function renderAll() {
  renderTable();
}

// Simple HTML escape
function escHtml(str) {
  return String(str || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

// ============================================================
//  TABLE CLICK DELEGATION
// ============================================================
tbody.addEventListener("click", e => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id     = btn.dataset.id;

  if (action === "open")        openDetail(id);
  if (action === "toggle-sold") toggleSold(id);
  if (action === "edit")        openEditModal(id);
  if (action === "delete")      deleteProperty(id);
});

// ============================================================
//  TOGGLE SOLD
// ============================================================
async function toggleSold(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;
  prop.status = prop.status === "sold" ? "available" : "sold";
  await saveData();
  if (!FIREBASE_READY) renderAll();
  showToast(prop.status === "sold" ? "🔴 Marked as Sold" : "🟢 Marked as Available");
}

// ============================================================
//  DELETE
// ============================================================
async function deleteProperty(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;
  if (!confirm(`Delete "${prop.name}"?\n\nThis cannot be undone.`)) return;
  properties = properties.filter(p => p.id !== id);
  await saveData();
  if (!FIREBASE_READY) renderAll();
  showToast("🗑 Property deleted");
}

// ============================================================
//  MODAL: ADD PROPERTY
// ============================================================
$("btn-add-property").addEventListener("click", openAddModal);

function openAddModal() {
  formId.value       = "";
  formName.value     = "";
  formLocation.value = "";
  formPrice.value    = "";
  formArea.value     = "";
  formLandType.value = "owned";
  formStatus.value   = "available";
  formDesc.value     = "";
  formImages.value   = "";
  formImages_staged  = [];
  imgGrid.innerHTML  = "";
  formError.classList.remove("visible");
  modalTitle.textContent = "Add Property";
  modalOverlay.classList.remove("hidden");
  formName.focus();
}

// Edit
function openEditModal(id) {
  const p = properties.find(p => p.id === id);
  if (!p) return;
  formId.value       = p.id;
  formName.value     = p.name;
  formLocation.value = p.location || "";
  formPrice.value    = p.price;
  formArea.value     = p.area;
  formLandType.value = p.landType || "owned";
  formStatus.value   = p.status || "available";
  formDesc.value     = p.description || "";
  formError.classList.remove("visible");
  modalTitle.textContent = "Edit Property";

  // Load existing images into form preview
  formImages_staged = p.images ? [...p.images] : [];
  renderFormImagePreviews();

  modalOverlay.classList.remove("hidden");
  formName.focus();
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  submitting = false;
}
modalClose.addEventListener("click", closeModal);
formCancel.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});

// ============================================================
//  IMAGE HANDLING (in form)
// ============================================================
let formImages_staged = []; // Base64 strings

imgInput.addEventListener("change", async e => {
  const files = Array.from(e.target.files);
  if (formImages_staged.length + files.length > 5) {
    showToast("⚠️ Max 5 photos per property");
    return;
  }

  for (const file of files) {
    if (file.size > 3 * 1024 * 1024) {
      showToast(`⚠️ "${file.name}" is too large (max 3MB)`);
      continue;
    }
    const b64 = await toBase64(file);
    formImages_staged.push(b64);
  }
  imgInput.value = "";
  renderFormImagePreviews();
});

function toBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = () => res(reader.result);
    reader.onerror = () => rej(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

function renderFormImagePreviews() {
  imgGrid.innerHTML = "";
  formImages_staged.forEach((src, i) => {
    const wrap = document.createElement("div");
    wrap.className = "preview-thumb-wrap";
    wrap.innerHTML = `
      <img src="${src}" alt="Preview" />
      <button class="thumb-remove" data-index="${i}" type="button">✕</button>
    `;
    imgGrid.appendChild(wrap);
  });
}

imgGrid.addEventListener("click", e => {
  const btn = e.target.closest(".thumb-remove");
  if (!btn) return;
  const idx = parseInt(btn.dataset.index);
  formImages_staged.splice(idx, 1);
  renderFormImagePreviews();
});

// ============================================================
//  FORM SUBMIT
// ============================================================
formEl.addEventListener("submit", async e => {
  e.preventDefault();
  if (submitting) return;

  // Validate
  const name  = formName.value.trim();
  const price = parseFloat(formPrice.value);
  const area  = parseFloat(formArea.value);

  if (!name) {
    showFormError("Property name is required.");
    return;
  }
  if (isNaN(price) || price < 0) {
    showFormError("Please enter a valid price.");
    return;
  }
  if (isNaN(area) || area < 0) {
    showFormError("Please enter a valid area.");
    return;
  }

  submitting = true;
  $("form-submit").textContent = "Saving…";

  const id = formId.value || uid();

  const prop = {
    id,
    name,
    location:    formLocation.value.trim(),
    price,
    area,
    landType:    formLandType.value,
    status:      formStatus.value,
    description: formDesc.value.trim(),
    images:      [...formImages_staged],
    updatedAt:   Date.now()
  };

  const existing = properties.findIndex(p => p.id === id);
  if (existing >= 0) {
    // Preserve createdAt
    prop.createdAt = properties[existing].createdAt;
    properties[existing] = prop;
  } else {
    prop.createdAt = Date.now();
    properties.push(prop);
  }

  await saveData();
  if (!FIREBASE_READY) renderAll();

  closeModal();
  submitting = false;
  $("form-submit").textContent = "Save Property";
  showToast(existing >= 0 ? "✅ Property updated" : "✅ Property added");
});

function showFormError(msg) {
  formError.textContent = msg;
  formError.classList.add("visible");
}

// ============================================================
//  DETAIL VIEW
// ============================================================
function openDetail(id) {
  const p = properties.find(p => p.id === id);
  if (!p) return;
  currentId = id;
  renderDetail(p);
  showView("detail");
}

function renderDetail(p) {
  const isSold = p.status === "sold";

  // Update sold button
  detailSoldBtn.textContent = isSold ? "✓ Sold — Undo" : "Mark as Sold";
  detailSoldBtn.classList.toggle("is-sold", isSold);

  const landLabel = {
    owned: "Owned Land", government: "Government Land",
    leasehold: "Leasehold", other: "Other"
  }[p.landType] || p.landType || "—";

  // Images HTML
  const imgs = (p.images || []).map((src, i) => `
    <div class="detail-img-wrap" data-index="${i}">
      <img src="${src}" alt="Property photo ${i+1}" loading="lazy" />
      <button class="detail-img-remove" data-action="remove-img" data-index="${i}" type="button">✕</button>
    </div>
  `).join("");

  detailBody.innerHTML = `
    <div class="detail-status-row">
      <span class="status-badge ${isSold ? "status-sold" : "status-available"}">
        ${isSold ? "Sold" : "Available"}
      </span>
      <span style="font-size:0.75rem;color:var(--text-light)">
        ${p.landType ? landLabel : ""}
      </span>
    </div>

    <h2 class="detail-title">${escHtml(p.name)}</h2>
    ${p.location ? `<p class="detail-location">📍 ${escHtml(p.location)}</p>` : ""}

    <div class="detail-grid">
      <div class="detail-card">
        <div class="detail-card-label">Price</div>
        <div class="detail-card-value">${formatPrice(p.price)}</div>
      </div>
      <div class="detail-card">
        <div class="detail-card-label">Area</div>
        <div class="detail-card-value">${p.area ? p.area + " m²" : "—"}</div>
      </div>
      <div class="detail-card">
        <div class="detail-card-label">Land Type</div>
        <div class="detail-card-value" style="font-size:1rem">${landLabel}</div>
      </div>
      <div class="detail-card">
        <div class="detail-card-label">Status</div>
        <div class="detail-card-value" style="font-size:1rem;color:${isSold?"var(--sold-text)":"var(--green)"}">
          ${isSold ? "Sold" : "Available"}
        </div>
      </div>
    </div>

    <!-- Quick edit inline fields -->
    <div class="detail-inline-edit">
      <div class="detail-section-label">Quick Edit</div>
      <div class="detail-field-row">
        <span class="detail-field-label">Name</span>
        <input class="detail-field-input" id="de-name" value="${escHtml(p.name)}" />
        <button class="detail-field-save" data-action="save-field" data-field="name">Save</button>
      </div>
      <div class="detail-field-row">
        <span class="detail-field-label">Nearby</span>
        <input class="detail-field-input" id="de-location" value="${escHtml(p.location || "")}" />
        <button class="detail-field-save" data-action="save-field" data-field="location">Save</button>
      </div>
      <div class="detail-field-row">
        <span class="detail-field-label">Price</span>
        <input class="detail-field-input" id="de-price" type="number" value="${p.price}" />
        <button class="detail-field-save" data-action="save-field" data-field="price">Save</button>
      </div>
      <div class="detail-field-row">
        <span class="detail-field-label">Area m²</span>
        <input class="detail-field-input" id="de-area" type="number" value="${p.area}" />
        <button class="detail-field-save" data-action="save-field" data-field="area">Save</button>
      </div>
    </div>

    <!-- Notes -->
    <div style="margin-bottom:24px">
      <div class="detail-section-label">Notes & Description</div>
      <textarea class="detail-notes-area" id="detail-notes" placeholder="Write any notes, conditions, contact info, anything…">${escHtml(p.description || "")}</textarea>
      <button class="detail-notes-save" id="detail-notes-save">Save Notes</button>
    </div>

    <!-- Images -->
    <div>
      <div class="detail-section-label">Photos (${(p.images||[]).length} / 5)</div>
      <div class="detail-images-grid" id="detail-images-grid">
        ${imgs}
      </div>
      ${(p.images||[]).length < 5 ? `
        <label class="detail-add-image-label">
          <span>+ Add Photos</span>
          <input type="file" id="detail-img-input" accept="image/*" multiple style="display:none" />
        </label>
      ` : ""}
    </div>

    <!-- Full edit button -->
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border)">
      <button class="btn btn-ghost" id="detail-full-edit" style="width:100%">
        ✏️ Full Edit Form
      </button>
    </div>
  `;

  // Notes save
  $("detail-notes-save").addEventListener("click", async () => {
    const p2 = properties.find(p => p.id === currentId);
    if (!p2) return;
    p2.description = $("detail-notes").value;
    await saveData();
    if (!FIREBASE_READY) renderAll();
    showToast("📝 Notes saved");
  });

  // Image tap to preview
  $("detail-images-grid").addEventListener("click", e => {
    const wrap = e.target.closest(".detail-img-wrap");
    const removeBtn = e.target.closest("[data-action='remove-img']");

    if (removeBtn) {
      removeDetailImage(parseInt(removeBtn.dataset.index));
      return;
    }
    if (wrap) {
      const idx = parseInt(wrap.dataset.index);
      const p2  = properties.find(p => p.id === currentId);
      if (p2 && p2.images[idx]) openImageModal(p2.images[idx]);
    }
  });

  // Add images from detail
  const detailImgInput = $("detail-img-input");
  if (detailImgInput) {
    detailImgInput.addEventListener("change", async e => {
      const p2 = properties.find(p => p.id === currentId);
      if (!p2) return;
      p2.images = p2.images || [];

      const files = Array.from(e.target.files);
      const slotsLeft = 5 - p2.images.length;

      for (const file of files.slice(0, slotsLeft)) {
        if (file.size > 3 * 1024 * 1024) { showToast("⚠️ File too large (max 3MB)"); continue; }
        const b64 = await toBase64(file);
        p2.images.push(b64);
      }
      await saveData();
      if (!FIREBASE_READY) renderAll();
      renderDetail(p2);
      showToast("📸 Photos added");
    });
  }

  // Quick save fields
  detailBody.addEventListener("click", async e => {
    const btn = e.target.closest("[data-action='save-field']");
    if (!btn) return;
    const field = btn.dataset.field;
    const p2    = properties.find(p => p.id === currentId);
    if (!p2) return;

    const inputMap = { name: "de-name", location: "de-location", price: "de-price", area: "de-area" };
    const val = $(inputMap[field])?.value;

    if (field === "name" && !val.trim()) { showToast("⚠️ Name cannot be empty"); return; }
    if ((field === "price" || field === "area") && isNaN(parseFloat(val))) {
      showToast("⚠️ Must be a number"); return;
    }

    p2[field] = (field === "price" || field === "area") ? parseFloat(val) : val.trim();
    await saveData();
    if (!FIREBASE_READY) renderAll();
    renderDetail(p2);
    showToast("✅ Saved");
  });

  // Full edit button
  $("detail-full-edit").addEventListener("click", () => {
    showView("home");
    setTimeout(() => openEditModal(currentId), 50);
  });
}

// Remove image from detail view
async function removeDetailImage(idx) {
  if (!confirm("Remove this photo?")) return;
  const p = properties.find(p => p.id === currentId);
  if (!p) return;
  p.images.splice(idx, 1);
  await saveData();
  if (!FIREBASE_READY) renderAll();
  renderDetail(p);
  showToast("🗑 Photo removed");
}

// Detail sold button
detailSoldBtn.addEventListener("click", async () => {
  const p = properties.find(p => p.id === currentId);
  if (!p) return;
  p.status = p.status === "sold" ? "available" : "sold";
  await saveData();
  if (!FIREBASE_READY) renderAll();
  renderDetail(p);
  showToast(p.status === "sold" ? "🔴 Marked as Sold" : "🟢 Marked as Available");
});

// Print
detailPrintBtn.addEventListener("click", () => window.print());

// Back
$("back-btn").addEventListener("click", () => {
  currentId = null;
  showView("home");
});

// ============================================================
//  IMAGE PREVIEW MODAL
// ============================================================
function openImageModal(src) {
  modalImgSrc.src = src;
  imageModal.classList.remove("hidden");
}
closeImageModal.addEventListener("click", () => imageModal.classList.add("hidden"));
$("image-modal-backdrop") || imageModal.querySelector(".image-modal-backdrop")?.addEventListener("click", () => {
  imageModal.classList.add("hidden");
});
imageModal.addEventListener("click", e => {
  if (e.target === imageModal || e.target.classList.contains("image-modal-backdrop")) {
    imageModal.classList.add("hidden");
  }
});

// ============================================================
//  GALLERY VIEW
// ============================================================
$("btn-gallery-view").addEventListener("click", () => {
  renderGallery();
  showView("gallery");
});
$("gallery-back-btn").addEventListener("click", () => showView("home"));

function renderGallery() {
  const available = properties.filter(p => p.status === "available");
  galleryGrid.innerHTML = "";

  if (available.length === 0) {
    galleryGrid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);grid-column:1/-1">No available properties to show.</div>`;
    return;
  }

  const frag = document.createDocumentFragment();
  available.forEach(p => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.dataset.id = p.id;

    const hasImg = p.images && p.images.length > 0;
    card.innerHTML = `
      ${hasImg
        ? `<img class="gallery-card-img" src="${p.images[0]}" alt="${escHtml(p.name)}" loading="lazy" />`
        : `<div class="gallery-card-img">🏡</div>`
      }
      <div class="gallery-card-info">
        <div class="gallery-card-name">${escHtml(p.name)}</div>
        <div class="gallery-card-price">${formatPrice(p.price)}</div>
        <div class="gallery-card-area">${p.area ? p.area + " m²" : ""} ${p.location ? "· " + p.location : ""}</div>
      </div>
    `;
    card.addEventListener("click", () => {
      showView("home");
      setTimeout(() => openDetail(p.id), 50);
    });
    frag.appendChild(card);
  });
  galleryGrid.appendChild(frag);
}

// ============================================================
//  SEARCH / FILTER / SORT
// ============================================================
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  searchClear.classList.toggle("hidden", !searchQuery);
  renderTable();
});
searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  searchClear.classList.add("hidden");
  renderTable();
  searchInput.focus();
});
filterSel.addEventListener("change", () => {
  filterStatus = filterSel.value;
  renderTable();
});
sortSel.addEventListener("change", () => {
  sortMode = sortSel.value;
  renderTable();
});

// ============================================================
//  CURRENCY
// ============================================================
document.querySelectorAll(".currency-pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".currency-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currency = btn.dataset.currency;
    renderTable();
    // Re-render detail if open
    if (currentId) {
      const p = properties.find(p => p.id === currentId);
      if (p) renderDetail(p);
    }
  });
});

// ============================================================
//  EXPORT CSV
// ============================================================
$("btn-export-csv").addEventListener("click", () => {
  if (properties.length === 0) { showToast("Nothing to export"); return; }

  const sym = CURRENCY_SYMBOLS[currency] || "";
  const rows = [
    ["Name", "Location/Nearby", `Price (${currency})`, "Area (m²)", "Land Type", "Status", "Notes"]
  ];

  properties.forEach(p => {
    rows.push([
      p.name,
      p.location || "",
      p.price,
      p.area,
      p.landType,
      p.status,
      (p.description || "").replace(/\n/g, " ")
    ]);
  });

  const csv = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "my-properties.csv";
  a.click();
  URL.revokeObjectURL(url);
  showToast("📊 CSV exported");
});

// ============================================================
//  INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initLock();        // ← show PIN screen first
  initFirebase();
  showView("home");
});
