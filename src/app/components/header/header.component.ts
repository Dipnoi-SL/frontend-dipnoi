import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabNavigationComponent } from './tab-navigation/tab-navigation.component';
import { AuthInfoComponent } from './auth-info/auth-info.component';

@Component({
  selector: 'dipnoi-header',
  standalone: true,
  imports: [CommonModule, TabNavigationComponent, AuthInfoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
