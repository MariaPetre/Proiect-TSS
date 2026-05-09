(function () {
  const budgetService = window.BudgetTracker;
  const storageService = window.BudgetStorage;
  const state = storageService.loadState();

  const elements = {
    budgetForm: document.querySelector("#budget-form"),
    monthlyBudget: document.querySelector("#monthly-budget"),
    budgetError: document.querySelector("#budget-error"),
    transactionForm: document.querySelector("#transaction-form"),
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    type: document.querySelector("#type"),
    category: document.querySelector("#category"),
    date: document.querySelector("#date"),
    transactionError: document.querySelector("#transaction-error"),
    incomeTotal: document.querySelector("#income-total"),
    expenseTotal: document.querySelector("#expense-total"),
    balanceTotal: document.querySelector("#balance-total"),
    budgetLeft: document.querySelector("#budget-left"),
    transactionList: document.querySelector("#transaction-list"),
    emptyState: document.querySelector("#empty-state"),
    search: document.querySelector("#search"),
    filterType: document.querySelector("#filter-type"),
    filterCategory: document.querySelector("#filter-category"),
    clearAll: document.querySelector("#clear-all"),
  };

  elements.date.valueAsDate = new Date();
  elements.monthlyBudget.value = state.budget || "";

  function persistAndRender() {
    storageService.saveState(state);
    render();
  }

  function render() {
    const totals = budgetService.calculateTotals(
      state.transactions,
      state.budget,
    );

    elements.incomeTotal.textContent = budgetService.toMoney(totals.income);
    elements.expenseTotal.textContent = budgetService.toMoney(totals.expenses);
    elements.balanceTotal.textContent = budgetService.toMoney(totals.balance);
    elements.budgetLeft.textContent = budgetService.toMoney(totals.budgetLeft);

    const visibleTransactions = budgetService.filterTransactions(
      state.transactions,
      {
        search: elements.search.value,
        type: elements.filterType.value,
        category: elements.filterCategory.value,
      },
    );

    elements.transactionList.innerHTML = "";
    elements.emptyState.hidden = visibleTransactions.length > 0;

    visibleTransactions.forEach((transaction) => {
      const item = document.createElement("li");
      item.className = "transaction";
      item.innerHTML = `
        <div>
          <strong>${transaction.description}</strong><br />
          <small>${transaction.category} · ${transaction.date}</small>
        </div>
        <strong class="amount ${transaction.type}">${transaction.type === "income" ? "+" : "-"}${budgetService.toMoney(transaction.amount)}</strong>
        <button class="delete-btn" data-id="${transaction.id}" aria-label="Sterge">Sterge tranzactia</button>
      `;
      elements.transactionList.appendChild(item);
    });
  }

  elements.budgetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const result = budgetService.validateBudget(elements.monthlyBudget.value);
    if (!result.valid) {
      elements.budgetError.textContent = result.message;
      return;
    }

    elements.budgetError.textContent = "";
    state.budget = result.amount;
    persistAndRender();
  });

  elements.transactionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const result = budgetService.validateTransaction({
      description: elements.description.value,
      amount: elements.amount.value,
      type: elements.type.value,
      category: elements.category.value,
      date: elements.date.value,
    });

    if (!result.valid) {
      elements.transactionError.textContent = result.message;
      return;
    }

    elements.transactionError.textContent = "";
    state.transactions.push(result.transaction);
    elements.transactionForm.reset();
    elements.date.valueAsDate = new Date();
    persistAndRender();
  });

  elements.transactionList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) {
      return;
    }

    const index = state.transactions.findIndex((transaction) => {
      return transaction.id === button.dataset.id;
    });

    if (index >= 0) {
      state.transactions.splice(index, 1);
      persistAndRender();
    }
  });

  [elements.search, elements.filterType, elements.filterCategory].forEach(
    (element) => {
      element.addEventListener("input", render);
    },
  );

  elements.clearAll.addEventListener("click", () => {
    if (!confirm("Vrei sa stergi datele?")) {
      return;
    }

    state.budget = 0;
    state.transactions = [];
    elements.monthlyBudget.value = "";
    storageService.clearState();
    render();
  });

  render();
})();
