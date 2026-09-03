/* ==========================================
   GASTOS PRÓXIMOS
   FIREBASE AUTHENTICATION + FIRESTORE (NUBE)
========================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// Credenciales Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGGfMzmGfRH614IT5wwG2kZOtUDBd16ok",
  authDomain: "mensuales-8de3d.firebaseapp.com",
  projectId: "mensuales-8de3d",
  storageBucket: "mensuales-8de3d.firebasestorage.app",
  messagingSenderId: "248967622199",
  appId: "1:248967622199:web:86e53f1b115e974bb8d9b2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let expenses = [];
let currentFilter = "all";
let authMode = "login";
let unsubscribeExpenses = null;

const $ = id => document.getElementById(id);


// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

const modal = $("modal");
const openModalBtn = $("openModalBtn");
const emptyAddBtn = $("emptyAddBtn");
const closeModalBtn = $("closeModalBtn");
const expenseForm = $("expenseForm");
const expensesList = $("expensesList");
const emptyState = $("emptyState");

const totalPending = $("totalPending");
const nextSevenDays = $("nextSevenDays");
const thisMonth = $("thisMonth");
const totalDebts = $("totalDebts");
const itemsCount = $("itemsCount");


// ==========================================
// FIRESTORE (SINCRONIZACIÓN EN LA NUBE)
// ==========================================

function getExpensesCollectionRef() {
  if (!currentUser) return null;
  return collection(db, "users", currentUser.uid, "proximos");
}

function startFirestoreSync() {
  stopFirestoreSync();
  const colRef = getExpensesCollectionRef();
  if (!colRef) return;

  unsubscribeExpenses = onSnapshot(colRef, snapshot => {
    expenses = [];
    snapshot.forEach(docSnap => {
      expenses.push({ id: docSnap.id, ...docSnap.data() });
    });
    render();
  }, error => {
    console.error("Error en Firestore:", error);
  });
}

function stopFirestoreSync() {
  if (typeof unsubscribeExpenses === "function") {
    unsubscribeExpenses();
    unsubscribeExpenses = null;
  }
}

async function saveExpenseToFirestore(item) {
  if (!currentUser) return;
  const docRef = doc(db, "users", currentUser.uid, "proximos", item.id);
  await setDoc(docRef, {
    type: item.type,
    description: item.description,
    category: item.category,
    amount: item.amount,
    quantity: item.quantity,
    date: item.date,
    notes: item.notes,
    paid: item.paid,
    createdAt: item.createdAt
  });
}

async function deleteExpenseFromFirestore(id) {
  if (!currentUser) return;
  const docRef = doc(db, "users", currentUser.uid, "proximos", id);
  await deleteDoc(docRef);
}


// ==========================================
// AUTENTICACIÓN FIREBASE
// ==========================================

function setAuthMessage(message, success = false) {
  $("authMessage").textContent = message;
  $("authMessage").classList.toggle("success", success);
}

function updateAuthInterface() {
  const isLogin = authMode === "login";

  $("authSubmitBtn").disabled = false;
  $("authSubmitBtn").textContent = isLogin ? "Iniciar sesión" : "Crear cuenta";
  $("authSwitchBtn").textContent = isLogin
    ? "¿No tenés una cuenta? Registrate"
    : "¿Ya tenés una cuenta? Iniciá sesión";
  $("authPassword").autocomplete = isLogin ? "current-password" : "new-password";

  setAuthMessage("");
}

function firebaseErrorMessage(error) {
  const code = error?.code || "";
  const messages = {
    "auth/invalid-email": "El email no es válido.",
    "auth/missing-password": "Ingresá una contraseña.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
    "auth/invalid-credential": "El email o la contraseña son incorrectos.",
    "auth/user-not-found": "No existe una cuenta con ese email.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/too-many-requests": "Demasiados intentos. Esperá un momento.",
    "auth/network-request-failed": "No hay conexión con Firebase."
  };

  return messages[code] || `Error (${code || "desconocido"}). Volvé a intentar.`;
}

$("authSwitchBtn").addEventListener("click", () => {
  authMode = authMode === "login" ? "register" : "login";
  updateAuthInterface();
});

$("authForm").addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;

  if (!email || !password) {
    setAuthMessage("Completá email y contraseña.");
    return;
  }

  const btn = $("authSubmitBtn");
  btn.disabled = true;
  btn.textContent = authMode === "login" ? "Ingresando..." : "Creando cuenta...";

  try {
    if (authMode === "register") {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    setAuthMessage(firebaseErrorMessage(error));
    btn.disabled = false;
    updateAuthInterface();
  }
});

$("logoutBtn").addEventListener("click", async () => {
  const confirmed = confirm("¿Querés cerrar sesión?");
  if (!confirmed) return;

  try {
    stopFirestoreSync();
    await signOut(auth);
  } catch (error) {
    console.error("Error al salir:", error);
    alert("No se pudo cerrar la sesión.");
  }
});

onAuthStateChanged(auth, user => {
  currentUser = user;

  if (!user) {
    stopFirestoreSync();
    expenses = [];
    $("authSection").classList.remove("hidden");
    $("appContent").classList.add("hidden");
    $("userEmail").textContent = "";
    $("authForm").reset();
    updateAuthInterface();
    return;
  }

  $("authSection").classList.add("hidden");
  $("appContent").classList.remove("hidden");
  $("userEmail").textContent = user.email || "";

  setDefaultDate();
  setupAmountsToggle();
  startFirestoreSync();
});


// ==========================================
// OCULTAR / MOSTRAR MONTOS
// ==========================================

function setupAmountsToggle() {
  const toggleAmountsBtn = $("toggleAmountsBtn");
  if (!toggleAmountsBtn) return;

  const isHidden = localStorage.getItem("gastos_proximos_hide_amounts") === "true";

  if (isHidden) {
    document.body.classList.add("amounts-hidden");
    toggleAmountsBtn.textContent = "👁️ Mostrar montos";
  } else {
    document.body.classList.remove("amounts-hidden");
    toggleAmountsBtn.textContent = "👁️ Ocultar montos";
  }

  toggleAmountsBtn.onclick = () => {
    const hidden = document.body.classList.toggle("amounts-hidden");
    localStorage.setItem("gastos_proximos_hide_amounts", hidden);
    toggleAmountsBtn.textContent = hidden ? "👁️ Mostrar montos" : "👁️ Ocultar montos";
  };
}


// ==========================================
// MODAL
// ==========================================

function openModal() {
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  expenseForm.reset();
  $("expenseId").value = "";
  $("modalTitle").textContent = "Agregar registro";
  setDefaultDate();
}

openModalBtn.addEventListener("click", openModal);
emptyAddBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});


// ==========================================
// FECHA POR DEFECTO
// ==========================================

function setDefaultDate() {
  const dateInput = $("date");
  if (!dateInput.value) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${year}-${month}-${day}`;
  }
}


// ==========================================
// GUARDAR / EDITAR REGISTRO
// ==========================================

expenseForm.addEventListener("submit", async event => {
  event.preventDefault();

  const id = $("expenseId").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const description = $("description").value.trim();
  const category = $("category").value;
  const amountValue = $("amount").value;
  const quantity = Number($("quantity").value) || 1;
  const date = $("date").value;
  const notes = $("notes").value.trim();
  const amount = amountValue === "" ? null : Number(amountValue);

  const currentExpense = id ? expenses.find(e => e.id === id) : null;

  const item = {
    id: id || `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    description,
    category,
    amount,
    quantity,
    date,
    notes,
    paid: currentExpense ? currentExpense.paid : false,
    createdAt: currentExpense ? currentExpense.createdAt : new Date().toISOString()
  };

  try {
    await saveExpenseToFirestore(item);
    closeModal();
  } catch (error) {
    console.error("Error al guardar en Firestore:", error);
    alert("No se pudo guardar el registro en la nube.");
  }
});


// ==========================================
// FORMATEADORES
// ==========================================

function formatMoney(value) {
  if (value === null || value === undefined || isNaN(value)) return null;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short"
  }).format(date);
}

function getCategoryIcon(category) {
  const icons = {
    hogar: "🏠",
    servicios: "💡",
    comida: "🍔",
    mascotas: "🐾",
    deudas: "💸",
    salud: "💊",
    transporte: "🚗",
    otros: "📦"
  };
  return icons[category] || "📦";
}

function getCategoryName(category) {
  const names = {
    hogar: "Hogar",
    servicios: "Servicios",
    comida: "Comida",
    mascotas: "Mascotas",
    deudas: "Deudas",
    salud: "Salud",
    transporte: "Transporte",
    otros: "Otros"
  };
  return names[category] || "Otros";
}


// ==========================================
// RENDER Y FILTROS
// ==========================================

function render() {
  updateSummary();
  renderExpenses();
}

function getFilteredExpenses() {
  let filtered = [...expenses];

  if (currentFilter === "pending") {
    filtered = filtered.filter(e => !e.paid);
  } else if (currentFilter === "paid") {
    filtered = filtered.filter(e => e.paid);
  } else if (currentFilter === "debt") {
    filtered = filtered.filter(e => e.type === "debt");
  }

  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  return filtered;
}

function renderExpenses() {
  const filtered = getFilteredExpenses();
  expensesList.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    updateCounter(0);
    return;
  }

  emptyState.style.display = "none";
  filtered.forEach(expense => {
    expensesList.appendChild(createExpenseElement(expense));
  });

  updateCounter(filtered.length);
}

function createExpenseElement(expense) {
  const article = document.createElement("article");
  article.className = "expense";

  const icon = getCategoryIcon(expense.category);
  const category = getCategoryName(expense.category);

  const amountHTML = expense.amount === null
    ? `<span class="no-amount">Monto pendiente</span>`
    : `<strong>${formatMoney(expense.amount)}</strong>`;

  const statusClass = expense.paid ? "paid" : expense.type === "debt" ? "debt" : "pending";
  const statusText = expense.paid ? "Pagado" : expense.type === "debt" ? "Deuda" : "Pendiente";

  article.innerHTML = `
    <div class="expense-icon">${icon}</div>

    <div class="expense-info">
      <h3>${escapeHTML(expense.description)}</h3>
      <p>${category} · Cantidad: ${expense.quantity}</p>
      ${expense.notes ? `<p>${escapeHTML(expense.notes)}</p>` : ""}
      <span class="badge ${statusClass}">${statusText}</span>
    </div>

    <div class="expense-date">
      Pagar
      <strong>${formatDate(expense.date)}</strong>
    </div>

    <div class="expense-amount">
      ${amountHTML}
      <div class="actions">
        ${
          !expense.paid
            ? `<button class="action-button pay" title="Marcar como pagado" data-action="pay" data-id="${expense.id}">✓</button>`
            : ""
        }
        <button class="action-button" title="Editar" data-action="edit" data-id="${expense.id}">✏️</button>
        <button class="action-button delete" title="Eliminar" data-action="delete" data-id="${expense.id}">🗑️</button>
      </div>
    </div>
  `;

  article.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "pay") markAsPaid(id);
      if (action === "edit") editExpense(id);
      if (action === "delete") deleteExpense(id);
    });
  });

  return article;
}


// ==========================================
// ACCIONES
// ==========================================

function editExpense(id) {
  const expense = expenses.find(item => item.id === id);
  if (!expense) return;

  $("expenseId").value = expense.id;
  $("description").value = expense.description;
  $("category").value = expense.category;
  $("amount").value = expense.amount === null ? "" : expense.amount;
  $("quantity").value = expense.quantity;
  $("date").value = expense.date;
  $("notes").value = expense.notes || "";

  const radio = document.querySelector(`input[name="type"][value="${expense.type}"]`);
  if (radio) radio.checked = true;

  $("modalTitle").textContent = "Editar registro";
  openModal();
}

async function markAsPaid(id) {
  const expense = expenses.find(item => item.id === id);
  if (!expense) return;

  expense.paid = true;
  await saveExpenseToFirestore(expense);
}

async function deleteExpense(id) {
  const expense = expenses.find(item => item.id === id);
  if (!expense) return;

  const confirmed = confirm(`¿Querés eliminar "${expense.description}"?`);
  if (!confirmed) return;

  await deleteExpenseFromFirestore(id);
}


// ==========================================
// RESUMEN
// ==========================================

function updateSummary() {
  const pending = expenses.filter(expense => !expense.paid);
  const total = pending.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  totalPending.textContent = formatMoney(total);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDays = new Date(today);
  sevenDays.setDate(sevenDays.getDate() + 7);

  const nextTotal = pending
    .filter(expense => {
      const date = new Date(`${expense.date}T00:00:00`);
      return date >= today && date <= sevenDays;
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);

  nextSevenDays.textContent = formatMoney(nextTotal);

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthTotal = pending
    .filter(expense => {
      const date = new Date(`${expense.date}T00:00:00`);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);

  thisMonth.textContent = formatMoney(monthTotal);

  const debts = pending
    .filter(expense => expense.type === "debt")
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);

  totalDebts.textContent = formatMoney(debts);
}

function updateCounter(count) {
  itemsCount.textContent = `${count} ${count === 1 ? "registro" : "registros"}`;
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderExpenses();
  });
});

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
