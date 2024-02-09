import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutePathEnum } from '../../../app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { RoleEnum } from '../../../constants/enums';

@Component({
  selector: 'dipnoi-side-navigation',
  standalone: true,
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavigationComponent {
  navigationFirstSet = [
    { title: 'Home', path: RoutePathEnum.HOME },
    { title: 'Backlog', path: RoutePathEnum.BACKLOG },
  ];
  navigationSecondSet = [
    { title: 'Open proposals', path: RoutePathEnum.OPEN_PROPOSALS },
    { title: 'Pending proposals', path: RoutePathEnum.PENDING_PROPOSALS },
  ];
  navigationThirdSet = [
    { title: 'Changelog', path: RoutePathEnum.CHANGELOG },
    { title: 'Archive', path: RoutePathEnum.ARCHIVE },
  ];
  pendingReviewItem = {
    title: 'Pending review',
    path: RoutePathEnum.PENDING_REVIEW,
  };
  developerRole = RoleEnum.DEVELOPER;

  constructor(public userService: UserService) {}
}
