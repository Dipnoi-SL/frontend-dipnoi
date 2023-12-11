import { Routes } from '@angular/router';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { HelpComponent } from './components/help/help.component';
import { NewsComponent } from './components/news/news.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

export const routes: Routes = [
  { path: 'about-us', component: AboutUsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'news', component: NewsComponent },
  { path: 'proposals', component: ProposalsComponent },
  { path: '**', redirectTo: '/proposals' },
];
