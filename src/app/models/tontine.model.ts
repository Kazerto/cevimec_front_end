export interface Tontine {
  id: number;
  tontineType: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  memberIds: number[];
}

export interface SmallTontine {
  id: number;
  memberIds: number[];
  sessionIds: number[];
  amount: number;
  openDate: Date;
}
