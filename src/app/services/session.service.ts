// services/session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8080/api/sessions';

  constructor(private http: HttpClient) {}

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl);
  }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`);
  }

  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>(this.apiUrl, session);
  }

  updateSession(id: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/${id}`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMembersToSession(sessionId: number, memberIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${sessionId}/add-members`, memberIds);
  }

  searchSessions(key: string): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/search?key=${key}`);
  }
}
