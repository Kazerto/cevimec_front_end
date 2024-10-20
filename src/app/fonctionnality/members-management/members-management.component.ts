import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';

interface Member {
  id: number;
  lastName: string;
  firstName: string;
  birthDate: string;
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
  fatherDeathAid: {
    received: boolean;
    year?: string;
  };
  motherDeathAid: {
    received: boolean;
    year?: string;
  };
  maritalStatus: string;
  spouseIsMember: boolean;
  spouseInfo?: {
    name: string;
    contact: string;
  };
  residenceCard: {
    has: boolean;
    number?: string;
  };
  consulateCard: {
    has: boolean;
    number?: string;
  };
  joinDate: string;
  bloodGroup: string;
  status: 'active' | 'excluded' | 'departed';
}

@Component({
  selector: 'app-members-management',
  templateUrl: './members-management.component.html',
  styleUrls: ['./members-management.component.css']
})
export class MembersManagementComponent implements OnInit {
  members: Member[] = [];
  selectedMember: Member | null = null;
  isAddingMember: boolean = false;
  isEditingMember: boolean = false;
  showMemberDetails: boolean = false;
  searchTerm: string = '';
  currentTab: 'active' | 'excluded' | 'all' = 'active';

  // Données de formulaire
  newMember: Member = this.getEmptyMemberObject();

  constructor() {
    // Simuler quelques données
    this.loadMockData();
  }

  ngOnInit() {}

  private getEmptyMemberObject(): Member {
    return {
      id: 0,
      lastName: '',
      firstName: '',
      birthDate: '',
      birthPlace: '',
      country: '',
      region: '',
      residencePlace: '',
      city: '',
      profession: '',
      phoneGabon: '',
      poBox: '',
      fatherName: '',
      motherName: '',
      villageInCameroon: '',
      emergencyContact: '',
      contactInCameroon: '',
      emergencyContactName: '',
      fatherDeathAid: {
        received: false
      },
      motherDeathAid: {
        received: false
      },
      maritalStatus: '',
      spouseIsMember: false,
      residenceCard: {
        has: false
      },
      consulateCard: {
        has: false
      },
      joinDate: '',
      bloodGroup: '',
      status: 'active'
    };
  }

  private loadMockData() {
    this.members = [
      {
        id: 1,
        lastName: 'SEONE',
        firstName: 'Assita',
        birthDate: '2004-08-04',
        birthPlace: 'Libreville',
        country: 'Gabon',
        region: 'Libreville',
        residencePlace: 'Libreville',
        city: 'Libreville',
        profession: 'Student',
        phoneGabon: '+241074874911',
        poBox: 'PO 1234',
        fatherName: 'SEONE Pascal',
        motherName: 'SEONE ...',
        villageInCameroon: 'Yaoundé',
        emergencyContact: '+241060379588',
        contactInCameroon: '+241060379588',
        emergencyContactName: 'Komlan',
        fatherDeathAid: {
          received: true
        },
        motherDeathAid: {
          received: true
        },
        maritalStatus: 'Married',
        spouseIsMember: true,
        residenceCard: {
          has: true,
          number: 'RC12345'
        },
        consulateCard: {
          has: true,
          number: 'CC67890'
        },
        joinDate: '2024',
        bloodGroup: 'AB+',
        status: 'active'
      },
    ];
  }

  addMember() {
    this.isAddingMember = true;
    this.newMember = this.getEmptyMemberObject();
  }

  editMember(member: Member) {
    this.isEditingMember = true;
    this.selectedMember = { ...member };
  }

  viewMemberDetails(member: Member) {
    this.selectedMember = member;
    this.showMemberDetails = true;
  }

  excludeMember(member: Member) {
    // Logique d'exclusion
    member.status = 'excluded';
  }

  reintegrateMember(member: Member) {
    // Logique de réintégration
    member.status = 'active';
  }

  saveMember() {
    if (this.isAddingMember) {
      this.members.push({
        ...this.newMember,
        id: this.members.length + 1
      });
    } else if (this.isEditingMember && this.selectedMember) {
      const index = this.members.findIndex(m => m.id === this.selectedMember!.id);
      if (index !== -1) {
        this.members[index] = this.selectedMember;
      }
    }
    this.resetForm();
  }

  generateMembersList() {
    // Logique pour générer la liste des membres
    console.log('Generating members list...');
  }

  protected resetForm() {
    this.isAddingMember = false;
    this.isEditingMember = false;
    this.selectedMember = null;
    this.showMemberDetails = false;
    this.newMember = this.getEmptyMemberObject();
  }
}
