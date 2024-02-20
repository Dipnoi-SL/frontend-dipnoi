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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';

@Component({
  selector: 'dipnoi-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent extends StatefulComponent<{
  hasErrored: boolean;
  hidePassword: boolean;
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
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public dialogRef: DialogRef<AuthComponent>,
    public route: ActivatedRoute,
  ) {
    super({
      hasErrored: false,
      hidePassword: true,
    });
  }

  onSignUp() {
    this.authService
      .signUp({
        email: this.signUpForm.controls.email.value,
        password: this.signUpForm.controls.password.value,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: () => {
          this.updateState({ hasErrored: true });
        },
      });
  }

  onHidePassword() {
    this.updateState({ hidePassword: !this.state.hidePassword });
  }
}
