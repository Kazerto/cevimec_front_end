export interface Contribution {
  id: number;
  amount: number;
  memberId: number;
  date: Date;
}

export interface ContributionSmallTontine extends Contribution {
  smallTontineId: number;
}

export interface ContributionTontine extends Contribution {
  tontineId: number;
}
