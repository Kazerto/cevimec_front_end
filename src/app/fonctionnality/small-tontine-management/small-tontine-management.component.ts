import { Component, OnInit } from '@angular/core';

interface Cotisation {
  id: number;
  memberId: number;
  montant: number;
  date: Date;
}

interface MouvementFonds {
  id: number;
  type: 'entree' | 'sortie';
  montant: number;
  date: Date;
  description: string;
}

@Component({
  selector: 'app-small-tontine-management',
  templateUrl: './small-tontine-management.component.html',
  styleUrls: ['./small-tontine-management.component.css']
})
export class SmallTontineManagementComponent implements OnInit {
  cotisations: Cotisation[] = [];
  mouvementsFonds: MouvementFonds[] = [];
  nouvelleCotisation: Cotisation = { id: 0, memberId: 0, montant: 0, date: new Date() };
  nouveauMouvement: MouvementFonds = { id: 0, type: 'entree', montant: 0, date: new Date(), description: '' };

  constructor() { }

  ngOnInit(): void {
    this.chargerDonneesFictives();
  }

  addCotisation(): void {
    const nouvelleCotisation = { ...this.nouvelleCotisation, id: this.cotisations.length + 1 };
    this.cotisations.push(nouvelleCotisation);
    this.nouvelleCotisation = { id: 0, memberId: 0, montant: 0, date: new Date() };
  }

  addMouvementFonds(): void {
    const nouveauMouvement = { ...this.nouveauMouvement, id: this.mouvementsFonds.length + 1 };
    this.mouvementsFonds.push(nouveauMouvement);
    this.nouveauMouvement = { id: 0, type: 'entree', montant: 0, date: new Date(), description: '' };
  }

  generateRapport(): void {
    console.log('Génération du rapport de la petite tontine');
    // Logique pour générer le rapport (à implémenter plus tard)
  }

  private chargerDonneesFictives(): void {
    this.cotisations = [
      { id: 1, memberId: 1, montant: 5000, date: new Date('2024-10-01') },
      { id: 2, memberId: 2, montant: 5000, date: new Date('2024-10-02') },
    ];

    this.mouvementsFonds = [
      { id: 1, type: 'entree', montant: 10000, date: new Date('2024-10-03'), description: 'Cotisations reçues' },
      { id: 2, type: 'sortie', montant: 2000, date: new Date('2024-10-05'), description: 'Frais bancaires' },
    ];
  }
}
