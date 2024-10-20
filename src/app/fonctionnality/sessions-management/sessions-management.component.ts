import { Component, OnInit } from '@angular/core';

interface Session {
  id: number;
  date: Date;
  type: 'normal' | 'exceptionnel';
  title: string;
  participants: {
    memberId: number;
    name: string;
    present: boolean;
  }[];
  proceedingsUrl?: string;
}

@Component({
  selector: 'app-sessions-management',
  templateUrl: './sessions-management.component.html',
  styleUrls: ['./sessions-management.component.css']
})
export class SessionsManagementComponent implements OnInit {
  sessions: Session[] = [];
  newSession: Session | null = null;
  selectedSession: Session | null = null;
  showSessionForm = false;
  showParticipantForm = false;

  constructor() { }

  ngOnInit(): void {
    this.loadMockSessions();
  }

  loadMockSessions() {
    this.sessions = [
      {
        id: 1,
        date: new Date('2024-03-01'),
        type: 'normal',
        title: 'Réunion mensuelle de Mars',
        participants: [
          { memberId: 1, name: 'Jean Dupont', present: true },
          { memberId: 2, name: 'Marie Martin', present: false },
        ]
      },
      {
        id: 2,
        date: new Date('2024-04-01'),
        type: 'normal',
        title: 'Réunion mensuelle d\'Avril',
        participants: [
          { memberId: 1, name: 'Jean Dupont', present: true },
          { memberId: 2, name: 'Marie Martin', present: true },
        ],
        proceedingsUrl: 'assets/pv_avril_2024.pdf'
      }
    ];
  }

  planSession() {
    this.newSession = {
      id: this.sessions.length + 1,
      date: new Date(),
      type: 'normal',
      title: '',
      participants: []
    };
    this.showSessionForm = true;
  }

  saveSession() {
    if (this.newSession) {
      this.sessions.push(this.newSession);
      this.newSession = null;
      this.showSessionForm = false;
    }
  }

  uploadProceedings(sessionId: number, event: any) {
    const file = event.target.files[0];
    if (file) {
      // Simuler le téléchargement du fichier
      const session = this.sessions.find(s => s.id === sessionId);
      if (session) {
        session.proceedingsUrl = 'assets/' + file.name;
      }
    }
  }

  recordAttendance(sessionId: number) {
    this.selectedSession = this.sessions.find(s => s.id === sessionId) || null;
    this.showParticipantForm = true;
  }

  saveAttendance() {
    // Logique pour sauvegarder la présence
    this.showParticipantForm = false;
    this.selectedSession = null;
  }
}
