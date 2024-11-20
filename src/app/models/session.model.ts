import {Member} from "./member.model";

export interface Session {
  id?: number;
  date: Date;
  agenda: string;
  sessionType: string;
  members: Member[];  // Changé de membersPresent: number[]
  smallTontineTotal: number;
  sanctionTotal: number;
  bigTontineTotal: number;
  householdBasketTotal: number;
  expensesTotal: number;
  sanctions?: any[];
  smallTontine?: any;
  contributionSmallTontines?: any;
  contributionTontines?: any;
}
