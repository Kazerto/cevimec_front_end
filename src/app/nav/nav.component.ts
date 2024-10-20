import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth/user.service'; // Assure-toi d'importer le service

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  role: string | null = null; // Propriété pour stocker le rôle

  // Injection du UserService dans le constructeur
  constructor(protected userService: UserService) {}

  ngOnInit(): void {
    // Récupération du rôle lors de l'initialisation
    this.role = this.userService.getRole();
  }
}
