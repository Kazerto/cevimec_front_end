import { Injectable } from '@angular/core';
import { Member } from '../models/member.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  constructor() {}

  generateMembersList(members: Member[]): void {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Add title
    doc.setFontSize(18);
    doc.text('Liste des Membres', 14, 20);
    doc.setFontSize(11);
    doc.text(`Date d'extraction: ${currentDate}`, 14, 30);

    // Prepare data for table
    const tableData = members.map(member => [
      `${member.firstName} ${member.lastName}`,
      new Date(member.birthDate).toLocaleDateString(),
      member.phoneGabon,
      member.profession,
      member.city,
      this.getDisplayAccountStatus(member.accountStatus)
    ]);

    // Define table headers
    const headers = [
      'Nom complet',
      'Date de naissance',
      'Téléphone',
      'Profession',
      'Ville',
      'Statut'
    ];

    // Generate table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 9,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Save PDF
    doc.save(`liste-membres-${currentDate.replace(/\//g, '-')}.pdf`);
  }

  private getDisplayAccountStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'EXCLUDED': 'Exclu',
      'DEPARTED': 'Parti'
    };
    return statusMap[status] || 'Inconnu';
  }
}
