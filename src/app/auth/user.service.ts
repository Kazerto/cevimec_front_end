import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private role: string | null = null; // Stocke le rôle actuel de l'utilisateur

  constructor() {}

  // Définir le rôle après authentification
  setRole(role: string): void {
    this.role = role;
  }

  // Récupérer le rôle de l'utilisateur
  getRole(): string | null {
    return this.role;
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.role !== null; // L'utilisateur est connecté s'il a un rôle défini
  }

  // Déconnecter l'utilisateur
  logout(): void {
    this.role = null; // Réinitialiser le rôle pour déconnecter l'utilisateur
  }
}
