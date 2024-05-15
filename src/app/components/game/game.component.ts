import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dipnoi-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  imports: [CommonModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, OnDestroy {
  params$!: Subscription;

  constructor(
    public gameService: GameService,
    public route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit() {
    this.params$ = this.route.params.subscribe((params) => {
      this.gameService
        .readOne({
          id: parseInt(params[RoutePathEnum.GAME_ID]),
        })
        .subscribe({
          next: (game) => {
            if (!game.active) {
              this.router.navigate(
                [
                  RoutePathEnum.GAMES,
                  this.gameService.selectedGameId,
                  RoutePathEnum.REQUESTS,
                ],
                { replaceUrl: true },
              );
            }
          },
        });
    });
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
  }
}
