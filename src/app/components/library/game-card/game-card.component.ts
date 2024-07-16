import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Game } from '../../../models/game.model';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { GameService } from '../../../services/game.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'dipnoi-game-card',
  standalone: true,
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent extends StatefulComponent<{
  isHovered: boolean;
  isAddDropdownOpen: boolean;
}> {
  @Input({ required: true }) game!: Game;

  constructor(
    public router: Router,
    public gameService: GameService,
    public userService: UserService,
  ) {
    super({ isHovered: false, isAddDropdownOpen: false });
  }

  onCardEnter() {
    this.updateState({ isHovered: true });
  }

  onCardLeave() {
    this.updateState({ isHovered: false, isAddDropdownOpen: false });
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(element: HTMLElement) {
    if (!element.closest('.add-button')) {
      this.updateState({
        isAddDropdownOpen: false,
      });
    }
  }

  toggleAddDropdown() {
    this.updateState({
      isAddDropdownOpen: !this.state.isAddDropdownOpen,
    });
  }

  onAddToPlayed() {
    this.gameService.createOnePlayed({ id: this.game.id })?.subscribe();
  }

  onAddToFavorites() {
    this.gameService.createOneFavorite({ id: this.game.id })?.subscribe();
  }

  onAddToWishlist() {
    this.gameService.createOneWishlist({ id: this.game.id })?.subscribe();
  }

  onRemoveFromPlayed() {
    this.gameService.deleteOnePlayed({ id: this.game.id })?.subscribe();
  }

  onRemoveFromFavorites() {
    this.gameService.deleteOneFavorite({ id: this.game.id })?.subscribe();
  }

  onRemoveFromWishlist() {
    this.gameService.deleteOneWishlist({ id: this.game.id })?.subscribe();
  }
}
