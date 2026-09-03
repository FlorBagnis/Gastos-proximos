/* ==========================================
   GASTOS PRÓXIMOS
   JAVASCRIPT
========================================== */

const STORAGE_KEY = "gastos_proximos_v1";

let expenses = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
) || [];

let currentFilter = "all";


// ==========================================
// ELEMENTOS
// ==========================================

const modal = document.getElementById("modal");

const openModalBtn =
  document.getElementById("openModalBtn");

const emptyAddBtn =
  document.getElementById("emptyAddBtn");

const closeModalBtn =
  document.getElementById("closeModalBtn");

const expenseForm =
  document.getElementById("expenseForm");

const expensesList =
  document.getElementById("expensesList");

const emptyState =
  document.getElementById("emptyState");

const totalPending =
  document.getElementById("totalPending");

const nextSevenDays =
  document.getElementById("nextSevenDays");

const thisMonth =
  document.getElementById("thisMonth");

const totalDebts =
  document.getElementById("totalDebts");

const itemsCount =
  document.getElementById("itemsCount");


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setDefaultDate();

    render();

  }
);


// ==========================================
// MODAL
// ==========================================

function openModal() {

  modal.classList.add("show");

}

function closeModal() {

  modal.classList.remove("show");

  expenseForm.reset();

  document.getElementById("expenseId").value = "";

  document.getElementById("modalTitle").textContent =
    "Agregar registro";

  setDefaultDate();

}


// ==========================================
// EVENTOS MODAL
// ==========================================

openModalBtn.addEventListener(
  "click",
  openModal
);

emptyAddBtn.addEventListener(
  "click",
  openModal
);

closeModalBtn.addEventListener(
  "click",
  closeModal
);


modal.addEventListener(
  "click",
  (event) => {

    if (event.target === modal) {
      closeModal();
    }

  }
);


// ==========================================
// FECHA POR DEFECTO
// ==========================================

function setDefaultDate() {

  const dateInput =
    document.getElementById("date");

  if (!dateInput.value) {

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(today.getMonth() + 1)
        .padStart(2, "0");

    const day =
      String(today.getDate())
        .padStart(2, "0");

    dateInput.value =
      `${year}-${month}-${day}`;

  }

}


// ==========================================
// GUARDAR
// ==========================================

expenseForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const id =
      document.getElementById("expenseId").value;


    const type =
      document.querySelector(
        'input[name="type"]:checked'
      ).value;


    const description =
      document.getElementById("description")
        .value
        .trim();


    const category =
      document.getElementById("category")
        .value;


    const amountValue =
      document.getElementById("amount")
        .value;


    const quantity =
      Number(
        document.getElementById("quantity")
          .value
      ) || 1;


    const date =
      document.getElementById("date")
        .value;


    const notes =
      document.getElementById("notes")
        .value
        .trim();


    const amount =
      amountValue === ""
        ? null
        : Number(amountValue);


    const expense = {

      id:
        id ||
        Date.now().toString(),

      type,

      description,

      category,

      amount,

      quantity,

      date,

      notes,

      paid: false,

      createdAt:
        new Date().toISOString()

    };


    if (id) {

      const index =
        expenses.findIndex(
          item => item.id === id
        );

      if (index !== -1) {

        expense.paid =
          expenses[index].paid;

        expense.createdAt =
          expenses[index].createdAt;

        expenses[index] =
          expense;

      }

    } else {

      expenses.push(expense);

    }


    saveData();

    closeModal();

    render();

  }
);


// ==========================================
// GUARDAR LOCALSTORAGE
// ==========================================

function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(expenses)
  );

}


// ==========================================
// FORMATEAR DINERO
// ==========================================

function formatMoney(value) {

  if (
    value === null ||
    value === undefined ||
    isNaN(value)
  ) {

    return null;

  }


  return new Intl.NumberFormat(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }
  ).format(value);

}


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatDate(dateString) {

  if (!dateString) return "";

  const date =
    new Date(
      `${dateString}T12:00:00`
    );

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "2-digit",
      month: "short"
    }
  ).format(date);

}


// ==========================================
// ICONOS CATEGORIA
// ==========================================

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


// ==========================================
// NOMBRE CATEGORIA
// ==========================================

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
// RENDER
// ==========================================

function render() {

  updateSummary();

  renderExpenses();

}


// ==========================================
// FILTRAR
// ==========================================

function getFilteredExpenses() {

  let filtered = [...expenses];


  if (currentFilter === "pending") {

    filtered =
      filtered.filter(
        expense => !expense.paid
      );

  }


  if (currentFilter === "paid") {

    filtered =
      filtered.filter(
        expense => expense.paid
      );

  }


  if (currentFilter === "debt") {

    filtered =
      filtered.filter(
        expense => expense.type === "debt"
      );

  }


  filtered.sort(
    (a, b) => {

      return new Date(a.date) -
        new Date(b.date);

    }
  );


  return filtered;

}


// ==========================================
// RENDER LISTA
// ==========================================

function renderExpenses() {

  const filtered =
    getFilteredExpenses();


  expensesList.innerHTML = "";


  if (filtered.length === 0) {

    emptyState.style.display = "block";

    return;

  }


  emptyState.style.display = "none";


  filtered.forEach(
    expense => {

      const element =
        createExpenseElement(expense);

      expensesList.appendChild(element);

    }
  );


  updateCounter(filtered.length);

}


// ==========================================
// CREAR ITEM
// ==========================================

