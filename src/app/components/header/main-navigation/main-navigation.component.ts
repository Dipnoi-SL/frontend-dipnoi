import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import { GameService } from '../../../services/game.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { FormsModule } from '@angular/forms';
import { GameOrderByEnum, OrderEnum } from '../../../constants/enums';
import { Game } from '../../../models/game.model';

@Component({
  selector: 'dipnoi-main-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavigationComponent
  extends StatefulComponent<{
    params: {
      search?: string;
      orderBy: GameOrderByEnum;
      order: OrderEnum;
    };
    isAddDropdownOpen: boolean;
  }>
  implements OnInit, OnDestroy
{
  authUser$!: Subscription;
  libraryItem = {
    title: 'LIBRARY',
    path: `/${RoutePathEnum.LIBRARY}`,
  };
  debounceTimeout?: NodeJS.Timeout;
  search = '';

  constructor(
    public userService: UserService,
    public gameService: GameService,
  ) {
    super({
      params: {
        orderBy: GameOrderByEnum.NAME,
        order: OrderEnum.ASC,
      },
      isAddDropdownOpen: false,
    });
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.gameService.readManyAsNavigation().subscribe();
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(element: HTMLElement) {
    if (!element.closest('.add-button')) {
      this.updateState({
        isAddDropdownOpen: false,
      });
    }
  }

  override ngOnDestroy() {
    this.authUser$.unsubscribe();

    super.ngOnDestroy();
  }

  toggleAddDropdown(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.searchbar')) {
      this.updateState({
        isAddDropdownOpen: !this.state.isAddDropdownOpen,
      });

      if (this.state.isAddDropdownOpen) {
        this.gameService.readManyAsDropdown(this.state.params).subscribe();
      }
    }
  }

  debounceSearch() {
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(() => {
      this.updateState({
        params: { ...this.state.params, search: this.search },
      });

      this.gameService.readManyAsDropdown(this.state.params)?.subscribe();
    }, 500);
  }

  isNavigationGame(navigationGames: Game[], game: Game) {
    for (const navigationGame of navigationGames) {
      if (navigationGame.id === game.id) {
        return true;
      }
    }

    return false;
  }

  onAddOrDeleteNavigationGame(navigationGames: Game[], game: Game) {
    if (!this.isNavigationGame(navigationGames, game)) {
      this.gameService.createOneNavigation({ id: game.id })?.subscribe();
    } else {
      this.gameService.deleteOneNavigation({ id: game.id })?.subscribe();
    }
  }

  trackById(index: number, game: Game) {
    return game.id;
  }
}
