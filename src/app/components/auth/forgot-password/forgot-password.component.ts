import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { AuthComponent } from '../auth.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'dipnoi-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  forgotPasswordForm = this.formBuilder.group({
    email: [''],
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public dialogRef: DialogRef<AuthComponent>,
  ) {}

  onSendRecoveryEmail() {
    this.authService
      .requestPasswordReset({
        email: this.forgotPasswordForm.controls.email.value,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }
}
