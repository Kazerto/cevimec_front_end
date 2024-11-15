import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MemberService} from "../../services/member.service";
import {Member} from "../../models/member.model";

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
  formInitialized = false;

  readonly bloodGroups = Object.values(BloodGroup);
  readonly maritalStatuses = Object.values(MaritalStatus);
  readonly accountStatuses = Object.values(AccountStatus);
  readonly memberRoles = Object.values(MemberRole);

  readonly AccountStatus = AccountStatus;
  readonly BloodGroup = BloodGroup;
  readonly MaritalStatus = MaritalStatus;
  readonly MemberRole = MemberRole;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private memberService: MemberService  // Ajoutez cette ligne
  ) {
    this.memberForm = this.createMemberForm();
  }

  ngOnInit() {
    this.loadMembers();

    this.memberForm.get('maritalStatus')?.valueChanges.subscribe(status => {
      const spouseContactControl = this.memberForm.get('spouseContact');
      const spouseIsMemberControl = this.memberForm.get('spouseIsMember');

      if (status === MaritalStatus.MARRIED) {
        spouseIsMemberControl?.setValidators(Validators.required);
        // Activer conditionnellement la validation du contact du conjoint
        spouseContactControl?.setValidators([
          Validators.maxLength(20),
          Validators.pattern('^[0-9+]+$')
        ]);
      } else {
        spouseIsMemberControl?.clearValidators();
        spouseContactControl?.clearValidators();
        spouseIsMemberControl?.setValue(false);
        spouseContactControl?.setValue('');
      }

      spouseIsMemberControl?.updateValueAndValidity();
      spouseContactControl?.updateValueAndValidity();
    });
    setTimeout(() => {
      this.formInitialized = true;
      this.cdr.detectChanges();
    });
  }

  // Recharge les membres après le changement d'onglet
  changeTab(newStatus: AccountStatus) {
    this.currentTab = newStatus;
    this.loadMembers();
    this.cdr.detectChanges();
  }

  // méthode pour gérer explicitement le changement de statut marital
  onMaritalStatusChange(event: any) {
    const status = event.target.value;
    if (status !== MaritalStatus.MARRIED) {
      this.memberForm.patchValue({
        spouseIsMember: false,
        spouseContact: ''
      });
    }
  }

  private createMemberForm(): FormGroup {
    const form = this.fb.group({
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      birthDate: [null, Validators.required],
      birthPlace: ['', [Validators.required, Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      region: ['', [Validators.required, Validators.maxLength(50)]],
      residencePlace: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      profession: ['', [Validators.required, Validators.maxLength(50)]],
      phoneGabon: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[0-9+]+$')
      ]],
      poBox: ['', [Validators.maxLength(20)]],
      fatherName: ['', [Validators.required, Validators.maxLength(100)]],
      motherName: ['', [Validators.required, Validators.maxLength(100)]],
      villageInCameroon: ['', [Validators.maxLength(100)]],
      emergencyContact: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[0-9+]+$')
      ]],
      contactInCameroon: ['', [
        Validators.maxLength(20),
        Validators.pattern('^[0-9+]+$')
      ]],
      emergencyContactName: ['', [Validators.required, Validators.maxLength(100)]],
      hasReceivedFatherDeathAid: [false],
      fatherDeathAidYear: [''],
      hasReceivedMotherDeathAid: [false],
      motherDeathAidYear: [''],

      maritalStatus: [MaritalStatus.SINGLE, Validators.required],
      spouseIsMember: [false],
      spouseContact: [''],

      residenceCardNumber: [''],
      hasResidenceCard: [false],

      consulateCardNumber: [''],
      hasConsulateCard: [false],

      joinDate: [null, Validators.required],
      bloodGroup: [BloodGroup.O_POS, Validators.required],
      accountStatus: [AccountStatus.ACTIVE, Validators.required],
      role: [MemberRole.ADMINISTRATOR, Validators.required]
    });

    // Souscrire aux changements du formulaire
    form.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });

    return form;
  }

  isFormValid(): boolean {
    return this.memberForm.valid;
  }

  private loadMembers() {
    this.memberService.getMembersByStatus(this.currentTab).subscribe({
      next: (members) => {
        this.members = members;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres:', error);
        // Gérer l'erreur
      }
    });
  }



  addMember() {
    this.isAddingMember = true;
    this.memberForm.reset({
      maritalStatus: MaritalStatus.SINGLE,
      bloodGroup: BloodGroup.O_POS,
      accountStatus: AccountStatus.ACTIVE,
      role: MemberRole.ADMINISTRATOR,
      spouseIsMember: false
    });
    this.cdr.detectChanges();
  }

  editMember(member: Member) {
    this.isEditingMember = true;
    this.selectedMember = member;

    // Convertir les dates en format compatible avec l'input date
    const formattedMember = {
      ...member,
      birthDate: member.birthDate ? new Date(member.birthDate).toISOString().split('T')[0] : null,
      joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split('T')[0] : null,
    };

    this.memberForm.patchValue(formattedMember);
    this.cdr.detectChanges();
  }


  viewMemberDetails(member: Member) {
    this.selectedMember = member;
    this.showMemberDetails = true;
  }

  saveMember() {
    if (this.memberForm.valid) {
      const memberData = this.memberForm.value;

      // Convertir les dates
      if (memberData.birthDate) {
        memberData.birthDate = new Date(memberData.birthDate);
      }
      if (memberData.joinDate) {
        memberData.joinDate = new Date(memberData.joinDate);
      }

      // Lors de la création, ne pas inclure l'ID
      if (this.isAddingMember) {
        const { id, ...memberWithoutId } = memberData;
        this.memberService.createMember(memberWithoutId as Member).subscribe({
          next: (newMember) => {
            console.log('Membre ajouté avec succès:', newMember);
            this.loadMembers();
            this.resetForm();
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout du membre:', error);
          }
        });
      } else if (this.isEditingMember && this.selectedMember && this.selectedMember.id) { // Add id check
        const updateData = { ...memberData, id: this.selectedMember.id };
        this.memberService.updateMember(this.selectedMember.id, updateData).subscribe({
          next: (updatedMember) => {
            console.log('Membre mis à jour avec succès:', updatedMember);
            this.loadMembers();
            this.resetForm();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du membre:', error);
          }
        });
      }
    }
  }


  updateMemberStatus(member: Member, newStatus: AccountStatus) {
    if (!member.id) { // Add null check
      console.error('Member ID is undefined');
      return;
    }
    this.memberService.updateMemberStatus(member.id, newStatus).subscribe({
      next: (updatedMember) => {
        console.log('Statut mis à jour avec succès:', updatedMember);
        this.loadMembers(); // Recharger la liste
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        // Gérer l'erreur
      }
    });
  }

  resetForm() {
    this.isAddingMember = false;
    this.isEditingMember = false;
    this.selectedMember = null;
    this.showMemberDetails = false;
    this.memberForm.reset({
      maritalStatus: MaritalStatus.SINGLE,
      bloodGroup: BloodGroup.O_POS,
      accountStatus: AccountStatus.ACTIVE,
      role: MemberRole.ADMINISTRATOR,
      spouseIsMember: false
    });
    this.cdr.detectChanges();
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  protected getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'ACTIVE': 'bg-success',
      'EXCLUDED': 'bg-danger',
      'DEPARTED': 'bg-warning'
    };
    return `badge ${classMap[status] || 'bg-secondary'}`;
  }

  protected getDisplayAccountStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'EXCLUDED': 'Exclu',
      'DEPARTED': 'Parti'
    };
    return statusMap[status] || 'Inconnu';
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
