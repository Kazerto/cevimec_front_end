import { Component, OnInit } from '@angular/core';

interface Loan {
  id: number;
  memberId: number;
  amount: number;
  interestRate: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  payments: Payment[];
}

interface Payment {
  id: number;
  date: Date;
  amount: number;
}

interface EligibleSaver {
  id: number;
  name: string;
  savingsBalance: number;
  eligibleAmount: number;
}

interface LoanWithMemberName extends Loan {
  memberName: string;
}

@Component({
  selector: 'app-loans-management',
  templateUrl: './loans-management.component.html',
  styleUrls: ['./loans-management.component.css']
})
export class LoansManagementComponent implements OnInit {
  loans: LoanWithMemberName[] = [];
  eligibleSavers: EligibleSaver[] = [];
  selectedLoan: LoanWithMemberName | null = null;
  newLoan: Partial<LoanWithMemberName> | null = null;
  showLoanForm = false;
  showPaymentForm = false;
  newPayment: Partial<Payment> = {};

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.eligibleSavers = [
      { id: 1, name: 'Jean Dupont', savingsBalance: 10000, eligibleAmount: 5000 },
      { id: 2, name: 'Marie Martin', savingsBalance: 8000, eligibleAmount: 4000 },
    ];

    this.loans = [
      {
        id: 1,
        memberId: 1,
        memberName: 'Jean Dupont',
        amount: 5000,
        interestRate: 5,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'active',
        payments: [
          { id: 1, date: new Date('2024-02-01'), amount: 500 },
          { id: 2, date: new Date('2024-03-01'), amount: 500 }
        ]
      },
      // Ajoutez d'autres prêts simulés si nécessaire
    ];
  }

  registerLoan() {
    this.newLoan = {
      id: this.loans.length + 1,
      memberId: 0,
      memberName: '',
      amount: 0,
      interestRate: 5,
      startDate: new Date(),
      endDate: new Date(),
      status: 'active',
      payments: []
    };
    this.showLoanForm = true;
  }

  saveLoan() {
    if (this.newLoan && this.newLoan.memberId) {
      const saver = this.eligibleSavers.find(s => s.id === this.newLoan!.memberId);
      if (saver) {
        this.newLoan.memberName = saver.name;
        this.loans.push(this.newLoan as LoanWithMemberName);
        this.newLoan = null;
        this.showLoanForm = false;
      }
    }
  }

  recordPayment(loanId: number) {
    this.selectedLoan = this.loans.find(loan => loan.id === loanId) || null;
    this.showPaymentForm = true;
    this.newPayment = {
      id: this.selectedLoan?.payments.length ? this.selectedLoan.payments.length + 1 : 1,
      date: new Date(),
      amount: 0
    };
  }

  savePayment() {
    if (this.selectedLoan && this.newPayment.amount && this.newPayment.date) {
      this.selectedLoan.payments.push(this.newPayment as Payment);
      // Ici, vous mettriez à jour le statut du prêt, vérifieriez s'il est terminé, etc.
      this.showPaymentForm = false;
      this.selectedLoan = null;
      this.newPayment = {};
    }
  }

  printReceipt(payment: Payment) {
    console.log('Printing receipt for payment:', payment);
    // Implement receipt printing logic here
  }

  generateLoanReport() {
    console.log('Generating loan report');
    // Implement report generation logic here
  }
}
