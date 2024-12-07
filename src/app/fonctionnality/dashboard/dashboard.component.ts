import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { MemberService } from '../../services/member.service';
import { AccountStatus } from '../../models/member.model';
import { SavingsService } from '../../services/savings.service';
import { Savings, SavingsStatus } from '../../models/savings.model';
import { LoanService } from '../../services/loan.service';
import { Loan, LoanStatus } from '../../models/loan.model';
import { forkJoin } from 'rxjs';

interface DashboardSection {
  id: string;
  title: string;
  allowedRoles: string[];
}

interface Indicator {
  title: string;
  value: number | string;
  icon: string;
  trend?: number;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentSection: string = 'indicators';

  sections: DashboardSection[] = [
    { id: 'indicators', title: "INDICATEURS DE L'ASSOCIATION", allowedRoles: ['admin', 'president', 'secretaryGeneral'] },
    { id: 'statistics', title: "STATISTIQUES TABULAIRES ET GRAPHIQUES", allowedRoles: ['admin', 'president'] },
    { id: 'memberEvolution', title: "COURBE D'ÉVOLUTION DES EFFECTIFS", allowedRoles: ['admin','president'] },
    { id: 'cashEvolution', title: "EVOLUTION DU MONTANT DE LA CAISSE", allowedRoles: ['admin', 'president'] },
    { id: 'bankEvolution', title: "EVOLUTION DE LA BANQUE", allowedRoles: ['admin','secretaryGeneral', 'president'] },
    {
      id: 'loanIndicators',
      title: "INDICATEURS DE PRÊTS",
      allowedRoles: ['admin', 'president']
    }
  ];

  // Données pour les indicateurs
  indicators: Indicator[] = [
    { title: 'Membres Actifs', value: 0, icon: 'bi-people-fill', color: 'primary' },
    { title: 'Membres Exclus', value: 0, icon: 'bi-x-circle', color: 'danger' },
    { title: 'Membres Partis', value: 0, icon: 'bi-door-open', color: 'warning' },
    { title: 'Fond Total', value: '2,500,000 FCFA', icon: 'bi-wallet2', trend: 8.5, color: 'success' },
    { title: 'Prêts Actifs', value: 0, icon: 'bi-credit-card', color: 'info' },
    { title: 'Montant Total des Prêts', value: '0 FCFA', icon: 'bi-cash-stack', color: 'primary' },
    { title: 'Prêts Non Soldés', value: 0, icon: 'bi-exclamation-triangle', color: 'warning' },
    { title: 'Membres avec Prêts', value: 0, icon: 'bi-people', color: 'success' },
    { title: 'Comptes Épargne Actifs', value: 0, icon: 'bi-piggy-bank', color: 'info' },
    { title: 'Total Épargnes', value: '0 FCFA', icon: 'bi-currency-exchange', trend: 0, color: 'success' }
  ];

  savingsIndicators: Indicator[] = [
    ...this.indicators, // Conserver les indicateurs existants
    {
      title: 'Comptes Épargne Actifs',
      value: 0,
      icon: 'bi-piggy-bank',
      color: 'info'
    },
    {
      title: 'Total Épargnes',
      value: '0 FCFA',
      icon: 'bi-currency-exchange',
      trend: 0,
      color: 'success'
    }
  ];

  memberEvolutionData: ChartData[] = [
    { name: '2020', value: 85 },
    { name: '2021', value: 100 },
    { name: '2022', value: 120 },
    { name: '2023', value: 135 },
    { name: '2024', value: 145 }
  ];

  cashEvolutionData: ChartData[] = [
    { name: 'Jan', value: 1500000 },
    { name: 'Fév', value: 1800000 },
    { name: 'Mar', value: 2100000 },
    { name: 'Avr', value: 2300000 },
    { name: 'Mai', value: 2500000 }
  ];



  constructor(
    private userService: UserService,
    private memberService: MemberService,
    private savingsService: SavingsService,
    private loanService: LoanService,

  ) {}

  ngOnInit() {
    this.loadMemberStatistics();
    this.loadSavingsStatistics(); // Nouvelle méthode
    this.loadLoanStatistics();
  }


  loadLoanStatistics() {
    this.loanService.getAllLoans().subscribe({
      next: (loans: Loan[]) => {
        // Prêts actifs
        const activeLoans = loans.filter(
          loan => loan.status === LoanStatus.IN_PROGRESS
        );
        this.indicators[4].value = activeLoans.length;

        // Montant total des prêts
        const totalLoanAmount = loans.reduce(
          (total, loan) => total + loan.amount,
          0
        );
        this.indicators[5].value = `${totalLoanAmount.toLocaleString()} FCFA`;

        // Prêts non soldés
        const uncompletedLoans = loans.filter(
          loan => loan.status !== LoanStatus.COMPLETED
        );
        this.indicators[6].value = uncompletedLoans.length;

        // Nombre unique de membres avec prêts
        const membersWithLoans = new Set(
          loans.map(loan => loan.member?.id)
        ).size;
        this.indicators[7].value = membersWithLoans;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques de prêt', error);
      }
    });
  }

  loadMemberStatistics() {
    // Récupérer le nombre de membres par statut
    const statuses = [
      AccountStatus.ACTIVE,
      AccountStatus.EXCLUDED,
      AccountStatus.DEPARTED
    ];

    statuses.forEach(status => {
      this.memberService.getMembersByStatus(status).subscribe({
        next: (members) => {
          switch(status) {
            case AccountStatus.ACTIVE:
              this.indicators[0].value = members.length;
              break;
            case AccountStatus.EXCLUDED:
              this.indicators[1].value = members.length;
              break;
            case AccountStatus.DEPARTED:
              this.indicators[2].value = members.length;
              break;
          }
        },
        error: (error) => {
          console.error(`Erreur lors de la récupération des membres ${status}:`, error);
        }
      });
    });
  }

  hasAccess(sectionId: string): boolean {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return false;
    const userRole = this.userService.getRole();
    return userRole ? section.allowedRoles.includes(userRole) : false;
  }

  setCurrentSection(sectionId: string) {
    this.currentSection = sectionId;
  }

  loadSavingsStatistics() {
    this.savingsService.getAllSavings().subscribe({
      next: (savings) => {
        // Filtrer les comptes d'épargne actifs
        const activeSavings = savings.filter(
          account => account.status === SavingsStatus.ACTIF
        );

        // Mettre à jour le nombre de comptes d'épargne actifs
        this.indicators[8].value = activeSavings.length;

        // Calculer le total des épargnes
        const totalSavings = activeSavings.reduce(
          (total, account) => total + (account.balance || 0),
          0
        );

        // Mettre à jour le total des épargnes
        this.indicators[9].value = `${totalSavings.toLocaleString()} FCFA`;

        // Calculer la tendance (exemple simplifié)
        const averageSavings = totalSavings / activeSavings.length;
        this.indicators[9].trend = averageSavings > 50000 ? 5.5 : -2.3;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes épargne', error);
      }
    });
  }


  protected readonly Math = Math;
}
