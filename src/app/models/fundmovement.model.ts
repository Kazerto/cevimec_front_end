export interface FundMovement {
  id: number;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  date: Date;
}
