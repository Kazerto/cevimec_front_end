import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private role: string | null = null; // Stocke le rôle actuel de l'utilisateur
  private http: any;

  constructor() {}

  // Définir le rôle après authentification
  setRole(role: string): void {
    this.role = role;
    localStorage.setItem('userRole', role); // Stocker le rôle dans le localStorage
  }

  // Récupérer le rôle de l'utilisateur
  getRole(): string | null {
    if (!this.role) {
      this.role = localStorage.getItem('userRole'); // Récupérer le rôle du localStorage si nécessaire
    }
    return this.role;
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.role !== null; // L'utilisateur est connecté s'il a un rôle défini
  }

  // Déconnecter l'utilisateur
  logout(): void {
    this.role = null;
    localStorage.removeItem('userRole'); // Supprimer le rôle du localStorage lors de la déconnexion
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/auth/login', { username, password });
  }
}
