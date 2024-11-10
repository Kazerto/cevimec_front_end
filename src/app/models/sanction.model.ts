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

export interface Sanction {
  id?: number;
  sanctionType: SanctionType;
  amount: number;
}

export interface SessionMemberSanction {
  id?: number;
  session: any; // Nous définirons l'interface Session plus tard
  member: any; // Nous définirons l'interface Member plus tard
  sanction: Sanction;
  date: Date;
  comments?: string;
  isPaid?: boolean; // Ajouté pour correspondre au frontend
}
