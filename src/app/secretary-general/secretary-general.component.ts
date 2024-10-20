import { Component } from '@angular/core';

@Component({
  selector: 'app-secretary-general',
  template: '<app-shared-layout></app-shared-layout>',
  styleUrl: './secretary-general.component.css'
})
export class SecretaryGeneralComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
