import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';
import { GameOrderByEnum, OrderEnum } from '../../../constants/enums';
import { GameService } from '../../../services/game.service';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'dipnoi-game-list',
  standalone: true,
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
  imports: [
    CommonModule,
    InfiniteScrollModule,
    GameCardComponent,
    InsufficientItemsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameListComponent implements OnChanges {
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) params!: {
    take?: number;
    page?: number;
    orderBy?: GameOrderByEnum;
    order?: OrderEnum;
    search?: string;
  };

  constructor(public gameService: GameService) {}

  ngOnChanges() {
    this.gameService.readMany(this.params).subscribe();
  }

  onScrollEnd() {
    this.gameService.readManyMore(this.params)?.subscribe();
  }
}
