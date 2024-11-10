import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sanction, SessionMemberSanction, SanctionType } from '../../models/sanction.model';
import { Member } from '../../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class SanctionService {
  private apiUrl = 'http://localhost:8080/api/sanctions';

  constructor(private http: HttpClient) { }

  // Obtenir tous les types de sanctions avec leurs montants prédéfinis
  getAllSanctionTypes(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.apiUrl}/types`);
  }

  // Appliquer une sanction à un membre dans une session spécifique
  applySanction(sessionId: number, memberId: number, sanctionType: SanctionType, comments?: string): Observable<SessionMemberSanction> {
    const params = new HttpParams()
      .set('sessionId', sessionId.toString())
      .set('memberId', memberId.toString())
      .set('sanctionType', sanctionType)
      .set('comments', comments || '');

    return this.http.post<SessionMemberSanction>(`${this.apiUrl}/apply`, null, { params });
  }

  // Obtenir toutes les sanctions pour une session donnée
  getSessionSanctions(sessionId: number): Observable<SessionMemberSanction[]> {
    return this.http.get<SessionMemberSanction[]>(`${this.apiUrl}/session/${sessionId}`);
  }

  // Supprimer une sanction
  deleteSanction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/applied/${id}`);
  }
}
