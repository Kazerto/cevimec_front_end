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
    { title: "Tableau de bord", route: "/dashboard", icon: "📊" },
    { title: "Gestion des membres", route: "/members", icon: "👥" },
    { title: "Gestion des sessions", route: "/sessions", icon: "📅" },
    {title: "Gestion des épargnes", route: "/savings", icon: "💰"},
    {title: "Gestion des prêts", route: "/loans", icon: "📑"},
    {title: "Gestion des tontines", route: "/tontines", icon: "🌀"},
    {title: "Gestion de la petite tontine", route: "/small-tontine", icon: "🔄"},
    {title: "Gestion des aides", route: "/aids", icon: "🤝"},
    {title: "Gestion des dépenses", route: "/expenses", icon: "💵"},
    {title: "Gestion des sanctions", route: "/sanctions", icon: "🌀" },
    {title: "Gestion des utilisateurs", route: "/users", icon: "👥" },
    { title: 'Configuration', route: '/configuration', icon: '⚙️' },



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
