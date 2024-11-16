// users-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../../services/app-user.service';
import { MemberService } from '../../services/member.service';
import { AppUser } from '../../models/appuser.model';
import { Member, MemberRole, AccountStatus } from '../../models/member.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  users: AppUser[] = [];
  availableMembers: Member[] = [];
  userForm: FormGroup;
  roles = Object.values(MemberRole);
  isEditing = false;
  currentUserId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private appUserService: AppUserService,
    private memberService: MemberService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      memberId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadAvailableMembers();
  }

  loadUsers(): void {
    this.appUserService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        console.error(error);
      }
    });
  }

  loadAvailableMembers(): void {
    // On charge les membres actifs qui n'ont pas encore de compte utilisateur
    this.memberService.getMembersByStatus(AccountStatus.ACTIVE).subscribe({
      next: (members) => {
        // Filtrer les membres qui n'ont pas encore de compte utilisateur
        this.availableMembers = members.filter(member =>
          !this.users.some(user => user.member?.id === member.id)
        );
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des membres';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      const memberId = userData.memberId;

      if (this.isEditing && this.currentUserId) {
        this.appUserService.updateUser(this.currentUserId, userData).subscribe({
          next: () => {
            this.successMessage = 'Utilisateur mis à jour avec succès';
            this.loadUsers();
            this.resetForm();
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la mise à jour de l\'utilisateur';
            console.error(error);
          }
        });
      } else {
        // Utiliser le endpoint createUserFromMember pour la création
        this.appUserService.createUserFromMember(memberId, userData).subscribe({
          next: () => {
            this.successMessage = 'Utilisateur créé avec succès';
            this.loadUsers();
            this.loadAvailableMembers(); // Recharger la liste des membres disponibles
            this.resetForm();
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la création de l\'utilisateur';
            console.error(error);
          }
        });
      }
    }
  }

  editUser(user: AppUser): void {
    this.isEditing = true;
    this.currentUserId = user.id;
    this.userForm.patchValue({
      userName: user.userName,
      role: user.role,
      memberId: user.member?.id
    });
    this.userForm.get('password')?.setValidators([]); // Password optional on edit
    this.userForm.get('password')?.updateValueAndValidity();
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.appUserService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur supprimé avec succès';
          this.loadUsers();
          this.loadAvailableMembers(); // Recharger la liste des membres disponibles
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'utilisateur';
          console.error(error);
        }
      });
    }
  }

  getMemberFullName(member: Member): string {
    return `${member.firstName} ${member.lastName}`;
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentUserId = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
