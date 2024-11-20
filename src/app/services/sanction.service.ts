import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SanctionType, Sanction, SANCTION_AMOUNTS } from '../models/sanction.model';



@Injectable({
  providedIn: 'root'
})
export class SanctionService {
  private apiUrl = `${environment.apiUrl}/sanctions`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Test endpoint
  testConnection(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des types de sanctions
  getAllSanctionTypes(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.apiUrl}/types`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getSanctionType(id: number): Observable<Sanction> {
    return this.http.get<Sanction>(`${this.apiUrl}/types/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createSanctionType(sanction: Partial<Sanction>): Observable<Sanction> {
    return this.http.post<Sanction>(`${this.apiUrl}/types`, sanction, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteSanctionType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/types/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des sanctions appliquées
  applySanction(sanction: Partial<Sanction>): Observable<Sanction> {
    return this.http.post<Sanction>(`${this.apiUrl}/apply`, sanction, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  removeAppliedSanction(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/applied/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Récupération des sanctions par session et membre
  getSanctionsForMember(memberId: number): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.apiUrl}/member/${memberId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getSanctionsAppliedInSession(sessionId: number): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.apiUrl}/session/${sessionId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getSanctionsForMemberInSession(memberId: number, sessionId: number): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(
      `${this.apiUrl}/member/${memberId}/session/${sessionId}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode utilitaire pour obtenir le montant d'une sanction par type
  getSanctionAmount(type: SanctionType): number {
    return SANCTION_AMOUNTS[type];
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

  getAllSanctions(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'date',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sortColumn},${sortDirection}`);

    return this.http.get<any>(`${this.apiUrl}/history`, { ...this.httpOptions, params }).pipe(
      catchError(this.handleError)
    );
  }
}
