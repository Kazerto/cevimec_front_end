import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

enum MemberRole {
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

enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  SEPARATED = 'SEPARATED'
}

enum BloodGroup {
  A_POS = 'A_POS',
  A_NEG = 'A_NEG',
  B_POS = 'B_POS',
  B_NEG = 'B_NEG',
  AB_POS = 'AB_POS',
  AB_NEG = 'AB_NEG',
  O_POS = 'O_POS',
  O_NEG = 'O_NEG'
}

enum AccountStatus {
  ACTIVE = 'ACTIVE',
  EXCLUDED = 'EXCLUDED',
  DEPARTED = 'DEPARTED'
}

interface Member {
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
  poBox?: string;
  fatherName: string;
  motherName: string;
  villageInCameroon?: string;
  emergencyContact?: string;
  contactInCameroon?: string;
  emergencyContactName?: string;
  maritalStatus: MaritalStatus;
  spouseIsMember: boolean;
  joinDate: Date;
  bloodGroup: BloodGroup;
  accountStatus: AccountStatus;
  role: MemberRole;
}

@Component({
  selector: 'app-members-management',
  templateUrl: './members-management.component.html',
  styleUrls: ['./members-management.component.css']
})
export class MembersManagementComponent implements OnInit {
  members: Member[] = [];
  selectedMember: Member | null = null;
  memberForm: FormGroup;
  isAddingMember = false;
  isEditingMember = false;
  showMemberDetails = false;
  currentTab: AccountStatus = AccountStatus.ACTIVE;

  readonly bloodGroups = Object.values(BloodGroup);
  readonly maritalStatuses = Object.values(MaritalStatus);
  readonly accountStatuses = Object.values(AccountStatus);
  readonly memberRoles = Object.values(MemberRole);

  readonly AccountStatus = AccountStatus;
  readonly BloodGroup = BloodGroup;
  readonly MaritalStatus = MaritalStatus;
  readonly MemberRole = MemberRole;

  constructor(private fb: FormBuilder) {
    this.memberForm = this.createMemberForm();
  }

  ngOnInit() {
    this.loadMembers();
  }

  private createMemberForm(): FormGroup {
    return this.fb.group({
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      birthDate: ['', Validators.required],
      birthPlace: ['', [Validators.required, Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      region: ['', [Validators.required, Validators.maxLength(50)]],
      residencePlace: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      profession: ['', [Validators.required, Validators.maxLength(50)]],
      phoneGabon: ['', [Validators.maxLength(20)]],
      poBox: ['', [Validators.maxLength(20)]],
      fatherName: ['', [Validators.required, Validators.maxLength(100)]],
      motherName: ['', [Validators.required, Validators.maxLength(100)]],
      villageInCameroon: ['', [Validators.maxLength(100)]],
      emergencyContact: ['', [Validators.maxLength(20)]],
      contactInCameroon: ['', [Validators.maxLength(20)]],
      emergencyContactName: ['', [Validators.maxLength(100)]],
      maritalStatus: [MaritalStatus.SINGLE, Validators.required],
      spouseIsMember: [false],
      joinDate: ['', Validators.required],
      bloodGroup: [BloodGroup.O_POS, Validators.required],
      accountStatus: [AccountStatus.ACTIVE, Validators.required],
      role: [MemberRole.ADMINISTRATOR]
    });
  }

  private loadMembers() {
    // TODO: Implement API call to load members
  }

  addMember() {
    this.isAddingMember = true;
    this.memberForm.reset();
  }

  editMember(member: Member) {
    this.isEditingMember = true;
    this.selectedMember = member;
    this.memberForm.patchValue(member);
  }

  viewMemberDetails(member: Member) {
    this.selectedMember = member;
    this.showMemberDetails = true;
  }

  saveMember() {
    if (this.memberForm.valid) {
      const memberData = this.memberForm.value;
      if (this.isAddingMember) {
        // TODO: Implement API call to add member
      } else if (this.isEditingMember && this.selectedMember) {
        // TODO: Implement API call to update member
      }
      this.resetForm();
    }
  }


  updateMemberStatus(member: Member, newStatus: AccountStatus) {
    // TODO: Implement API call to update member status
    member.accountStatus = newStatus;
  }

  protected resetForm() {
    this.isAddingMember = false;
    this.isEditingMember = false;
    this.selectedMember = null;
    this.showMemberDetails = false;
    this.memberForm.reset();
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  protected getDisplayAccountStatus(status: AccountStatus): string {
    const statusMap = {
      [AccountStatus.ACTIVE]: 'Actif',
      [AccountStatus.EXCLUDED]: 'Exclu',
      [AccountStatus.DEPARTED]: 'Parti'
    };
    return statusMap[status];
  }

  protected getStatusBadgeClass(status: AccountStatus): string {
    const classMap = {
      [AccountStatus.ACTIVE]: 'bg-success',
      [AccountStatus.EXCLUDED]: 'bg-danger',
      [AccountStatus.DEPARTED]: 'bg-warning'
    };
    return `badge ${classMap[status]}`;
  }

  cancelEdit() {
    this.isAddingMember = false;
    this.isEditingMember = false;
    this.memberForm.reset();
  }

  closeDetails() {
    this.showMemberDetails = false;
    this.selectedMember = null;
  }

}
