import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {DashboardComponent} from "./fonctionnality/dashboard/dashboard.component";
import {MembersManagementComponent} from "./fonctionnality/members-management/members-management.component";
import {SessionsManagementComponent} from "./fonctionnality/sessions-management/sessions-management.component";
import {SettingsComponent} from "./fonctionnality/settings/settings.component";
import {SharedLayoutComponent} from "./shared-layout/shared-layout.component";
import {LoansManagementComponent} from "./fonctionnality/loans-management/loans-management.component";
import {SmallTontineManagementComponent} from "./fonctionnality/small-tontine-management/small-tontine-management.component";
import {TontineManagementComponent} from "./fonctionnality/tontine-management/tontine-management.component";
import {SavingsManagementComponent} from "./fonctionnality/savings-management/savings-management.component";
import {AidsManagementComponent} from "./fonctionnality/aids-management/aids-management.component";
import {ExpensesManagementComponent} from "./fonctionnality/expenses-management/expenses-management.component";
import {UsersManagementComponent} from "./fonctionnality/users-management/users-management.component";
import { AuthGuard } from './guard/AuthGuard';
import {SanctionsManagementComponent} from "./fonctionnality/sanctions-management/sanctions-management.component";


const routes: Routes = [
  { path: 'login', component: LoginComponent },  // Route séparée pour la page de connexion
  { path: '', redirectTo: '/login', pathMatch: 'full' },


  {
    path: '',
    component: SharedLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary'] } },
      { path: 'members', component: MembersManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary'] } },
      { path: 'sessions', component: SessionsManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary'] } },
      { path: 'loans', component: LoansManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident','savingsAccountsManager'] } },
      { path: 'small-tontine', component: SmallTontineManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary'] } },
      { path: 'tontines', component: TontineManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary'] } },
      { path: 'savings', component: SavingsManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident','savingsAccountsManager'] } },
      { path: 'aids', component: AidsManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident','treasurer'] } },
      { path: 'expenses', component: ExpensesManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary','treasurer'] } },
      { path: 'users', component: UsersManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: 'sanctions', component: SanctionsManagementComponent, canActivate: [AuthGuard], data: { roles: ['admin','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary','censor'] } },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'president','vicePresident', 'GeneralSecretary', 'deputyGeneralSecretary','censor','savingsAccountsManager'] } },


    ]
  },
  { path: '**', redirectTo: 'login' } // Redirection par défaut vers login si aucune route ne correspond


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
