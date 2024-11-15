export enum AidType {
    AIDE_MALADIE = 'AIDE_MALADIE',
    AIDE_DECES_ADHERENT = 'AIDE_DECES_ADHERENT',
    AIDE_DECES_ENFANT = 'AIDE_DECES_ENFANT',
    AIDE_DECES_CONJOINT = 'AIDE_DECES_CONJOINT',
    AIDE_DECES_PERE = 'AIDE_DECES_PERE',
    AIDE_DECES_MERE = 'AIDE_DECES_MERE',
    AIDE_NAISSANCE = 'AIDE_NAISSANCE',
    AIDE_MARIAGE = 'AIDE_MARIAGE'
}

export interface Aid {
    id: number;
    memberId: number; // Référence simplifiée
    aidType: AidType;
    date: Date;
    amount: number;
}
