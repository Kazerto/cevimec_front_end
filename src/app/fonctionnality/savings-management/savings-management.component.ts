import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { SavingsService } from '../../services/savings.service';
import { Member, AccountStatus } from '../../models/member.model';
import { Savings, SavingsStatus } from '../../models/savings.model';
import { VersementService } from "../../services/versement.service";
import { Versement } from "../../models/versement.model";

@Component({
  selector: 'app-savings-management',
  templateUrl: './savings-management.component.html',
  styleUrls: ['./savings-management.component.css']
})
export class SavingsManagementComponent implements OnInit {
  members: Member[] = [];
  savingsAccounts: Savings[] = [];
  selectedAccount: Savings | null = null;
  currentTab: SavingsStatus = SavingsStatus.ACTIF;  // Utilisation du statut ACTIF
  loading = false;
  error = '';
  searchTerm: string = '';
  isSearching: boolean = false;

  // Listes filtrées par statut
  activeAccounts: Savings[] = [];
  inactiveAccounts: Savings[] = [];
  blockedAccounts: Savings[] = [];

  // Formulaires
  accountForm!: FormGroup;
  transactionForm!: FormGroup;

  // États d'affichage
  showAccountForm = false;
  showTransactionForm = false;
  showSavingsDetails = false;




  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private memberService: MemberService,
    private savingsService: SavingsService,
    private versementService: VersementService
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    this.accountForm = this.fb.group({
      memberId: ['', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]]
    });

    this.transactionForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0)]],
      type: ['deposit', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadActiveMembers();
    this.loadSavingsAccounts();
  }

  // Chargement des membres actifs
  private loadActiveMembers() {
    this.loading = true;
    this.memberService.getMembersByStatus(AccountStatus.ACTIVE).subscribe({
      next: (members) => {
        this.members = members.filter(member => member.id !== 1); // Exclure l'admin
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des membres';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Filtrer les comptes par statut
  private filterAccounts() {
    this.activeAccounts = this.savingsAccounts.filter(
      account => account.status === SavingsStatus.ACTIF
    );
    this.inactiveAccounts = this.savingsAccounts.filter(
      account => account.status === SavingsStatus.INACTIF
    );
    this.blockedAccounts = this.savingsAccounts.filter(
      account => account.status === SavingsStatus.BLOQUE
    );
  }

  toggleAccountForm() {
    console.log('Bouton cliqué, état actuel :', this.showAccountForm);
    this.showAccountForm = !this.showAccountForm;
  }

  getLastTransactionDate(account: Savings): string {
    if (!account.versements?.length) {
      return 'Aucune';
    }
    const lastVersement = account.versements[account.versements.length - 1];
    return lastVersement?.versementDate ?
      new Date(lastVersement.versementDate).toLocaleDateString() :
      'Aucune';
  }

  // Chargement des comptes épargne
  private loadSavingsAccounts() {
    this.loading = true;
    this.savingsService.getAllSavings().subscribe({
      next: (savings) => {
        this.savingsAccounts = savings;
        this.filterAccounts(); // Filtrer les comptes après le chargement
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des comptes épargne';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Création d'un nouveau compte épargne
  createAccount() {
    if (this.accountForm.valid) {
      const newSavings = {
        balance: +this.accountForm.get('initialBalance')?.value || 0,
        memberId: +this.accountForm.get('memberId')?.value,
        status: SavingsStatus.ACTIF // Assigner le statut ACTIF lors de la création du compte
      };

      this.savingsService.createSavings(newSavings).subscribe({
        next: (response) => {
          this.loadSavingsAccounts();
          this.showAccountForm = false;
          this.resetForms();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.error = 'Erreur lors de la création du compte';
          this.cdr.detectChanges();
        }
      });
    }
  }

  private updateAccountStatus(account: Savings, newStatus: SavingsStatus) {
    const updatedAccount = { ...account, status: newStatus };
    this.savingsService.updateSavings(updatedAccount).subscribe({
      next: () => {
        this.loadSavingsAccounts(); // Recharger les comptes après la mise à jour
      },
      error: (error) => {
        this.error = `Erreur lors de la mise à jour du statut du compte`;
        this.cdr.detectChanges();
      }
    });
  }


  deactivateAccount(account: Savings) {
    if (!account || !account.id) {
      this.error = 'Compte invalide';
      return;
    }

    this.loading = true;
    this.error = '';

    this.savingsService.deactivateSavings(account.id).subscribe({
      next: (updatedAccount) => {
        console.log('Compte désactivé avec succès:', updatedAccount);
        this.loadSavingsAccounts(); // Recharger la liste des comptes
      },
      error: (error) => {
        console.error('Erreur lors de la désactivation:', error);
        this.error = `Erreur lors de la désactivation du compte: ${error.message}`;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reactivateAccount(account: Savings) {
    if (!account || !account.id) {
      this.error = 'Compte invalide';
      return;
    }

    this.loading = true;
    this.error = '';

    this.savingsService.reactivateSavings(account.id).subscribe({
      next: (updatedAccount) => {
        console.log('Compte réactivé avec succès:', updatedAccount);
        this.loadSavingsAccounts();
      },
      error: (error) => {
        console.error('Erreur lors de la réactivation:', error);
        this.error = `Erreur lors de la réactivation du compte: ${error.message}`;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  blockAccount(account: Savings) {
    if (!account || !account.id) {
      this.error = 'Compte invalide';
      return;
    }

    this.loading = true;
    this.error = '';

    this.savingsService.blockSavings(account.id).subscribe({
      next: (updatedAccount) => {
        console.log('Compte bloqué avec succès:', updatedAccount);
        this.loadSavingsAccounts();
      },
      error: (error) => {
        console.error('Erreur lors du blocage:', error);
        this.error = `Erreur lors du blocage du compte: ${error.message}`;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  // Traitement des transactions (dépôt/retrait)
  processTransaction() {
    if (!this.selectedAccount || !this.transactionForm.valid) return;

    // Vérification du statut du compte avant de traiter la transaction
    if (this.selectedAccount.status !== SavingsStatus.ACTIF) {
      this.error = 'Opération non autorisée. Le compte est ' + this.selectedAccount.status;
      return;
    }

    const { amount, type } = this.transactionForm.value;
    const transaction: Versement = {
      versementDate: new Date(),
      versementAmount: +amount,
      savingsId: this.selectedAccount.id
    };

    const action = type === 'deposit'
      ? this.versementService.makeVersement(transaction)
      : this.versementService.makeWithdraw(transaction);

    action.subscribe({
      next: (response) => {
        this.loadSavingsAccounts();
        this.showTransactionForm = false;
        this.resetForms();
      },
      error: (error) => this.handleError(error, `Erreur lors du ${type}`)
    });
  }

  // Sélection d'un compte
  selectAccount(account: Savings) {
    this.selectedAccount = account;
    this.showSavingsDetails = true;
    this.resetForms();
  }

  // Fermeture d'un compte
  closeAccount() {
    if (this.selectedAccount) {
      this.savingsService.deleteSavings(this.selectedAccount).subscribe({
        next: () => {
          this.loadSavingsAccounts();
          this.selectedAccount = null;
          this.showSavingsDetails = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.error = 'Erreur lors de la fermeture du compte';
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Réinitialisation des formulaires
  resetForms() {
    this.accountForm.reset({
      memberId: '',
      initialBalance: 0
    });

    this.transactionForm.reset({
      amount: 0,
      type: 'deposit',
      description: ''
    });
  }

  // Gestion des erreurs
  handleError(error: any, contextMessage: string): void {
    console.error(`${contextMessage}:`, error);
    this.error = `${contextMessage}. Veuillez réessayer plus tard.`;
  }
}
