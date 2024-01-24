import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';

@Component({
  selector: 'dipnoi-tab-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './tab-navigation.component.html',
  styleUrl: './tab-navigation.component.scss',
})
export class TabNavigationComponent {
  navigationItems = [
    { title: 'Proposals', path: RoutePathEnum.PROPOSALS },
    { title: 'News', path: RoutePathEnum.NEWS },
    { title: 'Help', path: RoutePathEnum.HELP },
  ];
}
