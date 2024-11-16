export enum SanctionType {
  BAVARDAGE = 'BAVARDAGE',
  COUPE_PAROLE = 'COUPE_PAROLE',
  TROUBLE = 'TROUBLE',
  ABANDON_DE_POSTE = 'ABANDON_DE_POSTE',
  INSOLENCE = 'INSOLENCE',
  PRISE_DE_PAROLE_SANS_DEMANDE = 'PRISE_DE_PAROLE_SANS_DEMANDE',
  ENTRE_SANS_SALUTATION = 'ENTRE_SANS_SALUTATION',
  REFUS_DE_COMMISSION = 'REFUS_DE_COMMISSION',
  SORTIES_INTEMPESTIVES = 'SORTIES_INTEMPESTIVES',
  SONNERIE_DE_TELEPHONE = 'SONNERIE_DE_TELEPHONE',
  NON_PORT_DE_TENUE = 'NON_PORT_DE_TENUE',
  DESTRUCTION_VOLONTAIRE = 'DESTRUCTION_VOLONTAIRE',
  BAGARRE_INJURE_DIFFAMATION = 'BAGARRE_INJURE_DIFFAMATION'
}

export const SANCTION_AMOUNTS = {
  [SanctionType.BAVARDAGE]: 200,
  [SanctionType.COUPE_PAROLE]: 500,
  [SanctionType.TROUBLE]: 1000,
  [SanctionType.ABANDON_DE_POSTE]: 2000,
  [SanctionType.INSOLENCE]: 5000,
  [SanctionType.PRISE_DE_PAROLE_SANS_DEMANDE]: 200,
  [SanctionType.ENTRE_SANS_SALUTATION]: 200,
  [SanctionType.REFUS_DE_COMMISSION]: 1000,
  [SanctionType.SORTIES_INTEMPESTIVES]: 500,
  [SanctionType.SONNERIE_DE_TELEPHONE]: 500,
  [SanctionType.NON_PORT_DE_TENUE]: 2000,
  [SanctionType.DESTRUCTION_VOLONTAIRE]: 0,
  [SanctionType.BAGARRE_INJURE_DIFFAMATION]: 0
};

export interface Sanction {
  id: number;
  session: {
    id: number;
  };
  member: {
    id: number;
  };
  sanctionType: SanctionType;
  date: Date;
  amount: number;
}

export interface SessionMemberSanction {
  id?: number;
  session: any;
  member: any;
  sanction: Sanction;
  date: Date;
  comments?: string;
  isPaid?: boolean;
}
