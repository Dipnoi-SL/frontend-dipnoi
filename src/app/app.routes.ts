import { Routes } from '@angular/router';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { BacklogComponent } from './components/proposals/backlog/backlog.component';
import { OpenProposalsComponent } from './components/proposals/open-proposals/open-proposals.component';
import { HomeComponent } from './components/proposals/home/home.component';
import { PendingProposalsComponent } from './components/proposals/pending-proposals/pending-proposals.component';
import { ChangelogComponent } from './components/proposals/changelog/changelog.component';
import { ArchiveComponent } from './components/proposals/archive/archive.component';
import { PendingReviewComponent } from './components/proposals/pending-review/pending-review.component';

export enum RoutePathEnum {
  ABOUT_US = '/about-us',
  SETTINGS = '/settings',
  HELP = '/help',
  NEWS = '/news',
  PROPOSALS = '/proposals',
  HOME = '/proposals/home',
  BACKLOG = '/proposals/backlog',
  OPEN_PROPOSALS = '/proposals/open-proposals',
  PENDING_PROPOSALS = '/proposals/pending-proposals',
  PENDING_REVIEW = '/proposals/pending-review',
  CHANGELOG = '/proposals/changelog',
  ARCHIVE = '/proposals/archive',
  AUTH = 'auth',
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  ACTIVATE = 'activate',
  PROPOSAL = 'selected-proposal',
  CREATION = 'create',
}

export const routes: Routes = [
  {
    path: 'proposals',
    component: ProposalsComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'backlog',
        component: BacklogComponent,
      },
      {
        path: 'open-proposals',
        component: OpenProposalsComponent,
      },
      {
        path: 'pending-proposals',
        component: PendingProposalsComponent,
      },
      {
        path: 'pending-review',
        component: PendingReviewComponent,
      },
      {
        path: 'changelog',
        component: ChangelogComponent,
      },
      {
        path: 'archive',
        component: ArchiveComponent,
      },
      {
        path: '**',
        redirectTo: RoutePathEnum.HOME,
      },
    ],
  },
  {
    path: '**',
    redirectTo: RoutePathEnum.PROPOSALS,
  },
];
