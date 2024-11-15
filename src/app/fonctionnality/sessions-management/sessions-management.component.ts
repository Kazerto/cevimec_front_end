import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { MemberService } from '../../services/member.service';
import { Session } from '../../models/session.model';
import { Member, AccountStatus } from '../../models/member.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sessions-management',
  templateUrl: './sessions-management.component.html',
  styleUrls: ['./sessions-management.component.css']
})
export class SessionsManagementComponent implements OnInit {
  sessions: Session[] = [];
  members: Member[] = [];
  activeMembers: Member[] = [];
  newSession: Session | null = null;
  selectedSession: Session | null = null;
  showSessionForm = false;
  showPaymentForm = false;
  showFundMovementForm = false;
  showClosingConfirmation = false;
  loading = false;
  error = '';

  readonly SMALL_TONTINE_AMOUNT = 15000;  // Montant fixe pour la petite tontine

  constructor(
    private sessionService: SessionService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      sessions: this.sessionService.getAllSessions(),
      members: this.memberService.getAllMembers()
    }).subscribe({
      next: (result) => {
        this.sessions = result.sessions;
        this.members = result.members;
        this.activeMembers = this.members.filter(m => m.accountStatus === AccountStatus.ACTIVE);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  planSession(): void {
    this.newSession = {
      date: new Date(),
      agenda: '',
      sessionType: 'NORMAL',
      membersPresent: [],
      smallTontineTotal: 0,
      sanctionTotal: 0,
      bigTontineTotal: 0,
      householdBasketTotal: 0,
      expensesTotal: 0,
      status: 'open'
    };
    this.showSessionForm = true;
  }

  saveSession(): void {
    if (this.newSession) {
      this.loading = true;
      this.sessionService.createSession(this.newSession).subscribe({
        next: (session) => {
          this.sessions.push(session);
          this.newSession = null;
          this.showSessionForm = false;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors de la création de la session';
          this.loading = false;
          console.error('Erreur:', error);
        }
      });
    }
  }

  selectSession(session: Session): void {
    this.selectedSession = session;
    this.showPaymentForm = true;
  }

  updateSession(session: Session): void {
    this.loading = true;
    this.sessionService.updateSession(session.id!, session).subscribe({
      next: (updatedSession) => {
        const index = this.sessions.findIndex(s => s.id === updatedSession.id);
        if (index !== -1) {
          this.sessions[index] = updatedSession;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors de la mise à jour de la session';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  addMembersToSession(sessionId: number, memberIds: number[]): void {
    this.loading = true;
    this.sessionService.addMembersToSession(sessionId, memberIds).subscribe({
      next: () => {
        // Rafraîchir la session
        /*this.sessionService.getSession(sessionId).subscribe(
          updatedSession => {
            const index = this.sessions.findIndex(s => s.id === sessionId);
            if (index !== -1) {
              this.sessions[index] = updatedSession;
            }
          }
        );*/
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors de l\'ajout des membres';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  closeSession(): void {
    if (this.selectedSession && this.selectedSession.id) {
      this.selectedSession.status = 'closed';
      this.updateSession(this.selectedSession);
      this.showClosingConfirmation = false;
    }
  }

  // Méthodes utilitaires
  getMemberFullName(memberId: number): string {
    const member = this.members.find(m => m.id === memberId);
    return member ? `${member.lastName} ${member.firstName}` : 'Membre inconnu';
  }

  getTotalCollected(session: Session): number {
    return (
      session.smallTontineTotal +
      session.bigTontineTotal +
      session.sanctionTotal +
      session.householdBasketTotal
    );
  }

  getSessionBalance(session: Session): number {
    return this.getTotalCollected(session) - session.expensesTotal;
  }
}
