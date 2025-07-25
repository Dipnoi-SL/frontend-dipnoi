import { Routes } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GameComponent } from './components/game/game.component';
import { RequestsComponent } from './components/game/requests/requests.component';
import { ProposalsComponent } from './components/game/proposals/proposals.component';
import { HomeComponent } from './components/game/proposals/home/home.component';
import { BacklogComponent } from './components/game/proposals/backlog/backlog.component';
import { OpenProposalsComponent } from './components/game/proposals/open-proposals/open-proposals.component';
import { PendingProposalsComponent } from './components/game/proposals/pending-proposals/pending-proposals.component';
import { PendingReviewComponent } from './components/game/proposals/pending-review/pending-review.component';
import { ChangelogComponent } from './components/game/proposals/changelog/changelog.component';
import { ArchiveComponent } from './components/game/proposals/archive/archive.component';
import { GameActiveGuard } from './guards/game-active.guard';
import { StatsComponent } from './components/game/proposals/stats/stats.component';
import { ProfileOverviewComponent } from './components/profile/overview/profile-overview.component';
import { ProfileGamesComponent } from './components/profile/games/profile-games.component';
import { ProfileProposalsComponent } from './components/profile/proposals/profile-proposals.component';
import { ProfileCommentsComponent } from './components/profile/comments/profile-comments.component';

export enum RoutePathEnum {
  ABOUT_US = 'about-us',
  SETTINGS = 'settings',
  HELP = 'help',
  NEWS = 'news',
  PROPOSALS = 'proposals',
  HOME = 'home',
  BACKLOG = 'backlog',
  OPEN_PROPOSALS = 'open-proposals',
  PENDING_PROPOSALS = 'pending-proposals',
  PENDING_REVIEW = 'pending-review',
  STATS = 'stats',
  CHANGELOG = 'changelog',
  ARCHIVE = 'archive',
  AUTH = 'auth',
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  ACTIVATE = 'activate',
  ACTIVATION_TOKEN = 'activationToken',
  RESET_TOKEN = 'resetToken',
  SELECTED_PROPOSAL = 'selected-proposal',
  CREATION = 'create',
  LIBRARY = 'library',
  PROFILE = 'profile',
  OVERVIEW = 'overview',
  COMMENTS = 'comments',
  GAMES = 'games',
  GAME_ID = 'gameId',
  REQUESTS = 'requests',
}

export const routes: Routes = [
  {
    path: `${RoutePathEnum.GAMES}/:${RoutePathEnum.GAME_ID}`,
    component: GameComponent,
    children: [
      { path: RoutePathEnum.REQUESTS, component: RequestsComponent },
      {
        path: RoutePathEnum.PROPOSALS,
        component: ProposalsComponent,
        canActivate: [GameActiveGuard],
        children: [
          {
            path: RoutePathEnum.HOME,
            component: HomeComponent,
          },
          {
            path: RoutePathEnum.BACKLOG,
            component: BacklogComponent,
          },
          {
            path: RoutePathEnum.OPEN_PROPOSALS,
            component: OpenProposalsComponent,
          },
          {
            path: RoutePathEnum.PENDING_PROPOSALS,
            component: PendingProposalsComponent,
          },
          {
            path: RoutePathEnum.PENDING_REVIEW,
            component: PendingReviewComponent,
          },
          {
            path: RoutePathEnum.STATS,
            component: StatsComponent,
          },
          {
            path: RoutePathEnum.CHANGELOG,
            component: ChangelogComponent,
          },
          {
            path: RoutePathEnum.ARCHIVE,
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
    ],
  },
  {
    path: RoutePathEnum.PROFILE,
    component: ProfileComponent,
    children: [
      {
        path: RoutePathEnum.OVERVIEW,
        component: ProfileOverviewComponent,
      },
      {
        path: RoutePathEnum.GAMES,
        component: ProfileGamesComponent,
      },
      {
        path: RoutePathEnum.PROPOSALS,
        component: ProfileProposalsComponent,
      },
      {
        path: RoutePathEnum.COMMENTS,
        component: ProfileCommentsComponent,
      },
      {
        path: '**',
        redirectTo: RoutePathEnum.OVERVIEW,
      },
    ],
  },
  {
    path: RoutePathEnum.LIBRARY,
    component: LibraryComponent,
  },
  {
    path: '**',
    redirectTo: RoutePathEnum.LIBRARY,
  },
];
