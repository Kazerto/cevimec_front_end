import {Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppUserService} from "../services/app-user.service";

@Component({
  selector: 'app-shared-layout',
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.css']
})
export class SharedLayoutComponent implements AfterViewInit, OnInit {
  @ViewChild('navActions') navActions!: ElementRef;

actions: Array<any> = [
    { title: "Tableau de bord", route: "/dashboard", icon: "📊", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY"] },
    { title: "Gestion des membres", route: "/members", icon: "👥", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY"] },
    {title: "Gestion des épargnes", route: "/savings", icon: "💰", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT","SAVINGS_ACCOUNTS_MANAGER"] },
    {title: "Gestion des prêts", route: "/loans", icon: "📑", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT","SAVINGS_ACCOUNTS_MANAGER"] },
    { title: "Gestion des sessions", route: "/sessions", icon: "📅", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY"] },
    {title: "Gestion des utilisateurs", route: "/users", icon: "👥", roles: ["ADMINISTRATOR"] },
    {title: "Gestion des sanctions", route: "/sanctions", icon: "🌀", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY", "CENSOR"] },
    {title: "Gestion des tontines", route: "/tontines", icon: "🌀", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY"] },
    {title: "Gestion de la petite tontine", route: "/small-tontine", icon: "🔄", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY"] },
    {title: "Gestion des aides", route: "/aids", icon: "🤝", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT"] },
    {title: "Gestion des dépenses", route: "/expenses", icon: "💵", roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY","TREASURER"] },

    { title: 'Configuration', route: '/settings', icon: '⚙️', roles: ["ADMINISTRATOR", "PRESIDENT","VICE_PRESIDENT", "GENERAL_SECRETARY","DEPUTY_GENERAL_SECRETARY","TREASURER", "CENSOR", "SAVINGS_ACCOUNTS_MANAGER", "STATUTORY_AUDITOR"]},



  ];
  currentAction: any  = this.actions[0]
  roleMenuOpen: boolean = false;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = false;

  constructor(public appUserService: AppUserService, private router: Router) {}

  ngOnInit(): void {

    this.currentAction = JSON.parse(<string>localStorage.getItem('previousAction')) ;

  }

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
    localStorage.setItem('previousAction', JSON.stringify(this.currentAction));
  }

  getRole(): string {
    return this.appUserService.getRole() ?? 'Utilisateur';
  }

  logout(): void {
    this.appUserService.logout();
    this.router.navigate(['/login']);
  }

  toggleRoleMenu(): void {
    this.roleMenuOpen = !this.roleMenuOpen;
  }


}
