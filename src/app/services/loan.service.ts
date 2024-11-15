import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Loan } from '../models/loan.model';



@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loan`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getLoansInTheYear(year: number): Observable<Loan[]> {
    const url = `${this.apiUrl}/annee/${year}`;
    return this.http.get<Loan[]>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createLoan(loan: Partial<Loan>): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateLoan(loan: Loan): Observable<Loan> {
    return this.http.put<Loan>(this.apiUrl, loan, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteLoan(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<boolean>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode utilitaire pour calculer le remboursement total
  calculateTotalRepayment(amount: number, interestRate: number = 0.05): number {
    return amount + (amount * interestRate);
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
