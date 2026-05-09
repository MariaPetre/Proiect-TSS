const {
  calculateTotals,
  filterTransactions,
  toMoney,
  validateBudget,
  validateTransaction,
} = require("../src/budget");

describe("Validare Buget", () => {
  // Boundary value analysis
  test("accepta valoarea de frontierea 0", () => {
    expect(validateBudget("0")).toEqual({ valid: true, amount: 0 });
  });
  test("accepta valoarea maxima permisa 1.000.000", () => {
    expect(validateBudget("1000000")).toEqual({ valid: true, amount: 1000000 });
  });
  test("respinge bugete mai mari de 1.000.000", () => {
    expect(validateBudget("1000000.01").valid).toBe(false);
  });
  // Equivalence Partitioning / Input Validation
  test("respinge buget gol", () => {
    expect(validateBudget("").valid).toBe(false);
  });
  test("respinge bugete negative", () => {
    expect(validateBudget("-1").valid).toBe(false);
  });
  // Functional Testing / Data formating
  test("bugetul cu 2 zecimale", () => {
    expect(validateBudget("123.45")).toEqual({ valid: true, amount: 123.45 });
  });
});

describe("Validare tranzactie", () => {
  const validateTransactionTest = {
    description: "Chirie",
    amount: "1500",
    type: "expense",
    category: "rent",
    date: "2026-05-03",
  };

  // Boundary value analysis
  test("Accepta descriere cu exact 3 caractere", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, description: "abc" })
        .valid,
    ).toBe(true);
  });
  test("Accepta descriere cu exact 60 de caractere", () => {
    const description = "a".repeat(60);
    expect(
      validateTransaction({ ...validateTransactionTest, description }).valid,
    ).toBe(true);
  });
  test("Respinge descrieri prea scurte", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, description: "ab" })
        .valid,
    ).toBe(false);
  });
  test("Respinge descrieri mai lungi de 60 de caractere", () => {
    const description = "a".repeat(61);
    expect(
      validateTransaction({ ...validateTransactionTest, description }).valid,
    ).toBe(false);
  });
  test("Accepta suma minima pozitiva 0.01", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "0.01" }).valid,
    ).toBe(true);
  });
  test("Respinge suma minima 0", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "0" }).valid,
    ).toBe(false);
  });
  test("Respinge sume mai mari de limita maxima 1.000.000", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "1000000.01" })
        .valid,
    ).toBe(false);
  });
  // Equivalence partitioning / Input Validation
  test("Respinge sume negative", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "-20" }).valid,
    ).toBe(false);
  });
  test("Respinge suma goala", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "" }).valid,
    ).toBe(false);
  });
  test("Respinge cateogrii invalide", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, category: "car" })
        .valid,
    ).toBe(false);
  });
  test("Respinge tipuri invalide", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, type: "gift" }).valid,
    ).toBe(false);
  });
  test("Respinge date invalide", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, date: "" }).valid,
    ).toBe(false);
  });
  test("Respinge date din viitor", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, date: "2077-05-03" })
        .valid,
    ).toBe(false);
  });
  // Functional Testing + Equibalence partitioning
  test("Accepta o tranzatie valida", () => {
    const result = validateTransaction(validateTransactionTest);

    expect(result.valid).toBe(true);
    expect(result.transaction.description).toBe("Chirie");
    expect(result.transaction.amount).toBe(1500);
    expect(result.transaction.type).toBe("expense");
  });
  // Functional Testing / Data normalization
  test("Elimina spatiile inutile din descriere", () => {
    const result = validateTransaction({
      ...validateTransactionTest,
      description: "    Chirie   ",
    });
    expect(result.transaction.description).toBe("Chirie");
  });
});

describe("Calcule", () => {
  test("Calculeaza veniturile, cheltuielile, sold si buget rams", () => {
    const transaction = [
      { amount: 3000, type: "income" },
      { amount: 500, type: "expense" },
      { amount: 250.25, type: "expense" },
    ];

    // Functional testing
    expect(calculateTotals(transaction, 1000)).toEqual({
      income: 3000,
      expenses: 750.25,
      balance: 2249.75,
      budgetLeft: 249.75,
    });
  });
  // Boundary value analysis / Equivalence Partitioning
  test("Returneaza 0 pentru lista goala", () => {
    expect(calculateTotals([], 500)).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
      budgetLeft: 500,
    });
  });
});

describe("Filtrare tranzactii", () => {
  const transactions = [
    { description: "Salariu lunar", type: "income", category: "salary" },
    { description: "Cafea", type: "expense", category: "food" },
    { description: "Metrou", type: "expense", category: "transport" },
  ];

  // Functional testing
  test("Filtreaza dupa text", () => {
    expect(filterTransactions(transactions, { search: "cafea" })).toHaveLength(
      1,
    );
  });
  test("Filtre combinate", () => {
    expect(
      filterTransactions(transactions, {
        search: "met",
        type: "expense",
        category: "transport",
      }),
    ).toHaveLength(1);
  });
  // Functional testing / Equivalence partitioning
  test("Filtreaza text cu majuscule", () => {
    expect(
      filterTransactions(transactions, { search: "SALARIU" }),
    ).toHaveLength(1);
  });
  test("Filtreaza dupa tip", () => {
    expect(filterTransactions(transactions, { type: "expense" })).toHaveLength(
      2,
    );
  });
  test("Filtreaza dupa categorie", () => {
    expect(
      filterTransactions(transactions, { category: "salary" }),
    ).toHaveLength(1);
  });
});

describe("toMoney", () => {
  test("Formeaza suma cu doua zecimale", () => {
    expect(toMoney(12)).toBe("12.00 RON");
  });
});
