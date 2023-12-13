import { Routes } from '@angular/router';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { HelpComponent } from './components/help/help.component';
import { NewsComponent } from './components/news/news.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { BlaComponent } from './components/proposals/bla/bla.component';

export enum RoutePathEnum {
  ABOUT_US = 'about-us',
  SETTINGS = 'settings',
  HELP = 'help',
  NEWS = 'news',
  PROPOSALS = 'proposals',
  BLA = 'bla',
  BLABLA = 'blabla',
  AUTH = 'auth',
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  FORGOT_PASSWORD = 'forgot-password',
  PROPOSAL = 'selected-proposal',
}

export const routes: Routes = [
  { path: RoutePathEnum.ABOUT_US, component: AboutUsComponent },
  { path: RoutePathEnum.SETTINGS, component: SettingsComponent },
  { path: RoutePathEnum.HELP, component: HelpComponent },
  { path: RoutePathEnum.NEWS, component: NewsComponent },
  {
    path: RoutePathEnum.PROPOSALS,
    component: ProposalsComponent,
    children: [
      {
        path: RoutePathEnum.BLA,
        component: BlaComponent,
      },
      {
        path: RoutePathEnum.BLABLA,
        component: HelpComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: `/${RoutePathEnum.PROPOSALS}/${RoutePathEnum.BLA}`,
  },
];
