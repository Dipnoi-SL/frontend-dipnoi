import { ChangeDetectionStrategy, Component } from '@angular/core';
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

@Component({
  selector: 'dipnoi-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent extends StatefulComponent<{
  hidePassword: boolean;
}> {
  signUpQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_UP };
  forgotPasswordQueryParam = {
    [RoutePathEnum.AUTH]: RoutePathEnum.FORGOT_PASSWORD,
  };
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
  ) {
    super({
      hidePassword: true,
    });
  }

  onSignIn() {
    this.authService
      .signIn({
        email: this.signInForm.controls.email.value,
        password: this.signInForm.controls.password.value,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: () => {
          // TODO: Open error toast
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
        this.authService.googleSignIn({ accessToken }).subscribe({
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
        this.authService
          .facebookSignIn({ accessToken: user.authToken })
          .subscribe({
            next: () => {
              this.dialogRef.close();
            },
          });
      });
  }
}
