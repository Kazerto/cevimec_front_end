import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Member, AccountStatus } from '../models/member.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/members`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}


  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl).pipe(
      map(members => this.convertDates(members)),
      catchError(this.handleError)
    );
  }


  getMembersByStatus(status: AccountStatus): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/status/${status}`).pipe(
      map(members => this.convertDates(members)),
      catchError(this.handleError)
    );
  }


  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }


  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }


  updateMember(id: number, member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }


  updateMemberStatus(id: number, status: AccountStatus): Observable<Member> {
    return this.http.patch<Member>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(member => this.convertDates([member])[0]),
      catchError(this.handleError)
    );
  }


  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  searchMembers(query: string): Observable<Member[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Member[]>(`${this.apiUrl}/search`, { params }).pipe(
      map(members => this.convertDates(members)),
      catchError(this.handleError)
    );
  }


  private convertDates(members: Member[]): Member[] {
    return members.map(member => ({
      ...member,
      birthDate: new Date(member.birthDate),
      joinDate: new Date(member.joinDate)
    }));
  }


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
          errorMessage = 'Membre non trouvé';
          break;
        case 409:
          errorMessage = 'Ce numéro de téléphone existe déjà';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
      }
    }

    console.error('Erreur dans MemberService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
