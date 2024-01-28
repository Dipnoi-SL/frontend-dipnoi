import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { AuthComponent } from '../auth.component';
import { DialogRef } from '@angular/cdk/dialog';
import { NgIconComponent } from '@ng-icons/core';
import { StatefulComponent } from '../../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent extends StatefulComponent<{
  hasErrored: boolean;
  hidePassword: boolean;
}> {
  signInForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  constructor(
    public authService: AuthService,
    public formBuilder: NonNullableFormBuilder,
    public dialogRef: DialogRef<AuthComponent>,
  ) {
    super({
      hasErrored: false,
      hidePassword: true,
    });
  }

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
          this.updateState({ hasErrored: true });
        },
      });
  }

  onHidePassword() {
    this.updateState({ hidePassword: !this.state.hidePassword });
  }
}
