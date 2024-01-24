import { Routes } from '@angular/router';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { BacklogComponent } from './components/proposals/backlog/backlog.component';

export enum RoutePathEnum {
  ABOUT_US = '/about-us',
  SETTINGS = '/settings',
  HELP = '/help',
  NEWS = '/news',
  PROPOSALS = '/proposals',
  HOME = '/proposals/home',
  BACKLOG = '/proposals/backlog',
  AUTH = 'auth',
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  FORGOT_PASSWORD = 'forgot-password',
  PROPOSAL = 'selected-proposal',
}

export const routes: Routes = [
  {
    path: 'proposals',
    component: ProposalsComponent,
    children: [
      {
        path: 'home',
        component: BacklogComponent,
      },
      {
        path: 'backlog',
        component: BacklogComponent,
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
