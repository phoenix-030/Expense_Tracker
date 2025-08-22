const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const editForm = document.getElementById("edit-form");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Chart.js setup
const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Food", "Travel", "Shopping", "Other"],
    datasets: [{
      label: "Expenses",
      data: [0, 0, 0, 0],
      backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#8bc34a"]
    }]
  }
});

// Render expenses on load
window.onload = () => renderExpenses();

// Add Expense
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  const expense = {
    id: Date.now(),
    desc,
    amount,
    category
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  renderExpenses();
  expenseForm.reset();
});

// Render Expenses
function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach((exp) => {
    total += exp.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${exp.desc} - <span>₹${exp.amount}</span> [${exp.category}]
      <div>
        <button class="edit-btn" onclick="editExpense(${exp.id})">✏️</button>
        <button class="delete-btn" onclick="deleteExpense(${exp.id})">❌</button>
      </div>
    `;
    expenseList.appendChild(li);
  });

  totalEl.textContent = total;
  updateChart();
}

// Delete Expense
function deleteExpense(id) {
  expenses = expenses.filter((exp) => exp.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

// Edit Expense (fill form)
function editExpense(id) {
  const exp = expenses.find((e) => e.id === id);
  document.getElementById("edit-id").value = exp.id;
  document.getElementById("edit-desc").value = exp.desc;
  document.getElementById("edit-amount").value = exp.amount;
  document.getElementById("edit-category").value = exp.category;

  editForm.style.display = "block";
}

// Update Expense
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById("edit-id").value);
  const desc = document.getElementById("edit-desc").value;
  const amount = parseFloat(document.getElementById("edit-amount").value);
  const category = document.getElementById("edit-category").value;

  expenses = expenses.map((exp) =>
    exp.id === id ? { ...exp, desc, amount, category } : exp
  );

  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  editForm.reset();
  editForm.style.display = "none";
});

// Update Chart
function updateChart() {
  let food = 0, travel = 0, shopping = 0, other = 0;

  expenses.forEach((exp) => {
    if (exp.category === "Food") food += exp.amount;
    else if (exp.category === "Travel") travel += exp.amount;
    else if (exp.category === "Shopping") shopping += exp.amount;
    else other += exp.amount;
  });

  expenseChart.data.datasets[0].data = [food, travel, shopping, other];
  expenseChart.update();
}
