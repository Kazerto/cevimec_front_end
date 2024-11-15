import { Component, OnInit } from '@angular/core';
import { AppUserService } from '../../../services/app-user.service';
import { AppUser } from '../../../models/appuser.model';
import { MemberRole } from '../../../models/member.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: AppUser[] = [];
  selectedUser: AppUser | null = null;
  showAddModal = false;
  memberRoles = Object.values(MemberRole);

  constructor(private userService: AppUserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
      }
    });
  }

  openAddModal(): void {
    this.selectedUser = null;
    this.showAddModal = true;
  }

  openEditModal(user: AppUser): void {
    this.selectedUser = { ...user };
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
    this.selectedUser = null;
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  onUserSaved(): void {
    this.closeModal();
    this.loadUsers();
  }
}
