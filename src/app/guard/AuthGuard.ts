import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AppUserService } from '../services/app-user.service';
import {UserService} from "../auth/user.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private appUserService: AppUserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userRole = this.appUserService.getRole();

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    // Vérifier les rôles de manière plus précise
    const normalizedUserRole = this.normalizeRole(userRole);
    const expectedRoles = next.data['roles'] as Array<string>;

    if (!expectedRoles || !expectedRoles.includes(normalizedUserRole)) {
      console.log('Accès refusé pour le rôle:', normalizedUserRole);
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }

  private normalizeRole(role: string): string {
    // Convertit les rôles du backend vers le format utilisé dans les routes
    switch(role) {
      case 'ADMINISTRATOR': return 'admin';
      case 'PRESIDENT': return 'president';
      case 'VICE_PRESIDENT': return 'vicePresident';
      case 'GENERAL_SECRETARY': return 'GeneralSecretary';
      case 'DEPUTY_GENERAL_SECRETARY': return 'deputyGeneralSecretary';
      case 'TREASURER': return 'treasurer';
      case 'CENSOR': return 'censor';
      case 'STATUTORY_AUDITOR': return 'statutoryAuditor';
      case 'SAVINGS_ACCOUNTS_MANAGER': return 'savingsAccountsManager';
      default: return role.toLowerCase();
    }

  }
}
