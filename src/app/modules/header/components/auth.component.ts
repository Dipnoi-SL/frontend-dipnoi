import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SignInComponent } from './sign-in.component';
import { SignUpComponent } from './sign-up.component';

@Component({
  selector: 'dipnoi-auth',
  standalone: true,
  imports: [CommonModule, MatDialogModule, SignInComponent, SignUpComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  view: 'sign-in' | 'sign-up';

  constructor(@Inject(MAT_DIALOG_DATA) data: { view: 'sign-in' | 'sign-up' }) {
    this.view = data.view;
  }

  onChangeView() {
    this.view = this.view === 'sign-in' ? 'sign-up' : 'sign-in';
  }
}
