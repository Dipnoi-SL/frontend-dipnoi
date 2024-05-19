import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Game } from '../../../models/game.model';

@Component({
  selector: 'dipnoi-game-card',
  standalone: true,
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  @Input({ required: true }) game!: Game;

  constructor(public router: Router) {}
}
