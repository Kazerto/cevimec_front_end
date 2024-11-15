import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Aid, AidType } from '../models/aid.model';


@Injectable({
  providedIn: 'root'
})
export class AidService {
  private apiUrl = `${environment.apiUrl}/aid`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllAids(): Observable<Aid[]> {
    return this.http.get<Aid[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAidById(id: number): Observable<Aid> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Aid>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getMemberAids(memberId: number): Observable<Aid[]> {
    const url = `${this.apiUrl}/member/${memberId}`;
    return this.http.get<Aid[]>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createAid(aid: Partial<Aid>): Observable<Aid> {
    return this.http.post<Aid>(this.apiUrl, aid, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateAid(aid: Aid): Observable<Aid> {
    return this.http.put<Aid>(this.apiUrl, aid, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteAid(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<boolean>(url, this.httpOptions).pipe(
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
