import { Component, OnInit } from '@angular/core';

interface Sanction {
  id: number;
  memberId: number;
  memberName: string;
  reason: string;
  amount: number;
  date: Date;
  sessionId: number;
  isPaid: boolean;
}

@Component({
  selector: 'app-sanctions-management',
  templateUrl: './sanctions-management.component.html',
  styleUrls: ['./sanctions-management.component.css']
})
export class SanctionsManagementComponent implements OnInit {
  sanctions: Sanction[] = [];
  newSanction: Sanction | null = null;
  showSanctionForm = false;
  selectedSessionId: number | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadMockSanctions();
  }

  loadMockSanctions() {
    this.sanctions = [
      {
        id: 1,
        memberId: 1,
        memberName: 'Jean Dupont',
        reason: 'Retard à la réunion',
        amount: 1000,
        date: new Date('2024-03-01'),
        sessionId: 1,
        isPaid: true
      },
      {
        id: 2,
        memberId: 2,
        memberName: 'Marie Martin',
        reason: 'Absence non justifiée',
        amount: 2000,
        date: new Date('2024-04-01'),
        sessionId: 2,
        isPaid: false
      }
    ];
  }

  openSanctionForm(sessionId: number) {
    this.selectedSessionId = sessionId;
    this.newSanction = {
      id: this.sanctions.length + 1,
      memberId: 0,
      memberName: '',
      reason: '',
      amount: 0,
      date: new Date(),
      sessionId: sessionId,
      isPaid: false
    };
    this.showSanctionForm = true;
  }

  saveSanction() {
    if (this.newSanction) {
      this.sanctions.push(this.newSanction);
      this.newSanction = null;
      this.showSanctionForm = false;
      this.selectedSessionId = null;
    }
  }

  togglePaymentStatus(sanction: Sanction) {
    sanction.isPaid = !sanction.isPaid;
  }

  getTotalSanctionsAmount(): number {
    return this.sanctions.reduce((total, sanction) => total + sanction.amount, 0);
  }

  getPaidSanctionsAmount(): number {
    return this.sanctions
      .filter(sanction => sanction.isPaid)
      .reduce((total, sanction) => total + sanction.amount, 0);
  }

  getUnpaidSanctionsAmount(): number {
    return this.sanctions
      .filter(sanction => !sanction.isPaid)
      .reduce((total, sanction) => total + sanction.amount, 0);
  }
}
