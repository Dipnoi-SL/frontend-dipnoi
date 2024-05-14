import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'dipnoi-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  imports: [CommonModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  constructor(
    public gameService: GameService,
    public route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit() {
    this.gameService
      .readOne({
        id: parseInt(this.route.snapshot.params[RoutePathEnum.GAME_ID]),
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
  }
}
