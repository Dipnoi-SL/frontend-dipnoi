import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
  gameId!: number;

  constructor(
    public gameService: GameService,
    public route: ActivatedRoute,
  ) {
    this.gameId = parseInt(this.route.snapshot.params[RoutePathEnum.GAME_ID]);
  }

  ngOnInit() {
    this.gameService
      .readOne({
        id: this.gameId,
      })
      .subscribe();
  }
}
