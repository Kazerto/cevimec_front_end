import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Member, AccountStatus } from '../models/member.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les membres
   */
  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl).pipe(
      map(members => this.convertDates(members)),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les membres par statut
   */
  getMembersByStatus(status: AccountStatus): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/status/${status}`).pipe(
      map(members => this.convertDates(members)),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un membre par son ID
   */
  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }

  /**
   * Crée un nouveau membre
   */
  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un membre existant
   */
  updateMember(id: number, member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour le statut d'un membre
   */
  updateMemberStatus(id: number, status: AccountStatus): Observable<Member> {
    return this.http.patch<Member>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un membre
   */
  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Recherche des membres
   */
  searchMembers(query: string): Observable<Member[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Member[]>(`${this.apiUrl}/search`, { params }).pipe(
      map(members => this.convertDates(members)),
      catchError(this.handleError)
    );
  }

  /**
   * Convertit les chaînes de date en objets Date
   */
  private convertDates(members: Member[]): Member[] {
    return members.map(member => ({
      ...member,
      birthDate: new Date(member.birthDate),
      joinDate: new Date(member.joinDate)
    }));
  }

  /**
   * Gère les erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur client-side
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur backend
      switch (error.status) {
        case 400:
          errorMessage = 'Données invalides';
          break;
        case 404:
          errorMessage = 'Membre non trouvé';
          break;
        case 409:
          errorMessage = 'Ce numéro de téléphone existe déjà';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
      }
    }

    console.error('Erreur dans MemberService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
