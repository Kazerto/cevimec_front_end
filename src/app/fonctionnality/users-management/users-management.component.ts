import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {UserService} from "../../services/users.service";
import {HttpClient} from "@angular/common/http";

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

  constructor(private fb: FormBuilder,private userService: UserService, private http: HttpClient) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe(data => {
      this.users = data;
    });
  }

  onSubmit(): void {
    const formValue = this.userForm.value;
    if (this.editingUser) {
      this.http.put(`/api/users/${this.editingUser.id}`, formValue).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    } else {
      this.http.post('/api/users', formValue).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    }
  }

  deleteUser(user: User): void {
    this.http.delete(`/api/users/${user.id}`).subscribe(() => {
      this.loadUsers();
    });
  }

  private resetForm(): void {
    this.editingUser = null;
    this.initForm();
  }

  initForm(user?: User): void {
    this.userForm = this.fb.group({
      username: [user?.username || '', Validators.required],
      password: [user?.password || '', Validators.required],
      role: [user?.role || '', Validators.required],
      permissions: this.fb.array(user?.permissions || [])
    });
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

  isPermissionChecked(permission: string): boolean {
    const permissionsArray = this.userForm.get('permissions') as FormArray;
    return permissionsArray.value.includes(permission);
  }

  saveUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
    alert('Les changements ont été sauvegardés avec succès.');
  }

  // Méthode editUser pour mettre un utilisateur en mode édition
  editUser(user: User): void {
    this.editingUser = user;
    this.initForm(user);  // Réinitialise le formulaire avec les données de l'utilisateur à modifier
  }

  // Méthode cancelEdit pour annuler l'édition et réinitialiser le formulaire
  cancelEdit(): void {
    this.editingUser = null;
    this.resetForm();  // Réinitialise le formulaire sans utilisateur en édition
  }

}
