import { Component, OnInit } from '@angular/core';

interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: Date;
  isTontineExpense: boolean;
  tontineName?: string;
  invoiceUrl?: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-expenses-management',
  templateUrl: './expenses-management.component.html',
  styleUrls: ['./expenses-management.component.css']
})
export class ExpensesManagementComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  newExpense: Expense = this.getEmptyExpense();
  newCategory: Category = { id: 0, name: '' };
  showExpenseForm = false;
  showCategoryForm = false;
  selectedTontine: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.categories = [
      { id: 1, name: 'Fournitures de bureau' },
      { id: 2, name: 'Événements' },
      { id: 3, name: 'Tontine - Panier de la ménagère' }
    ];

    this.expenses = [
      { id: 1, amount: 50000, description: 'Achat de papier', category: 'Fournitures de bureau', date: new Date('2024-03-01'), isTontineExpense: false },
      { id: 2, amount: 150000, description: 'Réunion annuelle', category: 'Événements', date: new Date('2024-03-15'), isTontineExpense: false },
      { id: 3, amount: 100000, description: 'Achat de produits alimentaires', category: 'Tontine - Panier de la ménagère', date: new Date('2024-03-20'), isTontineExpense: true, tontineName: 'Tontine A' }
    ];
  }

  getEmptyExpense(): Expense {
    return {
      id: 0,
      amount: 0,
      description: '',
      category: '',
      date: new Date(),
      isTontineExpense: false
    };
  }

  addExpense() {
    this.showExpenseForm = true;
    this.newExpense = this.getEmptyExpense();
  }

  saveExpense() {
    if (this.newExpense.id === 0) {
      this.newExpense.id = this.expenses.length + 1;
      this.expenses.push(this.newExpense);
    } else {
      const index = this.expenses.findIndex(e => e.id === this.newExpense.id);
      if (index !== -1) {
        this.expenses[index] = this.newExpense;
      }
    }
    this.showExpenseForm = false;
    this.newExpense = this.getEmptyExpense();
  }

  addCategory() {
    this.showCategoryForm = true;
    this.newCategory = { id: 0, name: '' };
  }

  saveCategory() {
    if (this.newCategory.id === 0) {
      this.newCategory.id = this.categories.length + 1;
      this.categories.push(this.newCategory);
    }
    this.showCategoryForm = false;
    this.newCategory = { id: 0, name: '' };
  }

  generateReport() {
    // Simuler la génération d'un rapport
    console.log('Génération du rapport des dépenses :', this.expenses);
    alert('Rapport généré (simulé). Consultez la console pour les détails.');
  }

  uploadInvoice(event: any, expenseId: number) {
    const file = event.target.files[0];
    if (file) {
      // Simuler le téléchargement du fichier
      const expense = this.expenses.find(e => e.id === expenseId);
      if (expense) {
        expense.invoiceUrl = 'assets/factures/' + file.name;
        alert('Facture téléchargée (simulé)');
      }
    }
  }

  editExpense(expense: Expense) {
    this.newExpense = { ...expense };
    this.showExpenseForm = true;
  }

  deleteExpense(id: number) {
    this.expenses = this.expenses.filter(e => e.id !== id);
  }
}
