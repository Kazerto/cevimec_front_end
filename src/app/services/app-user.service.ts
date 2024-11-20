import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppUser } from '../models/appuser.model';
import { Member, MemberRole } from '../models/member.model';
import { Permission } from '../models/permission.model';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private role: string | null = null;
  private currentUserId: number | null = null;


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<AppUser> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<AppUser>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: { userName: string; password: string }): Observable<AppUser> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<AppUser>(url, credentials, this.httpOptions).pipe(
      map(user => {
        // Sauvegarder l'ID et le rôle dans le localStorage
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('userRole', user.role);
        this.currentUserId = user.id;
        this.role = user.role;
        return user;
      }),
      catchError(this.handleError)
    );
  }

  // Déconnecter l'utilisateur
  logout(): void {
    this.role = null;
    this.currentUserId = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }


  getCurrentUserId(): number | null {
    if (!this.currentUserId) {
      const storedId = localStorage.getItem('userId');
      this.currentUserId = storedId ? parseInt(storedId, 10) : null;
    }
    return this.currentUserId;
  }

  createUser(user: Partial<AppUser>): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, user, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  updateUser(id: number, userDetails: Partial<AppUser>): Observable<AppUser> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<AppUser>(url, userDetails, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  deleteUser(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  createUserFromMember(memberId: number, userDetails: Partial<AppUser>): Observable<AppUser> {
    const url = `${this.apiUrl}/createFromMember/${memberId}`;
    return this.http.post<AppUser>(url, userDetails, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  setRole(role: string): void {
    this.role = role;
    localStorage.setItem('userRole', role);
  }

  getRole(): string | null {
    if (!this.role) {
      this.role = localStorage.getItem('userRole');
    }
    return this.role;
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        default:
          errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
