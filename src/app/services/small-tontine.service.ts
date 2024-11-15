import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SmallTontine } from '../models/small-tontine.model';

@Injectable({
  providedIn: 'root'
})
export class SmallTontineService {
  private apiUrl = `${environment.apiUrl}/api/small-tontine`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Récupérer toutes les small tontines
  getAllSmallTontines(): Observable<SmallTontine[]> {
    return this.http.get<SmallTontine[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer une small tontine par son ID
  getSmallTontineById(id: number): Observable<SmallTontine> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SmallTontine>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Créer une nouvelle small tontine
  openSmallTontine(smallTontine: Partial<SmallTontine>): Observable<SmallTontine> {
    return this.http.post<SmallTontine>(this.apiUrl, smallTontine, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour une small tontine
  updateSmallTontine(smallTontine: SmallTontine): Observable<SmallTontine> {
    return this.http.put<SmallTontine>(this.apiUrl, smallTontine, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer une small tontine
  deleteSmallTontine(smallTontine: SmallTontine): Observable<boolean> {
    return this.http.delete<boolean>(this.apiUrl, {
      ...this.httpOptions,
      body: smallTontine
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Ajouter un membre à une small tontine
  addMemberToSmallTontine(smallTontineId: number, memberId: number): Observable<SmallTontine> {
    const url = `${this.apiUrl}/${smallTontineId}/members/${memberId}`;
    return this.http.post<SmallTontine>(url, {}, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Retirer un membre d'une small tontine
  removeMemberFromSmallTontine(smallTontineId: number, memberId: number): Observable<SmallTontine> {
    const url = `${this.apiUrl}/${smallTontineId}/members/${memberId}`;
    return this.http.delete<SmallTontine>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
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
