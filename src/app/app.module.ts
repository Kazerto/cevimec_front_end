import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminComponent } from './admin/admin.component';
import { PresidentComponent } from './president/president.component';
import { SecretaryGeneralComponent } from './secretary-general/secretary-general.component';
import { NavComponent } from './nav/nav.component';
import { UserService } from './auth/user.service';
import { SettingsComponent } from './fonctionnality/settings/settings.component';
import { SessionsManagementComponent } from './fonctionnality/sessions-management/sessions-management.component';
import { MembersManagementComponent } from './fonctionnality/members-management/members-management.component';
import { DashboardComponent } from './fonctionnality/dashboard/dashboard.component';
import { SharedLayoutComponent } from './shared-layout/shared-layout.component';
import { LoansManagementComponent } from './fonctionnality/loans-management/loans-management.component';
import { SmallTontineManagementComponent } from './fonctionnality/small-tontine-management/small-tontine-management.component';
import { TontineManagementComponent } from './fonctionnality/tontine-management/tontine-management.component';
import { SavingsManagementComponent } from './fonctionnality/savings-management/savings-management.component';
import { AidsManagementComponent } from './fonctionnality/aids-management/aids-management.component';
import { ExpensesManagementComponent } from './fonctionnality/expenses-management/expenses-management.component';
//import { SanctionsManagementComponent } from './fonctionnality/sanctions-management/sanctions-management.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { UsersManagementComponent } from './fonctionnality/users-management/users-management.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    PresidentComponent,
    SecretaryGeneralComponent,
    NavComponent,
    SettingsComponent,
    SessionsManagementComponent,
    MembersManagementComponent,
    DashboardComponent,
    SharedLayoutComponent,
    LoansManagementComponent,
    SmallTontineManagementComponent,
    ExpensesManagementComponent,
    AidsManagementComponent,
    SavingsManagementComponent,
    TontineManagementComponent,
    //SanctionsManagementComponent,
    UsersManagementComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,FormsModule,
    NgxChartsModule,DragDropModule,
    RouterModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
