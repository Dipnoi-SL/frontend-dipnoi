import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dipnoi-auth',
  standalone: true,
  imports: [
    CommonModule,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    RouterLink,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit, OnDestroy {
  view?: string;
  queryParams$!: Subscription;
  signInPath = RoutePathEnum.SIGN_IN;
  signUpPath = RoutePathEnum.SIGN_UP;
  forgotPasswordPath = RoutePathEnum.FORGOT_PASSWORD;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.queryParams$ = this.route.queryParams.subscribe((queryParams) => {
      this.view = queryParams[RoutePathEnum.AUTH];
    });
  }

  ngOnDestroy() {
    this.queryParams$.unsubscribe();
  }

  buildAuthQueryParam(value: string) {
    return { [RoutePathEnum.AUTH]: value };
  }
}
