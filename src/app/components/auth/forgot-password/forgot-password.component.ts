import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
    public readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AuthComponent>,
  ) {}

  onSendRecoveryEmail() {
    this.userService
      .sendRecoveryEmail(this.forgotPasswordForm.controls.email.value)
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }
}
