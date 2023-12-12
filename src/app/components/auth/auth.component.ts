import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@Component({
  selector: 'dipnoi-auth',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  view: 'sign-in' | 'sign-up' | 'forgot-password';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: {
      view: 'sign-in' | 'sign-up' | 'forgot-password';
    },
  ) {
    this.view = data.view;
  }

  onChangeView(view: 'sign-in' | 'sign-up' | 'forgot-password') {
    this.view = view;
  }
}
