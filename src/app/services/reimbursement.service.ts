
// reimbursement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Reimbursement } from '../models/reimbursement.model';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  private apiUrl = `${environment.apiUrl}/reimbursements`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllReimbursements(): Observable<Reimbursement[]> {
    return this.http.get<Reimbursement[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getReimbursementById(id: number): Observable<Reimbursement> {
    return this.http.get<Reimbursement>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getLoanReimbursements(loanId: number): Observable<Reimbursement[]> {
    return this.http.get<Reimbursement[]>(`${this.apiUrl}/loan/${loanId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createReimbursement(reimbursement: Partial<Reimbursement>): Observable<Reimbursement> {
    const formattedData = {
      ...reimbursement,
      reimbursementDate: new Date().toISOString().split('T')[0]
    };

    return this.http.post<Reimbursement>(this.apiUrl, formattedData, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateReimbursement(reimbursement: Partial<Reimbursement>): Observable<Reimbursement> {
    return this.http.put<Reimbursement>(
      `${this.apiUrl}/${reimbursement.id}`,
      reimbursement,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteReimbursement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchReimbursements(searchKey: string): Observable<Reimbursement[]> {
    return this.http.get<Reimbursement[]>(
      `${this.apiUrl}/search?searchKey=${searchKey}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = 'Remboursement non trouvé';
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
