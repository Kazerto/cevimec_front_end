import { Component, OnInit } from '@angular/core';

interface Aide {
  date: Date;
  type: string;
  membre: string;
  montant: number;
}

@Component({
  selector: 'app-aids-management',
  templateUrl: './aids-management.component.html',
  styleUrls: ['./aids-management.component.css']
})
export class AidsManagementComponent implements OnInit {
  aides: Aide[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialiser avec des données factices pour l'exemple
    this.aides = [
      { date: new Date(), type: 'Mariage', membre: 'John Doe', montant: 1000 },
      { date: new Date(), type: 'Naissance', membre: 'Jane Smith', montant: 500 },
    ];
  }

  enregistrerAide(aide: Aide): void {
    // Logique pour enregistrer une nouvelle aide
    this.aides.push(aide);
  }

  genererRapport(): void {
    // Logique pour générer un rapport
    console.log('Génération du rapport...');
  }

  visualiserMembresEligibles(): void {
    // Logique pour afficher les membres éligibles
    console.log('Affichage des membres éligibles...');
  }
}
