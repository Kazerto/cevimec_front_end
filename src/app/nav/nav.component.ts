import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth/user.service';
import { AppUserService } from '../services/app-user.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  role: string | null = null; // Propriété pour stocker le rôle

  // Injection du UserService dans le constructeur
  constructor(protected appUserService: AppUserService) {}

  ngOnInit(): void {
    // Récupération du rôle lors de l'initialisation
    this.role = this.appUserService.getRole();
  }
}
