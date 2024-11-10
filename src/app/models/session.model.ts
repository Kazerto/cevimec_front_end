export interface Session {
  id?: number;
  date: Date;
  agenda: string;           // Correspond au 'title' du frontend
  sessionType: string;      // Correspond au 'type' du frontend
  membersPresent: number[]; // IDs des membres présents
  smallTontineTotal: number;
  sanctionTotal: number;
  bigTontineTotal: number;
  householdBasketTotal: number;
  expensesTotal: number;
  status?: 'open' | 'closed';
}
