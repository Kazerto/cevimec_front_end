import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../../../services/app-user.service';
import { AppUser } from '../../../models/appuser.model';
import { MemberRole } from '../../../models/member.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user: AppUser | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  userForm: FormGroup;
  memberRoles = Object.values(MemberRole);

  constructor(
    private fb: FormBuilder,
    private userService: AppUserService
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue({
        userName: this.user.userName,
        role: this.user.role
      });
      // Ne pas patcher le mot de passe pour des raisons de sécurité
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.user?.id) {
        // Mise à jour
        this.userService.updateUser(this.user.id, userData).subscribe({
          next: () => {
            this.saved.emit();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
          }
        });
      } else {
        // Création
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.saved.emit();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
