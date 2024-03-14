import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { Subscription } from 'rxjs';
import { NgIconComponent } from '@ng-icons/core';
import {
  PASSWORD_VALIDATION_MIN_LENGTH,
  PASSWORD_VALIDATION_REGEXP,
} from '../../../constants/literals';

@Component({
  selector: 'dipnoi-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIconComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent
  extends StatefulComponent<{
    typing: boolean;
    hidePassword: boolean;
    finished: boolean;
    resetToken: string;
  }>
  implements OnInit, OnDestroy
{
  queryParams$!: Subscription;
  typing$!: Subscription;
  typingTimeout!: NodeJS.Timeout;
  resetPasswordForm = this.formBuilder.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(PASSWORD_VALIDATION_MIN_LENGTH),
        Validators.pattern(PASSWORD_VALIDATION_REGEXP),
      ],
    ],
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    super({
      typing: false,
      hidePassword: true,
      finished: false,
      resetToken: '',
    });
  }

  ngOnInit() {
    this.queryParams$ = this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['resetToken']) {
        this.updateState({ resetToken: queryParams['resetToken'] });

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { ['resetToken']: null },
          queryParamsHandling: 'merge',
        });
      }
    });

    this.typing$ = this.resetPasswordForm.valueChanges.subscribe(() => {
      this.updateState({ typing: true });

      clearTimeout(this.typingTimeout);

      this.typingTimeout = setTimeout(() => {
        this.updateState({ typing: false });
      }, 500);
    });
  }

  onFinish() {
    this.authService
      .resetPassword({
        newPassword: this.resetPasswordForm.controls.password.value,
        resetToken: this.state.resetToken,
      })
      .subscribe({
        next: () => {
          this.updateState({ finished: true });
        },
      });
  }

  onHidePassword() {
    this.updateState({ hidePassword: !this.state.hidePassword });
  }

  override ngOnDestroy() {
    this.typing$.unsubscribe();

    this.queryParams$.unsubscribe();

    super.ngOnDestroy();
  }
}
