import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { RoutePathEnum } from '../../../app.routes';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StatefulComponent } from '../../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends StatefulComponent<{
  finished: boolean;
}> {
  signInQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  forgotPasswordForm = this.formBuilder.group({
    email: [''],
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public route: ActivatedRoute,
  ) {
    super({ finished: false });
  }

  onContinue() {
    this.authService
      .requestPasswordReset({
        email: this.forgotPasswordForm.controls.email.value,
      })
      .subscribe({
        next: () => {
          this.updateState({ finished: true });
        },
      });
  }
}
