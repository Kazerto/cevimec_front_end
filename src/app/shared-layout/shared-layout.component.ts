import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { UserService } from "../auth/user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-layout',
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.css']
})
export class SharedLayoutComponent implements AfterViewInit {
  @ViewChild('navActions') navActions!: ElementRef;

  actions: Array<any> = [
    { title: "Tableau de bord", route: "/dashboard", icon: "📊", roles: ["admin", "president", "secretaryGeneral"] },
    { title: "Gestion des membres", route: "/members", icon: "👥", roles: ["admin", "president", "secretaryGeneral"] },
    { title: "Gestion des sessions", route: "/sessions", icon: "📅", roles: ["admin", "president", "secretaryGeneral"] },
    {title: "Gestion des épargnes", route: "/savings", icon: "💰", roles: ["admin", "president", "secretaryGeneral"] },
    {title: "Gestion des prêts", route: "/loans", icon: "📑", roles: ["admin", "president"] },
    {title: "Gestion des tontines", route: "/tontines", icon: "🌀", roles: ["admin", "president", "secretaryGeneral"] },
    {title: "Gestion de la petite tontine", route: "/small-tontine", icon: "🔄", roles: ["admin", "president", "secretaryGeneral"] },
    {title: "Gestion des aides", route: "/aids", icon: "🤝", roles: ["admin", "president"] },
    {title: "Gestion des dépenses", route: "/expenses", icon: "💵", roles: ["admin", "president", "secretaryGeneral"] },
    {title: "Gestion des sanctions", route: "/sanctions", icon: "🌀", roles: ["admin", "president", "secretaryGeneral"] },
    {title: "Gestion des utilisateurs", route: "/users", icon: "👥", roles: ["admin"] },
    { title: 'Configuration', route: '/configuration', icon: '⚙️', roles: ["admin", "president", "secretaryGeneral"] },



  ];
  currentAction: any;
  roleMenuOpen: boolean = false;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = false;

  constructor(public userService: UserService, private router: Router) {}

  ngAfterViewInit() {
    this.checkScroll();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScroll();
  }

  checkScroll() {
    if (this.navActions && this.navActions.nativeElement) {
      const element = this.navActions.nativeElement;
      this.canScrollLeft = element.scrollLeft > 0;
      this.canScrollRight = element.scrollLeft < element.scrollWidth - element.clientWidth;
    }
  }

  onScroll() {
    this.checkScroll();
  }

  scrollLeft() {
    if (this.navActions && this.navActions.nativeElement) {
      this.navActions.nativeElement.scrollLeft -= 100;
      this.checkScroll();
    }
  }

  scrollRight() {
    if (this.navActions && this.navActions.nativeElement) {
      this.navActions.nativeElement.scrollLeft += 100;
      this.checkScroll();
    }
  }

  setCurrentAction(action: any) {
    this.currentAction = action;
  }

  getRole(): string {
    return this.userService.getRole() ?? 'Utilisateur';
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  toggleRoleMenu(): void {
    this.roleMenuOpen = !this.roleMenuOpen;
  }
}
