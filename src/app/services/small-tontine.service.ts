import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces pour la petite tontine
export interface SmallTontine {
  id: number;
  startDate: Date;
  endDate: Date;
}

export interface Contribution {
  id: number;
  memberId: number;
  amount: number;
  date: Date;
  memberName?: string;  // Pour afficher le nom du membre
  status: 'PENDING' | 'PAID' | 'LATE';
}

@Injectable({
  providedIn: 'root'
})
export class SmallTontineService {
  private apiUrl = `${environment.apiUrl}/small-tontines`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les petites tontines
   */
  getAllSmallTontines(): Observable<SmallTontine[]> {
    return this.http.get<SmallTontine[]>(this.apiUrl).pipe(
      map(tontines => this.convertDates(tontines)),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère une petite tontine par son ID
   */
  getSmallTontineById(id: number): Observable<SmallTontine> {
    return this.http.get<SmallTontine>(`${this.apiUrl}/${id}`).pipe(
      map(tontine => this.convertDates([tontine])[0]),
      catchError(this.handleError)
    );
  }

  /**
   * Crée une nouvelle petite tontine
   */
  createSmallTontine(tontine: SmallTontine): Observable<SmallTontine> {
    return this.http.post<SmallTontine>(this.apiUrl, tontine).pipe(
      map(tontine => this.convertDates([tontine])[0]),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour une petite tontine existante
   */
  updateSmallTontine(id: number, tontine: SmallTontine): Observable<SmallTontine> {
    return this.http.put<SmallTontine>(`${this.apiUrl}/${id}`, tontine).pipe(
      map(tontine => this.convertDates([tontine])[0]),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime une petite tontine
   */
  deleteSmallTontine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Enregistre une cotisation pour une petite tontine
   */
  saveContribution(tontineId: number, contribution: Contribution): Observable<Contribution> {
    return this.http.post<Contribution>(`${this.apiUrl}/${tontineId}/contributions`, contribution).pipe(
      map(contribution => ({
        ...contribution,
        date: new Date(contribution.date)
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les cotisations d'une petite tontine
   */
  getContributions(tontineId: number): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.apiUrl}/${tontineId}/contributions`).pipe(
      map(contributions => contributions.map(contribution => ({
        ...contribution,
        date: new Date(contribution.date)
      }))),
      catchError(this.handleError)
    );
  }

  /**
   * Convertit les chaînes de date en objets Date
   */
  private convertDates(tontines: SmallTontine[]): SmallTontine[] {
    return tontines.map(tontine => ({
      ...tontine,
      startDate: new Date(tontine.startDate),
      endDate: new Date(tontine.endDate)
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
          errorMessage = 'Tontine non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
      }
    }

    console.error('Erreur dans SmallTontineService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
