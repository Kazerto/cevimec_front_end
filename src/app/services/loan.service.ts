import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  // Helper method to transform dates for API
  private transformLoanDates(loan: Partial<Loan>): Partial<Loan> {
    return {
      ...loan,
      loanDate: loan.loanDate ? new Date(loan.loanDate).toISOString() : new Date().toISOString(),
      repaymentDate: loan.repaymentDate ? new Date(loan.repaymentDate).toISOString() : null
    };
  }

  // Helper method to transform response dates
  private transformResponseDates(loan: Loan): Loan {
    return {
      ...loan,
      loanDate: new Date(loan.loanDate),
      repaymentDate: loan.repaymentDate ? new Date(loan.repaymentDate) : null
    };
  }

  // Helper method to validate loan data
  private validateLoan(loan: Partial<Loan>): boolean {
    if (!loan.amount || loan.amount <= 0) {
      throw new Error('Le montant du prêt doit être supérieur à 0');
    }
    if (!loan.member || !loan.member.id) {
      throw new Error('Le membre est requis');
    }
    if (loan.interestRate && (loan.interestRate < 0 || loan.interestRate > 1)) {
      throw new Error('Le taux d\'intérêt doit être entre 0 et 1');
    }
    return true;
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl, this.httpOptions).pipe(
      map(loans => loans.map(loan => this.transformResponseDates(loan))),
      catchError(this.handleError)
    );
  }

  getLoansInTheYear(year: number): Observable<Loan[]> {
    const url = `${this.apiUrl}/annee/${year}`;
    return this.http.get<Loan[]>(url, this.httpOptions).pipe(
      map(loans => loans.map(loan => this.transformResponseDates(loan))),
      catchError(this.handleError)
    );
  }

  createLoan(loan: Partial<Loan>): Observable<Loan> {
    this.validateLoan(loan);
    const transformedLoan = this.transformLoanDates(loan);
    return this.http.post<Loan>(this.apiUrl, transformedLoan, this.httpOptions).pipe(
      map(response => this.transformResponseDates(response)),
      catchError(this.handleError)
    );
  }

  updateLoan(loan: Loan): Observable<Loan> {
    this.validateLoan(loan);
    const transformedLoan = this.transformLoanDates(loan);
    return this.http.put<Loan>(this.apiUrl, transformedLoan, this.httpOptions).pipe(
      map(response => this.transformResponseDates(response)),
      catchError(this.handleError)
    );
  }

  deleteLoan(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<boolean>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode utilitaire pour calculer le remboursement total avec précision décimale
  calculateTotalRepayment(amount: number, interestRate: number = 0.05): number {
    const total = amount + (amount * interestRate);
    return Number(total.toFixed(2)); // Arrondi à 2 décimales
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
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
