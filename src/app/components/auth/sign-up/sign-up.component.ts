import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  PASSWORD_VALIDATION_MIN_LENGTH,
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
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

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
    NgxSpinnerComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent
  extends StatefulComponent<{
    typing: boolean;
    hidePassword: boolean;
    finished: boolean;
    isSignUpLoading: boolean;
    isGoogleLoading: boolean;
    isFacebookLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  signInQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  typing$!: Subscription;
  spinners$!: Subscription;
  typingTimeout!: NodeJS.Timeout;
  signUpForm = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.pattern(EMAIL_VALIDATION_REGEXP)],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(PASSWORD_VALIDATION_MIN_LENGTH),
        Validators.pattern(PASSWORD_VALIDATION_REGEXP),
      ],
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
    public spinnerService: NgxSpinnerService,
  ) {
    super({
      typing: false,
      hidePassword: true,
      finished: false,
      isSignUpLoading: false,
      isGoogleLoading: false,
      isFacebookLoading: false,
    });
  }

  ngOnInit() {
    this.typing$ = this.signUpForm.valueChanges.subscribe(() => {
      this.updateState({ typing: true });

      clearTimeout(this.typingTimeout);

      this.typingTimeout = setTimeout(() => {
        this.updateState({ typing: false });
      }, 500);

      this.spinners$ = this.state$.subscribe((state) => {
        if (state.isSignUpLoading) {
          this.spinnerService.show('sign-up');
        } else {
          this.spinnerService.hide('sign-up');
        }

        if (state.isGoogleLoading) {
          this.spinnerService.show('google-sign-up');
        } else {
          this.spinnerService.hide('google-sign-up');
        }

        if (state.isFacebookLoading) {
          this.spinnerService.show('facebook-sign-up');
        } else {
          this.spinnerService.hide('facebook-sign-up');
        }
      });
    });
  }

  onSignUp() {
    this.updateState({ isSignUpLoading: true });

    this.authService
      .signUp({
        email: this.signUpForm.controls.email.value,
        password: this.signUpForm.controls.password.value,
        recaptchaResponse: this.signUpForm.controls.recaptchaResponse.value!,
      })
      .pipe(
        finalize(() => {
          this.updateState({ isSignUpLoading: false });
        }),
      )
      .subscribe({
        next: () => {
          this.updateState({ finished: true });
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
        this.updateState({ isSignUpLoading: true });

        this.authService
          .googleSignIn({ accessToken })
          .pipe(
            finalize(() => {
              this.updateState({ isGoogleLoading: false });
            }),
          )
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

  onFacebookSignUp() {
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user) => {
        this.updateState({ isSignUpLoading: true });

        this.authService
          .facebookSignIn({ accessToken: user.authToken })
          .pipe(
            finalize(() => {
              this.updateState({ isFacebookLoading: false });
            }),
          )
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

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    this.typing$.unsubscribe();

    super.ngOnDestroy();
  }
}
