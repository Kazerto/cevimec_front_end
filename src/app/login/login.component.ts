import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importer Router
import { UserService } from '../auth/user.service'; // Importer UserService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    console.log(this.loginForm);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      // Simuler la récupération du rôle après authentification
      const role = this.getRoleBasedOnCredentials(username, password);

      // Stocker le rôle dans le UserService
      this.userService.setRole(role);

      // Rediriger l'utilisateur en fonction du rôle
      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'president') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'secretary') {
        this.router.navigate(['/members']);
      } else {
        console.log('Rôle non reconnu');
      }
    } else {
      console.log('Formulaire invalide');
    }
  }

  getRoleBasedOnCredentials(username: string, password: string): string {
    if (username === 'admin' && password === 'admin123') {
      return 'admin';
    } else if (username === 'president' && password === '1234') {
      return 'president';
    } else if (username === 'secretary' && password === '1234') {
      return 'secretary';
    } else {
      return '';
    }
  }
}
