import {Savings} from "./savings.model";

export interface Versement {
  id: number;
  versementDate: Date;
  versementAmount: number;
  savings?: Savings;  // Optional to avoid circular reference issues
}
