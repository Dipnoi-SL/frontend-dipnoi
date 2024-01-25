import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { AuthComponent } from '../auth.component';
import { DialogRef } from '@angular/cdk/dialog';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
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
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public dialogRef: DialogRef<AuthComponent>,
  ) {}

  onSignIn() {
    this.authService
      .signIn({
        email: this.signInForm.controls.email.value,
        password: this.signInForm.controls.password.value,
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