function createExpenseElement(expense) {

  const article =
    document.createElement("article");

  article.className =
    "expense";


  const icon =
    getCategoryIcon(
      expense.category
    );


  const category =
    getCategoryName(
      expense.category
    );


  let amountHTML;


  if (expense.amount === null) {

    amountHTML = `
      <span class="no-amount">
        Monto pendiente
      </span>
    `;

  } else {

    amountHTML = `
      <strong>
        ${formatMoney(expense.amount)}
      </strong>
    `;

  }


  const statusClass =
    expense.paid
      ? "paid"
      : expense.type === "debt"
        ? "debt"
        : "pending";


  const statusText =
    expense.paid
      ? "Pagado"
      : expense.type === "debt"
        ? "Deuda"
        : "Pendiente";


  article.innerHTML = `

    <div class="expense-icon">
      ${icon}
    </div>


    <div class="expense-info">

      <h3>
        ${escapeHTML(expense.description)}
      </h3>

      <p>
        ${category}
        · Cantidad: ${expense.quantity}
      </p>

      ${
        expense.notes
          ? `<p>${escapeHTML(expense.notes)}</p>`
          : ""
      }

      <span class="badge ${statusClass}">
        ${statusText}
      </span>

    </div>


    <div class="expense-date">

      Pagar

      <strong>
        ${formatDate(expense.date)}
      </strong>

    </div>


    <div class="expense-amount">

      ${amountHTML}


      <div class="actions">

        ${
          !expense.paid
            ? `
              <button
                class="action-button pay"
                title="Marcar como pagado"
                onclick="markAsPaid('${expense.id}')"
              >
                ✓
              </button>
            `
            : ""
        }


        <button
          class="action-button"
          title="Editar"
          onclick="editExpense('${expense.id}')"
        >
          ✏️
        </button>


        <button
          class="action-button delete"
          title="Eliminar"
          onclick="deleteExpense('${expense.id}')"
        >
          🗑️
        </button>

      </div>

    </div>

  `;


  return article;

}


// ==========================================
// EDITAR
// ==========================================

function editExpense(id) {

  const expense =
    expenses.find(
      item => item.id === id
    );


  if (!expense) return;


  document.getElementById("expenseId")
    .value = expense.id;


  document.getElementById("description")
    .value = expense.description;


  document.getElementById("category")
    .value = expense.category;


  document.getElementById("amount")
    .value =
      expense.amount === null
        ? ""
        : expense.amount;


  document.getElementById("quantity")
    .value = expense.quantity;


  document.getElementById("date")
    .value = expense.date;


  document.getElementById("notes")
    .value = expense.notes || "";


  const radio =
    document.querySelector(
      `input[name="type"][value="${expense.type}"]`
    );


  if (radio) {
    radio.checked = true;
  }


  document.getElementById("modalTitle")
    .textContent =
      "Editar registro";


  openModal();

}


// ==========================================
// MARCAR PAGADO
// ==========================================

function markAsPaid(id) {

  const expense =
    expenses.find(
      item => item.id === id
    );


  if (!expense) return;


  expense.paid = true;


  saveData();

  render();

}


// ==========================================
// ELIMINAR
// ==========================================

function deleteExpense(id) {

  const expense =
    expenses.find(
      item => item.id === id
    );


  if (!expense) return;


  const confirmed =
    confirm(
      `¿Querés eliminar "${expense.description}"?`
    );


  if (!confirmed) return;


  expenses =
    expenses.filter(
      item => item.id !== id
    );


  saveData();

  render();

}


// ==========================================
// RESUMEN
// ==========================================

function updateSummary() {

  const pending =
    expenses.filter(
      expense => !expense.paid
    );


  const total =
    pending.reduce(
      (sum, expense) => {

        return sum +
          (expense.amount || 0);

      },
      0
    );


  totalPending.textContent =
    formatMoney(total);


  // ----------------------------------------
  // PRÓXIMOS 7 DÍAS
  // ----------------------------------------

  const today =
    new Date();

  today.setHours(
    0, 0, 0, 0
  );


  const sevenDays =
    new Date(today);

  sevenDays.setDate(
    sevenDays.getDate() + 7
  );


  const nextTotal =
    pending
      .filter(expense => {

        const date =
          new Date(
            `${expense.date}T00:00:00`
          );

        return (
          date >= today &&
          date <= sevenDays
        );

      })
      .reduce(
        (sum, expense) =>
          sum + (expense.amount || 0),
        0
      );


  nextSevenDays.textContent =
    formatMoney(nextTotal);


  // ----------------------------------------
  // ESTE MES
  // ----------------------------------------

  const currentMonth =
    today.getMonth();

  const currentYear =
    today.getFullYear();


  const monthTotal =
    pending
      .filter(expense => {

        const date =
          new Date(
            `${expense.date}T00:00:00`
          );

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );

      })
      .reduce(
        (sum, expense) =>
          sum + (expense.amount || 0),
        0
      );


  thisMonth.textContent =
    formatMoney(monthTotal);


  // ----------------------------------------
  // DEUDAS
  // ----------------------------------------

  const debts =
    pending
      .filter(
        expense =>
          expense.type === "debt"
      )
      .reduce(
        (sum, expense) =>
          sum + (expense.amount || 0),
        0
      );


  totalDebts.textContent =
    formatMoney(debts);

}


// ==========================================
// CONTADOR
// ==========================================

function updateCounter(count) {

  itemsCount.textContent =
    `${count} ${
      count === 1
        ? "registro"
        : "registros"
    }`;

}


// ==========================================
// FILTROS
// ==========================================

document
  .querySelectorAll(".filter")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter")
          .forEach(
            btn =>
              btn.classList.remove("active")
          );


        button.classList.add("active");


        currentFilter =
          button.dataset.filter;


        renderExpenses();

      }
    );

  });


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ==========================================
// DISPONIBLE GLOBALMENTE
// ==========================================

window.editExpense =
  editExpense;

window.deleteExpense =
  deleteExpense;

window.markAsPaid =
  markAsPaid;
