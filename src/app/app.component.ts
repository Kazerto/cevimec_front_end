import { Component } from '@angular/core';
import { UserService } from './auth/user.service'; // Importer UserService si nécessaire

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestion d\'Association';

  constructor(public userService: UserService) {}

}
