export interface CashRegister {
  id: number;
  currentBalance: number;
  lastUpdateDate: Date;
  movements: {
    date: Date;
    amount: number;
    type: 'credit' | 'debit';
    source: string;
    description: string;
  }[];
}
