import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {SecretaryGeneralComponent} from "./secretary-general/secretary-general.component";
import {PresidentComponent} from "./president/president.component";
import {AdminComponent} from "./admin/admin.component";
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
import {SanctionsManagementComponent} from "./fonctionnality/sanctions-management/sanctions-management.component";
import {UsersManagementComponent} from "./fonctionnality/users-management/users-management.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },  // Route séparée pour la page de connexion
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: "admin", component: AdminComponent},
  { path: "president", component: PresidentComponent},
  { path: "secretaryGeneral", component: SecretaryGeneralComponent},

  {
    path: '',
    component: SharedLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'members', component: MembersManagementComponent },
      { path: 'sessions', component: SessionsManagementComponent },
      { path: 'configuration', component: SettingsComponent },
      { path: 'loans', component: LoansManagementComponent },
      { path: 'small-tontine', component: SmallTontineManagementComponent },
      { path: 'tontines', component: TontineManagementComponent },
      { path: 'savings', component: SavingsManagementComponent },
      { path: 'aids', component: AidsManagementComponent },
      { path: 'expenses', component: ExpensesManagementComponent },
      { path: 'sanctions', component: SanctionsManagementComponent },
      { path: 'users', component: UsersManagementComponent },

    ]
  },
  { path: '**', redirectTo: 'login' } // Redirection par défaut vers login si aucune route ne correspond


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
