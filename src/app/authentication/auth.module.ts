import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { AuthGuard, AdminGuard, EurosongGuard } from './auth-guard.service';

import { AppSharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterResolver } from './register.resolver';

@NgModule({
  imports: [
    AppSharedModule,    
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent, resolve: { messages: RegisterResolver} }
    ])
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    EurosongGuard,
    RegisterResolver
  ]
})
export class AuthModule { }
