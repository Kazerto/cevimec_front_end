import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { Versement } from '../models/versement.model';
import {catchError} from "rxjs/operators";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class VersementService {
  private apiUrl = `${environment.apiUrl}/versements`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Récupérer tous les versements
  getAllVersements(): Observable<Versement[]> {
    return this.http.get<Versement[]>(this.apiUrl);
  }

  // Récupérer un versement par ID
  getVersementById(id: number): Observable<Versement> {
    return this.http.get<Versement>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les versements pour un compte épargne donné
  getVersementsBySavingId(savingId: number): Observable<Versement[]> {
    return this.http.get<Versement[]>(`${this.apiUrl}/savings/${savingId}`);
  }

  // Modifier makeVersement et makeWithdraw pour gérer les erreurs de statut
  makeVersement(versement: Versement): Observable<Versement> {
    return this.http.post<Versement>(this.apiUrl, versement).pipe(
      catchError(error => {
        if (error.status === 400 && error.error.includes('inactive')) {
          return throwError(() => new Error('Le compte est inactif ou bloqué'));
        }
        return throwError(() => error);
      })
    );
  }

  makeWithdraw(versement: Versement): Observable<Versement> {
    return this.http.post<Versement>(`${this.apiUrl}/withdraw`, versement).pipe(
      catchError(error => {
        if (error.status === 400 && error.error.includes('inactive')) {
          return throwError(() => new Error('Le compte est inactif ou bloqué'));
        }
        return throwError(() => error);
      })
    );
  }

  // Mettre à jour un versement
  updateVersement(id: number, versement: Versement): Observable<Versement> {
    return this.http.put<Versement>(`${this.apiUrl}/${id}`, versement);
  }

  // Supprimer un versement
  deleteVersement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Rechercher des versements par mot-clé
  searchVersements(searchKey: string): Observable<Versement[]> {
    return this.http.get<Versement[]>(`${this.apiUrl}/search?key=${searchKey}`);
  }
}
