import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ActivatedRoute } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';
import { Subscription } from 'rxjs';
import { StatefulComponent } from '../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-auth',
  standalone: true,
  imports: [
    CommonModule,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent
  extends StatefulComponent<{ view?: RoutePathEnum }>
  implements OnInit, OnDestroy
{
  queryParams$!: Subscription;
  signInPath = RoutePathEnum.SIGN_IN;
  signUpPath = RoutePathEnum.SIGN_UP;
  forgotPasswordPath = RoutePathEnum.FORGOT_PASSWORD;

  constructor(public route: ActivatedRoute) {
    super({});
  }

  ngOnInit() {
    this.queryParams$ = this.route.queryParams.subscribe((queryParams) => {
      this.updateState({ view: queryParams[RoutePathEnum.AUTH] });
    });
  }

  override ngOnDestroy() {
    this.queryParams$.unsubscribe();

    super.ngOnDestroy();
  }
}
