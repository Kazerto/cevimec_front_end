export interface SmallTontine {
  id: number;
  startDate: Date;
  endDate: Date;
}

export interface Cotisation {
  id: number;
  memberId: number;
  montant: number;
  date: Date;
}

export interface MouvementFonds {
  id: number;
  type: 'entree' | 'sortie';
  montant: number;
  date: Date;
  description: string;
}
