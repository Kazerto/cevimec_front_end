import {Member} from "./member.model";
import {Versement} from "./versement.model";

export interface Savings {
    id: number;
    balance: number;
    creationDate: Date;
    member?: Member;
    versements?: Versement[];
}

export interface SavingsOperation {
    savings: Savings;
    amount: number;
}
