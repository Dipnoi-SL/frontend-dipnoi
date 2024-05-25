import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { RoutePathEnum } from '../../../app.routes';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'dipnoi-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxSpinnerComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent
  extends StatefulComponent<{
    finished: boolean;
    isForgotPasswordLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  signInQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  spinners$!: Subscription;
  forgotPasswordForm = this.formBuilder.group({
    email: [''],
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public route: ActivatedRoute,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ finished: false, isForgotPasswordLoading: false });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isForgotPasswordLoading) {
        this.spinnerService.show('forgot-password');
      } else {
        this.spinnerService.hide('forgot-password');
      }
    });
  }

  onContinue() {
    this.updateState({ isForgotPasswordLoading: true });

    this.authService
      .requestPasswordReset({
        email: this.forgotPasswordForm.controls.email.value,
      })
      .pipe(
        finalize(() => {
          this.updateState({ isForgotPasswordLoading: false });
        }),
      )
      .subscribe({
        next: () => {
          this.updateState({ finished: true });
        },
      });
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    super.ngOnDestroy();
  }
}
