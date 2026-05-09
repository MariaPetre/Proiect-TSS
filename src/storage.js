(function (root) {
  const STORAGE_KEY = 'expense-budget-tracker-state';

  function getDefaultState() {
    return { budget: 0, transactions: [] };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : getDefaultState();
    } catch (error) {
      return getDefaultState();
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  root.BudgetStorage = {
    loadState,
    saveState,
    clearState,
  };
})(window);
