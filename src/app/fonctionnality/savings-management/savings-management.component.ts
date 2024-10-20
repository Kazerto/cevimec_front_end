import { Component, OnInit } from '@angular/core';

interface SavingsAccount {
  id: number;
  memberId: number;
  memberName: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  closedAt?: Date;
}

interface Transaction {
  id: number;
  accountId: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: Date;
}

@Component({
  selector: 'app-savings-management',
  templateUrl: './savings-management.component.html',
  styleUrls: ['./savings-management.component.css']
})
export class SavingsManagementComponent implements OnInit {
  savingsAccounts: SavingsAccount[] = [];
  transactions: Transaction[] = [];
  selectedAccount: SavingsAccount | null = null;
  showAccountForm = false;
  showTransactionForm = false;
  transactionType: 'deposit' | 'withdrawal' = 'deposit';
  transactionAmount = 0;

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.savingsAccounts = [
      { id: 1, memberId: 1, memberName: 'Jean Dupont', balance: 1000, isActive: true, createdAt: new Date('2024-01-01') },
      { id: 2, memberId: 2, memberName: 'Marie Martin', balance: 500, isActive: true, createdAt: new Date('2024-02-01') },
    ];

    this.transactions = [
      { id: 1, accountId: 1, type: 'deposit', amount: 500, date: new Date('2024-01-15') },
      { id: 2, accountId: 1, type: 'deposit', amount: 500, date: new Date('2024-02-15') },
      { id: 3, accountId: 2, type: 'deposit', amount: 500, date: new Date('2024-02-01') },
    ];
  }

  createAccount() {
    this.showAccountForm = true;
    this.selectedAccount = null;
  }

  saveAccount(memberName: string) {
    const newAccount: SavingsAccount = {
      id: this.savingsAccounts.length + 1,
      memberId: this.savingsAccounts.length + 1, // Simulated member ID
      memberName: memberName,
      balance: 0,
      isActive: true,
      createdAt: new Date()
    };
    this.savingsAccounts.push(newAccount);
    this.showAccountForm = false;
  }

  selectAccount(account: SavingsAccount) {
    this.selectedAccount = account;
  }

  openTransactionForm(type: 'deposit' | 'withdrawal') {
    if (this.selectedAccount) {
      this.showTransactionForm = true;
      this.transactionType = type;
      this.transactionAmount = 0;
    }
  }

  processTransaction() {
    if (this.selectedAccount && this.transactionAmount > 0) {
      const newTransaction: Transaction = {
        id: this.transactions.length + 1,
        accountId: this.selectedAccount.id,
        type: this.transactionType,
        amount: this.transactionAmount,
        date: new Date()
      };

      if (this.transactionType === 'deposit') {
        this.selectedAccount.balance += this.transactionAmount;
      } else {
        if (this.selectedAccount.balance >= this.transactionAmount) {
          this.selectedAccount.balance -= this.transactionAmount;
        } else {
          alert('Solde insuffisant');
          return;
        }
      }

      this.transactions.push(newTransaction);
      this.showTransactionForm = false;
      this.transactionAmount = 0;
    }
  }

  closeAccount() {
    if (this.selectedAccount) {
      this.selectedAccount.isActive = false;
      this.selectedAccount.closedAt = new Date();
      this.selectedAccount = null;
    }
  }

  generateStatement(account: SavingsAccount) {
    const accountTransactions = this.transactions.filter(t => t.accountId === account.id);
    console.log(`Relevé du compte de ${account.memberName}:`, accountTransactions);
    // Ici, vous pourriez générer un PDF ou ouvrir une nouvelle fenêtre avec le relevé
    alert('Relevé généré (simulé)');
  }
}
