const {
  calculateTotals,
  filterTransactions,
  toMoney,
  validateBudget,
  validateTransaction,
} = require("../src/budget");

describe("Validare Buget", () => {
  // Boundary value analysis
  test("Accepta valoarea de frontierea 0", () => {
    expect(validateBudget("0")).toEqual({ valid: true, amount: 0 });
  });
  test("Accepta valoarea maxima permisa 1.000.000", () => {
    expect(validateBudget("1000000")).toEqual({ valid: true, amount: 1000000 });
  });
  test("Respinge bugete mai mari de 1.000.000", () => {
    expect(validateBudget("1000000.01").valid).toBe(false);
  });
  // Equivalence Partitioning / Input Validation
  test("Respinge buget gol", () => {
    expect(validateBudget("").valid).toBe(false);
  });
  test("Respinge bugete negative", () => {
    expect(validateBudget("-1").valid).toBe(false);
  });
  // Functional Testing / Data formating
  test("bugetul cu 2 zecimale", () => {
    expect(validateBudget("123.45")).toEqual({ valid: true, amount: 123.45 });
  });
  test("Mesaj pentru buget gol", () => {
    expect(validateBudget("")).toEqual({ valid: false, message: "Bugetul este obligatoriu."});
  });
  test("Mesaj pentru buget negativ", () => {
    expect(validateBudget("-1")).toEqual({ valid: false, message: "Bugetul nu poate fi negativ."});
  });
  test("Mesaj pentru buget prea mare", () => {
    expect(validateBudget("1000000.01")).toEqual({ valid: false, message: "Bugetul este prea mare." });
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
      validateTransaction({ ...validateTransactionTest, amount: "0" }).valid
    ).toBe(false);
  });
  test("Respinge sume mai mari de limita maxima 1.000.000", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "1000000.01" })
        .valid,
    ).toBe(false);
  });
  test("Suma egala cu maximul 1.000.000", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "1000000" })
        .valid
    ).toBe(true);
  });
  // Equivalence partitioning / Input Validation
  test("Accepta categoria rent", () => {
    const result = validateTransaction({...validateTransactionTest});
    expect(result.valid).toBe(true);
    expect(result.transaction.category).toBe("rent");
  });
  test("Accepta categoria salary si tipul income", () => {
    const result = validateTransaction({
      description: "Salariu",
      amount: "4000",
      type: "income",
      category: "salary",
      date: "2026-05-03",
    });
    expect(result.valid).toBe(true);
    expect(result.transaction.type).toBe("income");
    expect(result.transaction.category).toBe("salary");
  })
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
  test("Respinge format gresit de data", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, date: "2077-0503" })
        .valid,
    ).toBe(false);
  });
  test("Accepta data de azi", () => {
    const today = new Date();
    expect(
      validateTransaction({ ...validateTransactionTest, date: today })
        .valid,
    ).toBe(true);
  });
  // Functional Testing + Equibalence partitioning
  test("Accepta o tranzatie valida", () => {
    const result = validateTransaction(validateTransactionTest);

    expect(result.valid).toBe(true);
    expect(result.transaction.description).toBe("Chirie");
    expect(result.transaction.amount).toBe(1500);
    expect(result.transaction.type).toBe("expense");
  });
  // Functional Testing
  test("Elimina spatiile inutile din descriere", () => {
    const result = validateTransaction({
      ...validateTransactionTest,
      description: "    Chirie   ",
    });
    expect(result.transaction.description).toBe("Chirie");
  });
  test("Mesaje pentru descrieri prea scurte", () => {
    expect(validateTransaction({ ...validateTransactionTest, description: "ab" })).toEqual({ valid: false, message: "Minim 3 caractere" });
  });
  test("Mesaj pentru descrieri mai lungi de 60 de caractere", () => {
    const description = "a".repeat(61);
    expect(
      validateTransaction({ ...validateTransactionTest, description })).toEqual({ valid: false, message: "Maxim 60 caractere" });
  });
  test("Mesaj suma goala", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, amount: "0" })
    ).toEqual({ valid: false, message: "Suma nu poate fi 0" });
  });
  test("Mesaj cateogrii invalide", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, category: "car" })
    ).toEqual({ valid: false, message: "Categorie invalida" });
  });
  test("Mesaj tipuri invalide", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, type: "gift" })
    ).toEqual({ valid: false, message: "Tip tranzactie invalid" });
  });
  test("Mesaj date invalide", () => {
    expect(
      validateTransaction({ ...validateTransactionTest, date: "" })
    ).toEqual({ valid: false, message: "Data obligatorie" });
  });
  test("Mesaj date din viitor", () => {
    expect(validateTransaction({ ...validateTransactionTest, date: "2077-05-03" })).toEqual({ valid: false, message: "Data nu poate fi in viitor" });
  });
  test("Mesaj suma goala", () => {
    expect(validateTransaction({...validateTransactionTest, amount: ""})).toEqual({valid: false, message: "Field obligatoriu"});
  });
  test("Mesaj text ca valoare pentru suma", () => {
    expect(validateTransaction({...validateTransactionTest, amount: "abc"})).toEqual({valid: false, message: "Field obligatoriu"});
  });
  test("Mesaj suma prea mare", () => {
    expect(validateTransaction({...validateTransactionTest, amount: "1000000.01"})).toEqual({valid: false, message: "Suma este prea mare"});
  });
  test("Tranzactie generata cu id", () => {
    const result = validateTransaction(validateTransactionTest);

    expect(typeof result.transaction.id).toBe("string");
    expect(result.transaction.id.length).toBeGreaterThan(0);
  })
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
  test("Elimina spatiile inutile din descriere", () => {
    expect(
      filterTransactions(transactions, { search: "  cafea    " }),
    ).toHaveLength(1);
  });
});

describe("toMoney", () => {
  test("Formeaza suma cu doua zecimale", () => {
    expect(toMoney(12)).toBe("12.00 RON");
  });
});
