import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
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
    private readonly userService: UserService,
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
