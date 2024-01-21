import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'dipnoi-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input({ required: true }) tabPanelRef!: MatTabNavPanel;

  proposalsPath = `/${RoutePathEnum.PROPOSALS}`;
  blaPath = `/${RoutePathEnum.BLA}`;
  newsPath = `/${RoutePathEnum.NEWS}`;
  helpPath = `/${RoutePathEnum.HELP}`;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public router: Router,
    public route: ActivatedRoute,
  ) {}

  onSignOut() {
    this.authService.signOut().subscribe();
  }

  buildAuthQueryParam() {
    return { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  }
}
