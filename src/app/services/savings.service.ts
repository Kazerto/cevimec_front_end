import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {Savings, SavingsStatus} from '../models/savings.model';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {
  private apiUrl = `${environment.apiUrl}/savings`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllSavings(): Observable<Savings[]> {
    return this.http.get<Savings[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getSavingsByMemberId(id: number): Observable<Savings> {
    const url = `${this.apiUrl}/member/${id}`;
    return this.http.get<Savings>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createSavings(savingsData: any): Observable<Savings> {
    const formattedData = {
      balance: savingsData.balance,
      creationDate: new Date().toISOString().split('T')[0],
      status: SavingsStatus.ACTIF,  // Définir le status initial
      member: {
        id: savingsData.memberId
      }
    };

    return this.http.post<Savings>(this.apiUrl, formattedData, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateSavings(savings: Partial<Savings>): Observable<Savings> {
    return this.http.put<Savings>(this.apiUrl, savings, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteSavings(savings: Savings): Observable<boolean> {
    return this.http.delete<boolean>(this.apiUrl, {
      ...this.httpOptions,
      body: savings
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Méthodes spécifiques pour les versements
  addSavings(savings: Savings, amount: number): Observable<Savings> {
    // Formatage des données pour le versement
    const versementData = {
      versementDate: new Date().toISOString(),
      versementAmount: amount,
      savingsId: savings.id
    };

    return this.http.post<Savings>(`${this.apiUrl}/add`, versementData, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getActiveSavings(): Observable<Savings[]> {
    return this.http.get<Savings[]>(`${this.apiUrl}/active`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

// Ajouter une méthode pour désactiver un compte
  deactivateSavings(id: number): Observable<Savings> {
    return this.http.patch<Savings>(`${this.apiUrl}/${id}/deactivate`, {}, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  reactivateSavings(id: number): Observable<Savings> {
    return this.http.patch<Savings>(`${this.apiUrl}/${id}/reactivate`, {}, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  blockSavings(id: number): Observable<Savings> {
    return this.http.patch<Savings>(`${this.apiUrl}/${id}/block`, {}).pipe(
      catchError(this.handleError)
    );
  }


  withdrawSavings(savings: Savings, amount: number): Observable<Savings> {
    const url = `${this.apiUrl}/withdraw`;
    return this.http.post<Savings>(url, { savings, amount }, this.httpOptions).pipe(
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
