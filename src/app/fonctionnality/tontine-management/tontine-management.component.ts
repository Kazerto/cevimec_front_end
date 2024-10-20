import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface Tontine {
  id: number;
  nom: string;
  dateDebut: Date;
  montantCotisation: number;
  frequence: string;
  membres: Membre[];
}

interface Membre {
  id: number;
  nom: string;
  ordreReception: number;
}

@Component({
  selector: 'app-tontine-management',
  templateUrl: './tontine-management.component.html',
  styleUrls: ['./tontine-management.component.css']
})
export class TontineManagementComponent implements OnInit {
  tontines: Tontine[] = [];
  nouvelleTontine: Tontine = {
    id: 0,
    nom: '',
    dateDebut: new Date(),
    montantCotisation: 0,
    frequence: '',
    membres: []
  };
  tontineSelectionnee: Tontine | null = null;
  nouveauMembre: Membre = { id: 0, nom: '', ordreReception: 0 };
  frequences: string[] = ['Hebdomadaire', 'Bimensuelle', 'Mensuelle', 'Trimestrielle'];

  constructor() { }

  ngOnInit(): void {
    this.chargerDonneesFictives();
  }

  ouvrirTontine(): void {
    const nouvelleTontine = { ...this.nouvelleTontine, id: this.tontines.length + 1 };
    this.tontines.push(nouvelleTontine);
    this.nouvelleTontine = {
      id: 0,
      nom: '',
      dateDebut: new Date(),
      montantCotisation: 0,
      frequence: '',
      membres: []
    };
  }

  selectionnerTontine(tontine: Tontine): void {
    this.tontineSelectionnee = tontine;
  }

  definirOrdreAleatoire(): void {
    if (this.tontineSelectionnee) {
      const membres = [...this.tontineSelectionnee.membres];
      for (let i = membres.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [membres[i], membres[j]] = [membres[j], membres[i]];
      }
      membres.forEach((membre, index) => {
        membre.ordreReception = index + 1;
      });
      this.tontineSelectionnee.membres = membres;
    }
  }

  ajouterMembre(): void {
    if (this.tontineSelectionnee && this.nouveauMembre.nom.trim()) {
      const nouveauMembre = {
        ...this.nouveauMembre,
        id: this.tontineSelectionnee.membres.length + 1,
        ordreReception: this.tontineSelectionnee.membres.length + 1
      };
      this.tontineSelectionnee.membres.push(nouveauMembre);
      this.nouveauMembre = { id: 0, nom: '', ordreReception: 0 };
    }
  }

  onDrop(event: CdkDragDrop<Membre[]>) {
    if (this.tontineSelectionnee) {
      moveItemInArray(this.tontineSelectionnee.membres, event.previousIndex, event.currentIndex);
      this.updateOrdreReception();
    }
  }

  updateOrdreReception() {
    if (this.tontineSelectionnee) {
      this.tontineSelectionnee.membres.forEach((membre, index) => {
        membre.ordreReception = index + 1;
      });
    }
  }

  genererRapport(): void {
    if (this.tontineSelectionnee) {
      console.log(`Génération du rapport pour la tontine: ${this.tontineSelectionnee.nom}`);
      // Logique pour générer le rapport (à implémenter plus tard)
    }
  }

  private chargerDonneesFictives(): void {
    this.tontines = [
      {
        id: 1,
        nom: 'Tontine A',
        dateDebut: new Date('2024-01-01'),
        montantCotisation: 10000,
        frequence: 'Mensuelle',
        membres: [
          { id: 1, nom: 'Alice', ordreReception: 1 },
          { id: 2, nom: 'Bob', ordreReception: 2 },
          { id: 3, nom: 'Charlie', ordreReception: 3 }
        ]
      },
      {
        id: 2,
        nom: 'Tontine B',
        dateDebut: new Date('2024-02-01'),
        montantCotisation: 5000,
        frequence: 'Bimensuelle',
        membres: [
          { id: 1, nom: 'David', ordreReception: 1 },
          { id: 2, nom: 'Eve', ordreReception: 2 },
          { id: 3, nom: 'Frank', ordreReception: 3 }
        ]
      }
    ];
  }
}
