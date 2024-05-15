import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInfoComponent } from './auth-info/auth-info.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';

@Component({
  selector: 'dipnoi-header',
  standalone: true,
  imports: [CommonModule, AuthInfoComponent, MainNavigationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
