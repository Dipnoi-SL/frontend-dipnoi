import { Routes } from '@angular/router';
import { ProposalsComponent } from './components/proposals/proposals.component';

export const routes: Routes = [
  { path: 'proposals', component: ProposalsComponent },
  { path: '**', redirectTo: '/proposals' },
];
