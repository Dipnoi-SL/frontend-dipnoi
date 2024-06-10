import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutePathEnum } from '../../../../app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-side-navigation',
  standalone: true,
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss',
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavigationComponent {
  homeItem = {
    title: 'Home',
    path: RoutePathEnum.HOME,
  };

  backlogItem = {
    title: 'Backlog',
    path: RoutePathEnum.BACKLOG,
  };

  openProposalsItem = {
    title: 'Open proposals',
    path: RoutePathEnum.OPEN_PROPOSALS,
  };

  pendingProposalsItem = {
    title: 'Pending proposals',
    path: RoutePathEnum.PENDING_PROPOSALS,
  };

  changelogItem = {
    title: 'Changelog',
    path: RoutePathEnum.CHANGELOG,
  };

  archiveItem = {
    title: 'Archive',
    path: RoutePathEnum.ARCHIVE,
  };

  pendingReviewItem = {
    title: 'Pending review',
    path: RoutePathEnum.PENDING_REVIEW,
  };

  statsItem = {
    title: 'Stats',
    path: RoutePathEnum.STATS,
  };

  constructor(public userService: UserService) {}
}
