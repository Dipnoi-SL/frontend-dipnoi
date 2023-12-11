import { Routes } from '@angular/router';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { HelpComponent } from './components/help/help.component';

export const routes: Routes = [
  { path: 'help', component: HelpComponent },
  { path: 'proposals', component: ProposalsComponent },
  { path: '**', redirectTo: '/proposals' },
];
