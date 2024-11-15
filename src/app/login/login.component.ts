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
  submitted = false;
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
      const username = this.loginForm.get('userName')?.value;
      const password = this.loginForm.get('password')?.value;

      // Appeler le service pour envoyer les identifiants au backend
      // stop here if form is invalid
      if (this.loginForm.invalid) {
        return;
      }

      this.loading = true;
      this.appUserService.login(this.loginForm.value)
        .subscribe({
          next: (response) => {
            // Redirection basée sur le rôle
            this.appUserService.setRole(response.role); // Ajout de cette ligne !
            switch(response.role) {
              case 'ADMINISTRATOR':
                this.router.navigate(['/dashboard']);
                break;
              case 'PRESIDENT':
                this.router.navigate(['/dashboard']);
                break;
              case 'GENERAL_SECRETARY':
                this.router.navigate(['/dashboard']);
                break;
              default:
                this.router.navigate(['/dashboard']);
            }
          },
          error: error => {
            this.error = 'Nom d\'utilisateur ou mot de passe incorrect';
            this.loading = false;
          }
        });

    }
  }
  }
