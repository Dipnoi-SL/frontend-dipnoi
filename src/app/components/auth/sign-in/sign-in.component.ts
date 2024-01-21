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
  selector: 'dipnoi-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  hasErrored = false;
  signInForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private formBuilder: NonNullableFormBuilder,
    private dialogRef: MatDialogRef<AuthComponent>,
  ) {}

  onSignIn() {
    this.authService
      .signIn(
        this.signInForm.controls.email.value,
        this.signInForm.controls.password.value,
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
