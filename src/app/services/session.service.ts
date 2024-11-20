import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${environment.apiUrl}/sessions`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getSessionById(id: number): Observable<Session> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Session>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>(this.apiUrl, session, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateSession(id: number, sessionDetails: Partial<Session>): Observable<Session> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Session>(url, sessionDetails, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteSession(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchSessions(key: string): Observable<Session[]> {
    const params = new HttpParams().set('key', key);
    const url = `${this.apiUrl}/search`;
    return this.http.get<Session[]>(url, { ...this.httpOptions, params }).pipe(
      catchError(this.handleError)
    );
  }

  addMembersToSession(sessionId: number, memberIds: number[]): Observable<void> {
    const url = `${this.apiUrl}/${sessionId}/add-members`;
    return this.http.post<void>(url, memberIds, this.httpOptions).pipe(
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
