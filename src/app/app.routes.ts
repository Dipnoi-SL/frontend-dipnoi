import { Routes } from '@angular/router';
import { MainComponent } from './modules/main/components/main.component';

export const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: '**', component: MainComponent },
];
