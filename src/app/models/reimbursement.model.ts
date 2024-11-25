import {Loan} from "./loan.model";

export interface Reimbursement {
  id: number;
  reimbursementDate: Date;
  reimbursementAmount: number;
  loan?: Loan;
  loanId?: number;
}
