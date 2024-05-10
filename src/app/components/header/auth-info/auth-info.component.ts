import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { RoutePathEnum } from '../../../app.routes';
import { NgIconComponent } from '@ng-icons/core';
import { StatefulComponent } from '../../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-auth-info',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  templateUrl: './auth-info.component.html',
  styleUrl: './auth-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthInfoComponent extends StatefulComponent<{
  isDropdownOpen: boolean;
}> {
  signInQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_IN };
  navigationItems = [{ title: 'Settings', path: RoutePathEnum.SETTINGS }];
  profileItem = {
    title: 'MY PROFILE',
    path: RoutePathEnum.PROFILE,
  };

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public route: ActivatedRoute,
  ) {
    super({ isDropdownOpen: false });
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(element: HTMLElement) {
    if (!element.closest('.dropdown-button')) {
      this.updateState({ isDropdownOpen: false });
    }
  }

  onSignOut() {
    this.authService.signOut().subscribe();
  }

  toggleDropdown() {
    this.updateState({ isDropdownOpen: !this.state.isDropdownOpen });
  }
}
