import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthComponent } from '../auth.component';
import {
  EMAIL_VALIDATION_REGEXP,
  PASSWORD_VALIDATION_REGEXP,
} from '../../../constants/literals';
import { DialogRef } from '@angular/cdk/dialog';
import { NgIconComponent } from '@ng-icons/core';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'dipnoi-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    RouterLink,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent extends StatefulComponent<{
  hasErrored: boolean;
  hidePassword: boolean;
  finished: boolean;
}> {
  signInQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  signUpForm = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.pattern(EMAIL_VALIDATION_REGEXP)],
    ],
    password: [
      '',
      [Validators.required, Validators.pattern(PASSWORD_VALIDATION_REGEXP)],
    ],
    recaptchaResponse: [null as string | null, Validators.required],
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public dialogRef: DialogRef<AuthComponent>,
    public route: ActivatedRoute,
    public socialAuthService: SocialAuthService,
    public router: Router,
  ) {
    super({
      hasErrored: false,
      hidePassword: true,
      finished: false,
    });
  }

  onSignUp() {
    this.authService
      .signUp({
        email: this.signUpForm.controls.email.value,
        password: this.signUpForm.controls.password.value,
        recaptchaResponse: this.signUpForm.controls.recaptchaResponse.value!,
      })
      .subscribe({
        next: () => {
          this.updateState({ finished: true });
        },
        error: () => {
          this.updateState({ hasErrored: true });
        },
      });
  }

  onHidePassword() {
    this.updateState({ hidePassword: !this.state.hidePassword });
  }

  onGoogleSignUp() {
    this.socialAuthService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        this.authService.googleSignIn({ accessToken }).subscribe({
          next: () => {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { [RoutePathEnum.AUTH]: RoutePathEnum.ACTIVATE },
              queryParamsHandling: 'merge',
            });
          },
        });
      });
  }

  onFacebookSignUp() {
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user) => {
        this.authService
          .facebookSignIn({ accessToken: user.authToken })
          .subscribe({
            next: () => {
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { [RoutePathEnum.AUTH]: RoutePathEnum.ACTIVATE },
                queryParamsHandling: 'merge',
              });
            },
          });
      });
  }
}
