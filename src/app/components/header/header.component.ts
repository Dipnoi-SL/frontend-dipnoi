import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInfoComponent } from './auth-info/auth-info.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';

@Component({
  selector: 'dipnoi-header',
  standalone: true,
  imports: [
    CommonModule,
    AuthInfoComponent,
    MainNavigationComponent,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  libraryItem = {
    title: 'LIBRARY',
    path: `/${RoutePathEnum.LIBRARY}`,
  };
}
