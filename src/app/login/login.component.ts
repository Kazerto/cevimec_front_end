import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUserService } from '../services/app-user.service';  // Assure-toi que tu importes bien le bon service

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private appUserService: AppUserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = ''; // Réinitialiser l'erreur

      this.appUserService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          // Redirection basée sur le rôle
          switch (response.role) {
            case 'ADMINISTRATOR':
            case 'PRESIDENT':
            case 'VICE_PRESIDENT':
            case 'GENERAL_SECRETARY':
            case 'DEPUTY_GENERAL_SECRETARY':
            case 'TREASURER':
            case 'CENSOR':
            case 'STATUTORY_AUDITOR':
            case 'SAVINGS_ACCOUNTS_MANAGER':
              this.router.navigate(['/dashboard']);
              break;
            default:
              this.router.navigate(['/dashboard']);
              break;
          }
        },
        error: () => {
          this.error = 'Nom d\'utilisateur ou mot de passe incorrect'; // Message d'erreur
          this.loading = false;
        }
      });
    }
  }

  openForgotPasswordModal(): void {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeForgotPasswordModal(): void {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
