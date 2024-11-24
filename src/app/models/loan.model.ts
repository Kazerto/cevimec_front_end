import {Member} from "./member.model";

export interface Loan {
  id: number;
  member: Member;
  amount: number;
  interestRate: number;
  loanDate: string | Date;  // Permettre les deux formats
  repaymentDate?: string | Date | null;
  totalRepayment: number;
}
