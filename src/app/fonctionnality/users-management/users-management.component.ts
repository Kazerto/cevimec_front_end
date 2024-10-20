import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  permissions: string[];
}

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  userForm!: FormGroup; // Using the definite assignment assertion
  editingUser: User | null = null;
  availablePermissions: string[] = ['gestion des depenses', 'gestion des sanctions', 'gestion des membres', 'tableau de bord', 'gestion des sessions','gestion des épargnes', 'gestion des tontines', 'gestion de la petite tontine', 'gestion des prêts','gestion des aides','gestion des depenses',   ];
  availableRoles: string[] = [
    'president',
    'vice president',
    'censeur',
    'tresorier',
    'responsable des comptes epargnes',
    'secretaire general',
    'secretaire general adjoint',
    'commissaire aux comptes'
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
    // Ici, vous pourriez charger les utilisateurs existants depuis une API
    // Pour l'exemple, nous allons simplement initialiser avec un utilisateur
    this.users = [
      { id: 1, username: 'admin', password: '1234',role: 'Administrateur', permissions: ['gestion des depenses', 'gestion des sanctions'] }
    ];
  }

  initForm(user?: User): void {
    this.userForm = this.fb.group({
      username: [user?.username || '', Validators.required],
      password: [user?.password || '', Validators.required],
      role: [user?.role || '', Validators.required],
      permissions: this.fb.array(user?.permissions || [])
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      if (this.editingUser) {
        // Mise à jour de l'utilisateur existant
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = { ...this.editingUser, ...formValue };
        }
      } else {
        // Création d'un nouvel utilisateur
        const newUser: User = {
          id: this.users.length + 1,
          ...formValue
        };
        this.users.push(newUser);
      }
      this.resetForm();
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.initForm(user);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(u => u.id !== user.id);
    if (this.editingUser && this.editingUser.id === user.id) {
      this.resetForm();
    }
  }

  saveUsers(): void {
    console.log('Utilisateurs à sauvegarder:', this.users);
  }

  onPermissionChange(event: Event, permission: string): void {
    const permissionsArray = this.userForm.get('permissions') as FormArray;
    if ((event.target as HTMLInputElement).checked) {
      permissionsArray.push(this.fb.control(permission));
    } else {
      const index = permissionsArray.controls.findIndex(x => x.value === permission);
      permissionsArray.removeAt(index);
    }
  }

  private resetForm(): void {
    this.editingUser = null;
    this.initForm();
  }

  isPermissionChecked(permission: string): boolean {
    return this.userForm.get('permissions')?.value.includes(permission);
  }
}
