import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { AuthComponent } from '../auth.component';
import { MatDialogRef } from '@angular/material/dialog';
import {
  EMAIL_VALIDATION_REGEXP,
  PASSWORD_VALIDATION_REGEXP,
} from '../../../constants/literals';

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
      [Validators.required, Validators.pattern(EMAIL_VALIDATION_REGEXP)],
    ],
    password: [
      '',
      [Validators.required, Validators.pattern(PASSWORD_VALIDATION_REGEXP)],
    ],
  });
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private formBuilder: NonNullableFormBuilder,
    private dialogRef: MatDialogRef<AuthComponent>,
  ) {}

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
          this.hasErrored = true;
        },
      });
  }
}
