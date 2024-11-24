import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { SavingsService } from '../../services/savings.service';
import { Loan } from '../../models/loan.model';
import { Member } from '../../models/member.model';
import { Savings, SavingsStatus } from '../../models/savings.model';

interface EligibleMember {
  id: number;
  name: string;
  savingsBalance: number;
  eligibleAmount: number;
  savings: Savings;
}

interface Payment {
  id: number;
  date: Date;
  amount: number;
}

@Component({
  selector: 'app-loans-management',
  templateUrl: './loans-management.component.html',
  styleUrls: ['./loans-management.component.scss']
})
export class LoansManagementComponent implements OnInit {
  loans: Loan[] = [];
  eligibleMembers: EligibleMember[] = [];
  selectedLoan: Loan | null = null;
  newLoan: Partial<Loan> = {
    interestRate: 0.05, // Taux par défaut de 5%
  };
  showLoanForm = false;
  showPaymentForm = false;
  newPayment: Partial<Payment> = {};
  isLoading = false;
  errorMessage = '';

  constructor(
    private loanService: LoanService,
    private savingsService: SavingsService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.isLoading = true;
    try {
      // Charger les prêts
      this.loanService.getAllLoans().subscribe({
        next: (loans) => {
          this.loans = loans;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des prêts: ' + error.message;
          this.isLoading = false;
        }
      });

      // Charger uniquement les comptes épargne actifs
      this.savingsService.getActiveSavings().subscribe({
        next: (activeSavings) => {
          // Transformer les comptes épargne en membres éligibles
          this.eligibleMembers = activeSavings
            .filter(savings => savings.status === SavingsStatus.ACTIF && savings.balance > 0)
            .map(savings => ({
              id: savings.member?.id || 0,
              name: savings.member?.name || '',
              savingsBalance: savings.balance,
              eligibleAmount: this.calculateEligibleAmount(savings.balance),
              savings: savings
            }));
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des comptes épargne: ' + error.message;
        }
      });
    } catch (error) {
      this.errorMessage = 'Une erreur est survenue lors du chargement des données';
      this.isLoading = false;
    }
  }

  // Calculer le montant éligible (par exemple 50% du solde d'épargne)
  private calculateEligibleAmount(balance: number): number {
    return balance * 0.5; // 50% du solde d'épargne
  }

  registerLoan() {
    this.newLoan = {
      interestRate: 0.05,
      loanDate: new Date(),
      member: null,
      amount: 0,
    };
    this.showLoanForm = true;
  }

  saveLoan() {
    if (!this.newLoan.member || !this.newLoan.amount) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    // Vérifier l'éligibilité
    const eligibleMember = this.eligibleMembers.find(m => m.id === this.newLoan.member?.id);
    if (!eligibleMember) {
      this.errorMessage = 'Ce membre n\'a pas de compte épargne actif';
      return;
    }

    // Vérifier le montant du prêt par rapport au solde d'épargne
    if (this.newLoan.amount > eligibleMember.eligibleAmount) {
      this.errorMessage = `Le montant demandé dépasse le montant éligible (maximum: ${eligibleMember.eligibleAmount} XAF)`;
      return;
    }

    this.isLoading = true;
    this.loanService.createLoan(this.newLoan).subscribe({
      next: (loan) => {
        this.loans.push(loan);
        this.showLoanForm = false;
        this.newLoan = { interestRate: 0.05 };
        this.isLoading = false;
        // Rafraîchir les données
        this.loadInitialData();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création du prêt: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  recordPayment(loanId: number) {
    this.selectedLoan = this.loans.find(loan => loan.id === loanId) || null;
    if (this.selectedLoan) {
      this.showPaymentForm = true;
      this.newPayment = {
        date: new Date(),
        amount: 0
      };
    }
  }

  savePayment() {
    if (!this.selectedLoan || !this.newPayment.amount) {
      this.errorMessage = 'Veuillez remplir tous les champs du paiement';
      return;
    }

    // Vérifier que le paiement ne dépasse pas le montant restant dû
    const remainingAmount = this.calculateRemainingAmount(this.selectedLoan);
    if (this.newPayment.amount > remainingAmount) {
      this.errorMessage = 'Le montant du paiement dépasse le montant restant dû';
      return;
    }

    this.isLoading = true;
    this.loanService.recordPayment(this.selectedLoan.id, this.newPayment).subscribe({
      next: (updatedLoan) => {
        const index = this.loans.findIndex(l => l.id === this.selectedLoan?.id);
        if (index !== -1) {
          this.loans[index] = updatedLoan;
        }
        this.showPaymentForm = false;
        this.selectedLoan = null;
        this.newPayment = {};
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'enregistrement du paiement: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  calculateRemainingAmount(loan: Loan): number {
    const totalPaid = loan.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    return loan.totalRepayment - totalPaid;
  }

  generateLoanReport() {
    this.isLoading = true;
    this.loanService.generateReport().subscribe({
      next: (reportData) => {
        console.log('Rapport généré:', reportData);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la génération du rapport: ' + error.message;
        this.isLoading = false;
      }
    });
  }
}
