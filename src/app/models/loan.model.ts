import { Member } from './member.model';
import { Reimbursement } from './reimbursement.model';

export enum LoanStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Loan {
  id: number;
  member?: Partial<Member>; // Permet de n'envoyer que { id: number }

  memberId?: number;
  status: LoanStatus;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  loanDate: Date;
  dueDate: Date;
  totalRepayment: number;
  reimbursements?: Reimbursement[];
}
