import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';

@Component({
  selector: 'dipnoi-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  navigationItems = [
    {
      title: 'OVERVIEW',
      path: RoutePathEnum.OVERVIEW,
    },
    {
      title: 'PROPOSALS',
      path: RoutePathEnum.PROPOSALS,
    },
    {
      title: 'COMMENTS',
      path: RoutePathEnum.COMMENTS,
    },
    {
      title: 'GAMES',
      path: RoutePathEnum.GAMES,
    },
  ];

  constructor(public userService: UserService) {}
}
