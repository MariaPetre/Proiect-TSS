(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BudgetTracker = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const CATEGORIES = ['salary', 'food', 'rent', 'transport', 'health', 'other'];
  const TYPES = ['income', 'expense'];
  const MAX_AMOUNT = 1000000;

  function createId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return String(Date.now());
  }

  function toMoney(value) {
    return `${Number(value).toFixed(2)} RON`;
  }

  function validateBudget(value) {
    const amount = Number(value);

    if (value === '' || Number.isNaN(amount)) {
      return { valid: false, message: 'Bugetul este obligatoriu.' };
    }

    if (amount < 0) {
      return { valid: false, message: 'Bugetul nu poate fi negativ.' };
    }

    if (amount > MAX_AMOUNT) {
      return { valid: false, message: 'Bugetul este prea mare.' };
    }

    return { valid: true, amount: Number(amount.toFixed(2)) };
  }

  function validateTransaction(input) {
    const numericAmount = Number(input.amount);
    const trimmedDescription = String(input.description || '').trim();
    const selectedDate = new Date(input.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (trimmedDescription.length < 3) {
      return { valid: false, message: 'Descrierea trebuie să aibă minimum 3 caractere.' };
    }

    if (trimmedDescription.length > 60) {
      return { valid: false, message: 'Descrierea trebuie să aibă maximum 60 de caractere.' };
    }

    if (input.amount === '' || Number.isNaN(numericAmount)) {
      return { valid: false, message: 'Suma este obligatorie.' };
    }

    if (numericAmount <= 0) {
      return { valid: false, message: 'Suma trebuie să fie mai mare decât 0.' };
    }

    if (numericAmount > MAX_AMOUNT) {
      return { valid: false, message: 'Suma este prea mare.' };
    }

    if (!TYPES.includes(input.type)) {
      return { valid: false, message: 'Tipul tranzacției este invalid.' };
    }

    if (!CATEGORIES.includes(input.category)) {
      return { valid: false, message: 'Categoria este invalidă.' };
    }

    if (!input.date || Number.isNaN(selectedDate.getTime())) {
      return { valid: false, message: 'Data este obligatorie.' };
    }

    if (selectedDate > today) {
      return { valid: false, message: 'Data nu poate fi în viitor.' };
    }

    return {
      valid: true,
      transaction: {
        id: createId(),
        description: trimmedDescription,
        amount: Number(numericAmount.toFixed(2)),
        type: input.type,
        category: input.category,
        date: input.date,
      },
    };
  }

  function calculateTotals(transactions, budget = 0) {
    const income = transactions
      .filter(function (transaction) {
        return transaction.type === 'income';
      })
      .reduce(function (sum, transaction) {
        return sum + transaction.amount;
      }, 0);

    const expenses = transactions
      .filter(function (transaction) {
        return transaction.type === 'expense';
      })
      .reduce(function (sum, transaction) {
        return sum + transaction.amount;
      }, 0);

    return {
      income: Number(income.toFixed(2)),
      expenses: Number(expenses.toFixed(2)),
      balance: Number((income - expenses).toFixed(2)),
      budgetLeft: Number((budget - expenses).toFixed(2)),
    };
  }

  function filterTransactions(transactions, filters) {
    const search = filters && filters.search ? filters.search : '';
    const type = filters && filters.type ? filters.type : 'all';
    const category = filters && filters.category ? filters.category : 'all';
    const query = search.trim().toLowerCase();

    return transactions.filter(function (transaction) {
      const matchesSearch = !query || transaction.description.toLowerCase().includes(query);
      const matchesType = type === 'all' || transaction.type === type;
      const matchesCategory = category === 'all' || transaction.category === category;

      return matchesSearch && matchesType && matchesCategory;
    });
  }

  return {
    CATEGORIES,
    TYPES,
    MAX_AMOUNT,
    toMoney,
    validateBudget,
    validateTransaction,
    calculateTotals,
    filterTransactions,
  };
});
