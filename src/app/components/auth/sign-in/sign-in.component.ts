import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { AuthComponent } from '../auth.component';
import { DialogRef } from '@angular/cdk/dialog';
import { NgIconComponent } from '@ng-icons/core';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'dipnoi-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    RouterLink,
    NgxSpinnerComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent
  extends StatefulComponent<{
    hidePassword: boolean;
    isSignInLoading: boolean;
    isGoogleLoading: boolean;
    isFacebookLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  signUpQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_UP };
  forgotPasswordQueryParam = {
    [RoutePathEnum.AUTH]: RoutePathEnum.FORGOT_PASSWORD,
  };
  spinners$!: Subscription;
  signInForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public dialogRef: DialogRef<AuthComponent>,
    public route: ActivatedRoute,
    public socialAuthService: SocialAuthService,
    public spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
  ) {
    super({
      hidePassword: true,
      isSignInLoading: false,
      isGoogleLoading: false,
      isFacebookLoading: false,
    });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isSignInLoading) {
        this.spinnerService.show('sign-in');
      } else {
        this.spinnerService.hide('sign-in');
      }

      if (state.isGoogleLoading) {
        this.spinnerService.show('google-sign-in');
      } else {
        this.spinnerService.hide('google-sign-in');
      }

      if (state.isFacebookLoading) {
        this.spinnerService.show('facebook-sign-in');
      } else {
        this.spinnerService.hide('facebook-sign-in');
      }
    });
  }

  onSignIn() {
    this.updateState({ isSignInLoading: true });

    this.authService
      .signIn({
        email: this.signInForm.controls.email.value,
        password: this.signInForm.controls.password.value,
      })
      .pipe(
        finalize(() => {
          this.updateState({ isSignInLoading: false });
        }),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }

  onHidePassword() {
    this.updateState({ hidePassword: !this.state.hidePassword });
  }

  onGoogleSignIn() {
    this.socialAuthService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        this.updateState({ isGoogleLoading: true });

        this.authService
          .googleSignIn({ accessToken })
          .pipe(
            finalize(() => {
              this.updateState({ isGoogleLoading: false });
            }),
          )
          .subscribe({
            next: () => {
              this.dialogRef.close();
            },
          });
      });
  }

  onFacebookSignIn() {
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user) => {
        this.updateState({ isFacebookLoading: true });

        this.authService
          .facebookSignIn({ accessToken: user.authToken })
          .pipe(
            finalize(() => {
              this.updateState({ isFacebookLoading: false });
            }),
          )
          .subscribe({
            next: () => {
              this.dialogRef.close();
            },
          });
      });
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    super.ngOnDestroy();
  }
}
