import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'dipnoi-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm = this.formBuilder.group({
    email: [''],
  });

  constructor(
    private authService: AuthService,
    private formBuilder: NonNullableFormBuilder,
    private dialogRef: MatDialogRef<AuthComponent>,
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
