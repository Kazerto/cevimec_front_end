import {Savings} from "./savings.model";

export interface Versement {
  id?: number;  // Rendre l'id optionnel en ajoutant ?
  versementDate: Date;
  versementAmount: number;
  savings?: Savings;
  savingsId?: number;  // Ajouter cette propriété
}
