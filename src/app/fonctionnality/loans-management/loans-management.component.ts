// loan-management.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { MemberService } from '../../services/member.service';
import { Loan, LoanStatus } from '../../models/loan.model';
import {AccountStatus, Member} from '../../models/member.model';
import { Reimbursement } from '../../models/reimbursement.model';
import {SavingsStatus} from "../../models/savings.model";
import {SavingsService} from "../../services/savings.service";
import { forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-loans-management',
  templateUrl: './loans-management.component.html',
  styleUrls: ['./loans-management.component.css']
})
export class LoansManagementComponent implements OnInit {
  loans: Loan[] = [];
  members: Member[] = [];
  eligibleMembers: Member[] = []; // Members with active savings accounts
  selectedLoan: Loan | null = null;
  isLoading = false;
  errorMessage = '';
  showLoanForm = false;
  showReimbursementForm = false;

  // Formulaires
  loanForm!: FormGroup;
  reimbursementForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private loanService: LoanService,
    private memberService: MemberService,
    private savingsService: SavingsService,
    private reimbursementService: ReimbursementService
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    this.loanForm = this.fb.group({
      memberId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      dueDate: ['', Validators.required]
    });

    this.reimbursementForm = this.fb.group({
      reimbursementAmount: [0, [Validators.required, Validators.min(1)]],
      reimbursementDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEligibleMembers();
    this.loadLoans();
  }

  private loadEligibleMembers() {
    this.isLoading = true;

    forkJoin({
      members: this.memberService.getMembersByStatus(AccountStatus.ACTIVE),
      savings: this.savingsService.getAllSavings()
    }).subscribe({
      next: ({ members, savings }) => {
        // Filtrer uniquement les comptes d'épargne actifs
        const activeSavings = savings.filter(saving =>
          saving.status === SavingsStatus.ACTIF
        );

        // Filtrer les membres qui ont un compte d'épargne actif
        this.eligibleMembers = members.filter(member => {
          // Utiliser l'ID du membre imbriqué dans l'objet saving
          const isEligible = activeSavings.some(saving =>
            saving.member?.id === member.id
          );

          return isEligible;
        });

        console.log('Membres éligibles finaux:', this.eligibleMembers);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres éligibles:', error);
        this.errorMessage = 'Erreur lors du chargement des membres';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }



  private loadLoans() {
    this.isLoading = true;
    this.loanService.getAllLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des prêts';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createLoan() {
    if (this.loanForm.valid) {
      const formValue = this.loanForm.value;
      const memberId = Number(formValue.memberId);

      if (!this.checkMemberEligibility(memberId)) {
        this.errorMessage = 'Le membre doit avoir un compte épargne actif pour obtenir un prêt';
        return;
      }

      this.isLoading = true;

      // Création de l'objet prêt sans l'objet member complet
      const loanData = {
        member: { id: memberId }, // Au lieu de `memberId`
        amount: formValue.amount,
        interestRate: formValue.interestRate / 100,
        dueDate: new Date(formValue.dueDate),
        remainingAmount: formValue.amount,
        totalRepayment: this.calculateTotalRepayment(
          formValue.amount,
          formValue.interestRate / 100
        ),
        status: LoanStatus.IN_PROGRESS,
        loanDate: new Date()
      };



      console.log('Données du prêt à envoyer:', loanData);

      this.loanService.createLoan(loanData).subscribe({
        next: (response) => {
          console.log('Prêt créé avec succès:', response);
          this.loadLoans();
          this.showLoanForm = false;
          this.loanForm.reset();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors de la création du prêt:', error);
          this.errorMessage = 'Erreur lors de la création du prêt';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Ajout d'une méthode utilitaire pour vérifier l'éligibilité
  private checkMemberEligibility(memberId: number): boolean {
    return this.eligibleMembers.some(member => member.id === memberId);
  }

  private calculateTotalRepayment(amount: number, interestRate: number): number {
    return amount * (1 + interestRate);
  }

  createReimbursement() {
    if (this.reimbursementForm.valid && this.selectedLoan) {
      this.isLoading = true;
      const reimbursementData: Partial<Reimbursement> = {
        loanId: this.selectedLoan.id,
        reimbursementAmount: this.reimbursementForm.get('reimbursementAmount')?.value,
        reimbursementDate: new Date(this.reimbursementForm.get('reimbursementDate')?.value)
      };

      this.reimbursementService.createReimbursement(reimbursementData).subscribe({
        next: () => {
          this.loadLoans();
          this.showReimbursementForm = false;
          this.reimbursementForm.reset();
          this.selectedLoan = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création du remboursement';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  selectLoan(loan: Loan) {
    this.selectedLoan = loan;
    this.showReimbursementForm = true;
  }

  calculateRemainingAmount(loan: Loan): number {
    if (!loan.reimbursements) return loan.amount;

    const totalReimbursed = loan.reimbursements.reduce(
      (sum, reimbursement) => sum + reimbursement.reimbursementAmount,
      0
    );
    return loan.totalRepayment - totalReimbursed;
  }

  getDaysUntilDue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getLoanStatusClass(loan: Loan): string {
    const daysUntilDue = this.getDaysUntilDue(loan.dueDate);
    if (loan.status === LoanStatus.COMPLETED) return 'bg-success';
    if (daysUntilDue < 0) return 'bg-danger';
    if (daysUntilDue < 7) return 'bg-warning';
    return 'bg-info';
  }

  closeError() {
    this.errorMessage = '';
  }
}
