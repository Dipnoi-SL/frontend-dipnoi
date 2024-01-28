import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutePathEnum } from '../../../app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dipnoi-side-navigation',
  standalone: true,
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss',
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class SideNavigationComponent {
  navigationItems = [
    { title: 'Home', path: RoutePathEnum.HOME },
    { title: 'Backlog', path: RoutePathEnum.BACKLOG },
    { title: 'Open proposals', path: RoutePathEnum.OPEN_PROPOSALS },
  ];
}
