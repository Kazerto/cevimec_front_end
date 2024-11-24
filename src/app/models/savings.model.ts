import {Member} from "./member.model";
import {Versement} from "./versement.model";

export enum SavingsStatus {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  BLOQUE = 'BLOQUE'
}

export interface Savings {
  id: number;
  balance: number;
  creationDate: Date;
  status: SavingsStatus;  // Ajouter le status
  member?: Member;
  memberId?: number;
  versements?: Versement[];
}

export interface SavingsOperation {
    savings: Savings;
    amount: number;
}


