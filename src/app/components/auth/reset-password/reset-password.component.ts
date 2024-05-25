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
import { Subscription, finalize } from 'rxjs';
import { NgIconComponent } from '@ng-icons/core';
import {
  PASSWORD_VALIDATION_MIN_LENGTH,
  PASSWORD_VALIDATION_REGEXP,
} from '../../../constants/literals';
import { RoutePathEnum } from '../../../app.routes';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'dipnoi-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgIconComponent,
    NgxSpinnerComponent,
  ],
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
    isResetPasswordLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  queryParams$!: Subscription;
  typing$!: Subscription;
  spinners$!: Subscription;
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
    public spinnerService: NgxSpinnerService,
  ) {
    super({
      typing: false,
      hidePassword: true,
      finished: false,
      resetToken: '',
      isResetPasswordLoading: false,
    });
  }

  ngOnInit() {
    this.queryParams$ = this.route.queryParams.subscribe((queryParams) => {
      if (queryParams[RoutePathEnum.RESET_TOKEN]) {
        this.updateState({
          resetToken: queryParams[RoutePathEnum.RESET_TOKEN],
        });

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { [RoutePathEnum.RESET_TOKEN]: null },
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

    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isResetPasswordLoading) {
        this.spinnerService.show('reset-password');
      } else {
        this.spinnerService.hide('reset-password');
      }
    });
  }

  onFinish() {
    this.updateState({ isResetPasswordLoading: true });

    this.authService
      .resetPassword({
        newPassword: this.resetPasswordForm.controls.password.value,
        resetToken: this.state.resetToken,
      })
      .pipe(
        finalize(() => {
          this.updateState({ isResetPasswordLoading: false });
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

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    this.typing$.unsubscribe();

    this.queryParams$.unsubscribe();

    super.ngOnDestroy();
  }
}
