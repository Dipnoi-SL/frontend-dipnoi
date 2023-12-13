import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';

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
    public readonly userService: UserService,
    public readonly router: Router,
    public readonly route: ActivatedRoute,
  ) {}

  onSignOut() {
    this.userService.signOut().subscribe();
  }

  buildAuthQueryParam() {
    return { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  }
}
