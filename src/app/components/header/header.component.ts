import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabNavigationComponent } from './tab-navigation/tab-navigation.component';
import { AuthInfoComponent } from './auth-info/auth-info.component';
import { RoutePathEnum } from '../../app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dipnoi-header',
  standalone: true,
  imports: [
    CommonModule,
    TabNavigationComponent,
    AuthInfoComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  libraryItem = {
    title: 'Library',
    path: RoutePathEnum.LIBRARY,
  };
}
