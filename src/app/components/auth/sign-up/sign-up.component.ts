import { Component } from '@angular/core';
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

@Component({
  selector: 'dipnoi-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public dialogRef: DialogRef<AuthComponent>,
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
