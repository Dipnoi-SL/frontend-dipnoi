import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Game } from '../../../models/game.model';
import { RoutePathEnum } from '../../../app.routes';

@Component({
  selector: 'dipnoi-game-card',
  standalone: true,
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent implements OnInit {
  @Input({ required: true }) game!: Game;

  path?: string;

  constructor(public router: Router) {}

  ngOnInit() {
    this.path = `/${RoutePathEnum.GAMES}/${this.game.id}`;
  }
}
