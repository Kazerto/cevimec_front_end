import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.userService.getRole();
    const allowedRoles = route.data['roles'] as Array<string>;

    // Permettre l'accès à la route de login sans vérification de rôle
    if (state.url === '/login') {
      return true;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

}
