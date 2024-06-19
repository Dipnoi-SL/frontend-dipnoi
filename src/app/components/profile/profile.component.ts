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
      title: 'Overview',
      path: RoutePathEnum.OVERVIEW,
    },
    {
      title: 'Games',
      path: RoutePathEnum.GAMES,
    },
    {
      title: 'Proposals',
      path: RoutePathEnum.PROPOSALS,
    },
    {
      title: 'Comments',
      path: RoutePathEnum.COMMENTS,
    },
  ];

  constructor(public userService: UserService) {}
}
