import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';

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
    { id: 'memberEvolution', title: "COURBE D'ÉVOLUTION DES EFFECTIFS", allowedRoles: ['president'] },
    { id: 'cashEvolution', title: "EVOLUTION DU MONTANT DE LA CAISSE", allowedRoles: ['admin', 'president'] },
    { id: 'bankEvolution', title: "EVOLUTION DE LA BANQUE", allowedRoles: ['secretaryGeneral', 'president'] }
  ];

  // Données simulées pour les indicateurs
  indicators: Indicator[] = [
    { title: 'Membres Actifs', value: 145, icon: 'bi-people-fill', trend: 12, color: 'primary' },
    { title: 'Fond Total', value: '2,500,000 FCFA', icon: 'bi-wallet2', trend: 8.5, color: 'success' },
    { title: 'Prêts en Cours', value: 15, icon: 'bi-credit-card', trend: -3, color: 'warning' },
    { title: 'Épargnes du Mois', value: '850,000 FCFA', icon: 'bi-piggy-bank', trend: 15, color: 'info' }
  ];

  // Données simulées pour les graphiques
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

  constructor(private userService: UserService) {}

  ngOnInit() {}

  hasAccess(sectionId: string): boolean {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return false;
    const userRole = this.userService.getRole();
    return userRole ? section.allowedRoles.includes(userRole) : false;
  }

  setCurrentSection(sectionId: string) {
    this.currentSection = sectionId;
  }

  protected readonly Math = Math;
}
