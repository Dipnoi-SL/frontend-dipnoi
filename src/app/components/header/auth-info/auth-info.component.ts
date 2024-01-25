import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { RoutePathEnum } from '../../../app.routes';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-auth-info',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  templateUrl: './auth-info.component.html',
  styleUrl: './auth-info.component.scss',
})
export class AuthInfoComponent {
  isDropdownOpen = false;
  signInQueryParams = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  navigationItems = [{ title: 'Settings', path: RoutePathEnum.SETTINGS }];

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public route: ActivatedRoute,
  ) {}

  @HostListener('document:click', ['$event.target'])
  closeDropdown(element: HTMLElement) {
    if (!element.closest('.dropdown-button')) {
      this.isDropdownOpen = false;
    }
  }

  onSignOut() {
    this.authService.signOut().subscribe();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
