import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'dipnoi-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    public readonly userService: UserService,
    public dialog: MatDialog,
  ) {}

  onSignIn() {
    this.dialog.open(AuthComponent, { data: { view: 'sign-in' } });
  }

  onSignOut() {
    this.userService.signOut().subscribe();
  }
}
