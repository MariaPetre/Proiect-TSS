# Expense / Budget Tracker in Vanilla JavaScript

Aplicatie web pentru administrarea unui buget lunar, a veniturilor si cheltuielilor. Proiectul este facut in Vanila Javascript, pentru teste am folosit Jest si Stryker

## Functionalitati implementate

- validarea bugetului
- validarea tranzactiilor
- calcularea veniturilor si cheltuielilor
- calcularea soldului
- calcularea bugetului ramas
- filtrarea tranzactiilor
- formatarea valorilor monetare

Strategii de testare utilizate
Black-box Testing

Testele black-box au fost realizate pe baza specificațiilor aplicatiei, fara analizarea implementarii interne.

Equivalence Partitioning
Au fost create clase de echivalenta valide si invalide pentru:
- buget
- descriere tranzactie
- suma
- categorie
- tip tranzactie
- data

Boundary Value Analysis
Au fost testate valori de frontiera:
- 0
- 0.01
- 1.000.000
- 1.000.000.01
- descrieri de 2, 3, 60 și 61 caractere

Functional Testing
Au fost testate functionalitatile principale:
- calcul totaluri
- filtrare tranzactii
- formatare sume
- validare tranzactii

Input Validation Testing
Au fost validate:
- campuri goale
- valori negative
- tipuri invalide
- categorii invalide
- date invalide

White-box Testing
White-box testing a fost realizat utilizand rapoartele de coverage generate de Jest/Istanbul.

Au fost analizate:
- Statement Coverage
- Branch Coverage
- Function Coverage
- Line Coverage

Rularea aplicatiei
Instalare dependinte:
npm install

Pornirea aplicatiei:
npm start

Rulare teste:
npm test

Coverage:
npm run test:coverage

Mutation Testing:
npm run nutation
# Proiect-TSS
