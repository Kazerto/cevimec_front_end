// sanctions.component.ts
import { Component, OnInit } from '@angular/core';
import { SanctionService } from '../../services/sanction.service';
import { SessionService } from '../../services/session.service';
import { MemberService } from '../../services/member.service';
import { Session } from '../../models/session.model';
import { Member } from '../../models/member.model';
import { Sanction, SanctionType, SANCTION_AMOUNTS } from '../../models/sanction.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sanctions-management',
  templateUrl: './sanctions-management.component.html',
  styleUrls: ['./sanctions-management.component.scss']
})
export class SanctionsManagementComponent implements OnInit {
  sessions: Session[] = [];
  members: Member[] = [];
  sanctionTypes = Object.values(SanctionType);
  sanctionForm: FormGroup;
  selectedAmount: number = 0;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  // Nouvelles propriétés pour l'historique
  sanctionsHistory: any[] = [];
  loadingHistory: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  sortColumn: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private sanctionService: SanctionService,
    private sessionService: SessionService,
    private memberService: MemberService,
    private fb: FormBuilder
  ) {
    this.sanctionForm = this.fb.group({
      sessionId: ['', Validators.required],
      memberId: ['', Validators.required],
      sanctionType: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit() {
    this.loadSessions();
    this.loadMembers();
    this.watchSanctionTypeChanges();
    this.loadSanctionsHistory();

  }

  loadSessions() {
    this.loading = true;
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.loading = false;
      },
      error: (error) => {
        this.error = "Erreur lors du chargement des sessions";
        this.loading = false;
      }
    });
  }

  loadMembers() {
    this.loading = true;
    this.memberService.getAllMembers().subscribe({
      next: (members) => {
        this.members = members;
        this.loading = false;
      },
      error: (error) => {
        this.error = "Erreur lors du chargement des membres";
        this.loading = false;
      }
    });
  }

  getMemberName(memberId: number): string {
    const member = this.members.find(m => m.id === memberId);
    return member ? `${member.lastName} ${member.firstName}` : 'Membre inconnu';
  }

  getSessionDate(sessionId: number): string {
    const session = this.sessions.find(s => s.id === sessionId);
    return session ? new Date(session.date).toLocaleDateString('fr-FR') : 'Date inconnue';
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadSanctionsHistory();
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadSanctionsHistory();
  }

  loadSanctionsHistory() {
    this.loadingHistory = true;
    this.sanctionService.getAllSanctions(
      this.currentPage - 1,
      this.pageSize,
      this.sortColumn,
      this.sortDirection
    ).subscribe({
      next: (response: any) => {
        this.sanctionsHistory = response.sanctions.map((sanction: any) => ({
          ...sanction,
          memberName: this.getMemberName(sanction.member.id),
          sessionDate: this.getSessionDate(sanction.session.id),
          sanctionTypeLabel: this.getSanctionTypeLabel(sanction.sanctionType),
          formattedAmount: this.formatAmount(sanction.amount)
        }));
        this.totalItems = response.total;
        this.loadingHistory = false;
      },
      error: (error) => {
        this.error = "Erreur lors du chargement de l'historique des sanctions";
        this.loadingHistory = false;
      }
    });
  }

  watchSanctionTypeChanges() {
    this.sanctionForm.get('sanctionType')?.valueChanges.subscribe(sanctionType => {
      if (sanctionType) {
        // Fix 1: Add type assertion to ensure sanctionType is of type SanctionType
        this.selectedAmount = SANCTION_AMOUNTS[sanctionType as SanctionType];
      }
    });
  }

  onSubmit() {
    if (this.sanctionForm.valid) {
      this.loading = true;
      const sanctionData: Partial<Sanction> = {
        session: {
          id: this.sanctionForm.value.sessionId
        },
        member: {
          id: this.sanctionForm.value.memberId
        },
        sanctionType: this.sanctionForm.value.sanctionType,
        date: this.sanctionForm.value.date,
        amount: this.selectedAmount
      };

      this.sanctionService.applySanction(sanctionData).subscribe({
        next: (response) => {
          this.success = "Sanction appliquée avec succès";
          this.sanctionForm.reset({ date: new Date() });
          this.loading = false;
          this.loadSanctionsHistory(); // Recharger l'historique
        },
        error: (error) => {
          this.error = "Erreur lors de l'application de la sanction";
          this.loading = false;
        }
      });
    }
  }

  getSanctionTypeLabel(type: string): string {
    // Verify if the type is a valid SanctionType
    if (Object.values(SanctionType).includes(type as SanctionType)) {
      return type.replace(/_/g, ' ').toLowerCase();
    }
    return 'Unknown sanction type';
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' });
  }

  protected readonly Math = Math;
}
