import {Member} from "./member.model";

export interface Loan {
  id: number;
  member: Member;
  amount: number;
  interestRate: number;
  loanDate: Date;
  repaymentDate: Date;
  totalRepayment: number;
}
