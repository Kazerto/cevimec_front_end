import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from '../../services/app-user.service';
import { AppUser } from '../../models/appuser.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  currentUser: AppUser | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  loading = false;
  showChangePassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private appUserService: AppUserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // Initialiser le formulaire
    this.settingsForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });

    // Charger les informations de l'utilisateur actuel
    const userId = this.getCurrentUserId(); // Vous devrez implémenter cette méthode
    if (userId) {
      this.appUserService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.settingsForm.patchValue({
            userName: user.userName
          });
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des informations utilisateur';
          if (error.status === 401) {
            // Si non autorisé, rediriger vers la page de connexion
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  getCurrentUserId(): number | null {
    return this.appUserService.getCurrentUserId();
  }

  onSubmit(): void {
    if (this.settingsForm.valid && this.currentUser) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const updates: Partial<AppUser> = {
        userName: this.settingsForm.get('userName')?.value,
        password: this.settingsForm.get('newPassword')?.value
      };

      this.appUserService.updateUser(this.currentUser.id, updates).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Paramètres mis à jour avec succès';
          this.currentUser = response;
          // Réinitialiser les champs de mot de passe
          this.settingsForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Une erreur est survenue lors de la mise à jour';
        }
      });
    }
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    if (!this.showChangePassword) {
      // Réinitialiser les champs de mot de passe si on cache la section
      this.settingsForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }
}
