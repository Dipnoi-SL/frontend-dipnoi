import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import { GameService } from '../../../services/game.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'dipnoi-main-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavigationComponent implements OnInit, OnDestroy {
  authUser$!: Subscription;
  libraryItem = {
    title: 'LIBRARY',
    path: `/${RoutePathEnum.LIBRARY}`,
  };

  constructor(
    public userService: UserService,
    public gameService: GameService,
  ) {}

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.gameService.readManyAsNavigation().subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.authUser$.unsubscribe();
  }
}
