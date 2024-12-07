// session-management.component.ts
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { SessionService } from '../../services/session.service';
import { MemberService } from '../../services/member.service';
import { Session } from '../../models/session.model';
import {AccountStatus, Member} from '../../models/member.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sessions-management',
  templateUrl: './sessions-management.component.html',
  styleUrls: ['./sessions-management.component.scss']
})
export class SessionsManagementComponent implements OnInit {
  sessions: Session[] = [];
  sessionForm: FormGroup;
  selectedSession: Session | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  members: Member[] = [];
  searchTerm: string = '';
  currentTab: AccountStatus = AccountStatus.ACTIVE;
  selectedSessionDetails: Session | null = null;
  selectedMembers: number[] = []; // Nouveau tableau pour suivre les membres sélectionnés
  isLoading = false;




  constructor(
    private sessionService: SessionService,
    private memberService: MemberService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef

  ) {
    this.sessionForm = this.fb.group({
      date: ['', Validators.required],
      agenda: ['', Validators.required],
      sessionType: ['', Validators.required],
      members: [[]],
      smallTontineTotal: [0],
      sanctionTotal: [0],
      bigTontineTotal: [0],
      householdBasketTotal: [0],
      expensesTotal: [0]
    });
    // Observer les changements de la sélection des membres
    this.sessionForm.get('members')?.valueChanges.subscribe(values => {
      this.selectedMembers = values;
    });
  }

  ngOnInit(): void {
    this.loadSessions();
    this.loadMembers();


  }

  viewSessionDetails(session: Session): void {
    this.selectedSessionDetails = session;
    console.log(this.selectedSessionDetails);
    // Assurez-vous que les membres sont correctement extraits
    //const memberIds = session.members?.map(m => m.id) || [];
    //console.log('IDs des membres:', memberIds);
    //this.selectedSessionDetails.members = session.members;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.selectedSessionDetails = null;
    this.cdr.detectChanges();
  }

  getSelectedMembers(): { id: number }[] {
    const memberIds = this.sessionForm.get('members')?.value || [];
    return memberIds.map((id: number) => ({ id }));
  }

  getMemberNameById(id: number): string {
    const member = this.members.find(m => m.id === id);
    return member ? `${member.firstName} ${member.lastName}` : 'Membre inconnu';
  }


  private loadMembers() {
    this.memberService.getMembersByStatus(this.currentTab).subscribe({
      next: (members) => {
        this.members = members.filter(member => member.id !== 1);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres:', error);
      }
    });
  }

  loadSessions(): void {
    this.isLoading = true;
    this.sessionService.getAllSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        console.log(this.sessions)
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sessions:', error);
        // Ajouter une notification d'erreur ici
      }
    });
  }

  onCreateSession(): void {
    if (this.sessionForm.valid) {
      this.isLoading = true;
      const memberIds = this.sessionForm.get('members')?.value || [];

      const validMemberIds = memberIds.filter((id: number) => {
        return id && id !== 0 && Number.isInteger(id) && this.members.some(member => member.id === id);
      });

      // Vérifier qu'il y a au moins un membre valide
      if (validMemberIds.length === 0) {
        console.error('Aucun membre valide sélectionné');
        // Optionnellement, ajouter un toast/notification pour l'utilisateur
        this.isLoading = false;
        return;
      }

      const sessionData = {
        ...this.sessionForm.value,
        date: new Date(this.sessionForm.get('date')?.value).toISOString().split('T')[0],
        members: validMemberIds.map((id: number) => ({ member: { id } }))
      };

      this.sessionService.createSession(sessionData).subscribe({
        next: (session) => {
          this.sessions.push(session);
          this.showCreateForm = false;
          this.sessionForm.reset();
          this.loadSessions();
        },
        error: (error) => {
          console.error('Error creating session:', error);
          // Ajouter une notification d'erreur
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }




  isSelected(memberId: number): boolean {
    const members = this.sessionForm.get('members')?.value || [];
    return members.includes(memberId);
  }

  toggleMember(memberId: number): void {
    const membersControl = this.sessionForm.get('members');
    const currentSelection = [...(membersControl?.value || [])];

    // Vérifier si le membre existe réellement
    const memberExists = this.members.some(member => member.id === memberId);
    if (!memberExists) return;

    const index = currentSelection.indexOf(memberId);
    if (index === -1) {
      currentSelection.push(memberId);
    } else {
      currentSelection.splice(index, 1);
    }

    membersControl?.setValue(currentSelection);
    this.cdr.detectChanges();
  }

  onUpdateSession(): void {
    if (this.sessionForm.valid && this.selectedSession?.id) {
      this.isLoading = true;
      const memberIds = this.sessionForm.get('members')?.value || [];
      const members = memberIds.map((id: number) => ({ member: { id } }));

      const sessionData = {
        ...this.sessionForm.value,
        members,
        date: new Date(this.sessionForm.get('date')?.value).toISOString().split('T')[0]
      };

      this.sessionService.updateSession(this.selectedSession.id, sessionData).subscribe({
        next: (updatedSession) => {
          const index = this.sessions.findIndex(s => s.id === this.selectedSession?.id);
          if (index !== -1) {
            this.sessions[index] = updatedSession;
          }
          this.showUpdateForm = false;
          this.selectedSession = null;
          this.sessionForm.reset();
          this.loadSessions();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la session:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onDeleteSession(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => {
          this.sessions = this.sessions.filter(s => s.id !== id);
          // Ajouter une notification de succès ici
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la session:', error);
          // Ajouter une notification d'erreur ici
        }
      });
    }
  }

  editSession(session: Session): void {
    this.selectedSession = session;
    // Extraire les IDs des membres pour le formulaire
    const memberIds = session.members?.map(m => m.id) || [];
    console.log('IDs des membres pour édition:', memberIds);


    this.sessionForm.patchValue({
      ...session,
      members: memberIds, // Utiliser les IDs pour le formulaire
      date: new Date(session.date).toISOString().split('T')[0] // Format YYYY-MM-DD
    });

    this.showUpdateForm = true;
    this.cdr.detectChanges();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.sessionService.searchSessions(this.searchTerm).subscribe({
        next: (results) => {
          this.sessions = results;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche:', error);
        }
      });
    } else {
      this.loadSessions();
    }
  }

  addMembersToSession(sessionId: number, memberIds: number[]): void {
    this.sessionService.addMembersToSession(sessionId, memberIds).subscribe({
      next: () => {
        // Rafraîchir la session pour voir les nouveaux membres
        this.loadSessions();
        // Ajouter une notification de succès ici
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout des membres:', error);
        // Ajouter une notification d'erreur ici
      }
    });
  }

  cancelEdit(): void {
    this.showUpdateForm = false;
    this.selectedSession = null;
    this.sessionForm.reset();
  }

  // Helper methods for form
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  calculateTotal(session: Session): number {
    return (
      session.smallTontineTotal +
      session.sanctionTotal +
      session.bigTontineTotal +
      session.householdBasketTotal -
      session.expensesTotal
    );
  }
}
