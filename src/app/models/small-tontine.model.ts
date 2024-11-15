import {Member} from "./member.model";
import {Session} from "./session.model";


export interface SmallTontine {
  id: number;
  members: Member[];
  sessions: Session[];
  amount: number;  // BigDecimal in Java, number in TypeScript
  openDate: Date;
  contributionSmallTontine?: ContributionSmallTontine[];
}

export interface ContributionSmallTontine {
  id: number;
  smallTontine: SmallTontine;
  amount?: number;
}

