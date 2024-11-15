export enum MemberRole {
    ADMINISTRATOR = 'ADMINISTRATOR',
    PRESIDENT = 'PRESIDENT',
    VICE_PRESIDENT = 'VICE_PRESIDENT',
    GENERAL_SECRETARY = 'GENERAL_SECRETARY',
    DEPUTY_GENERAL_SECRETARY = 'DEPUTY_GENERAL_SECRETARY',
    TREASURER = 'TREASURER',
    CENSOR = 'CENSOR',
    STATUTORY_AUDITOR = 'STATUTORY_AUDITOR',
    SAVINGS_ACCOUNTS_MANAGER = 'SAVINGS_ACCOUNTS_MANAGER'
}

export enum MaritalStatus {
    SINGLE = 'SINGLE',
    MARRIED = 'MARRIED',
    DIVORCED = 'DIVORCED',
    WIDOWED = 'WIDOWED',
    SEPARATED = 'SEPARATED'
}

export enum BloodGroup {
    A_POS = 'A_POS',
    A_NEG = 'A_NEG',
    B_POS = 'B_POS',
    B_NEG = 'B_NEG',
    AB_POS = 'AB_POS',
    AB_NEG = 'AB_NEG',
    O_POS = 'O_POS',
    O_NEG = 'O_NEG'
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    EXCLUDED = 'EXCLUDED',
    DEPARTED = 'DEPARTED'
}

export interface Member {
    id: number;
    lastName: string;
    firstName: string;
    birthDate: Date;
    birthPlace: string;
    country: string;
    region: string;
    residencePlace: string;
    city: string;
    profession: string;
    phoneGabon: string;
    poBox: string;
    fatherName: string;
    motherName: string;
    villageInCameroon: string;
    emergencyContact: string;
    contactInCameroon: string;
    emergencyContactName: string;
    maritalStatus: MaritalStatus;
    spouseIsMember: boolean;
    spouseContact?: string;
    joinDate: Date;
    hasReceivedFatherDeathAid?: boolean;
    fatherDeathAidYear?: string;
    hasReceivedMotherDeathAid?: boolean;
    motherDeathAidYear?: string;
    hasResidenceCard: boolean;
    residenceCardNumber: string;
    hasConsulateCard: boolean;
    consulateCardNumber?: string;
    bloodGroup: BloodGroup;
    accountStatus: AccountStatus;
    role: MemberRole;
}
