import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { emailValidationRegexp } from '../../constants/email-validation-regexp';
import { MatIconModule } from '@angular/material/icon';
import { passwordValidationRegexp } from '../../constants/password-validation-regexp';
import { UserService } from '../../services/user.service';
import { AuthComponent } from '../auth/auth.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dipnoi-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  hasErrored = false;
  signUpForm = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.pattern(emailValidationRegexp)],
    ],
    password: [
      '',
      [Validators.required, Validators.pattern(passwordValidationRegexp)],
    ],
  });
  hidePassword = true;

  constructor(
    public readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AuthComponent>,
  ) {}

  onSignUp() {
    this.userService
      .signUp(
        this.signUpForm.controls.email.value,
        this.signUpForm.controls.password.value,
      )
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: () => {
          this.hasErrored = true;
        },
      });
  }
}
