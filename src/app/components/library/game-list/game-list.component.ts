import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';
import { GameOrderByEnum, OrderEnum } from '../../../constants/enums';
import { GameService } from '../../../services/game.service';
import { GameCardComponent } from '../game-card/game-card.component';
import { Game } from '../../../models/game.model';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { Subscription, finalize } from 'rxjs';

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
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameListComponent
  extends StatefulComponent<{ isReloading: boolean }>
  implements OnInit, OnChanges, OnDestroy
{
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) params!: {
    take?: number;
    page?: number;
    orderBy?: GameOrderByEnum;
    order?: OrderEnum;
    search?: string;
  };

  spinners$!: Subscription;

  constructor(
    public gameService: GameService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ isReloading: false });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isReloading) {
        this.spinnerService.show('game-list');
      } else {
        this.spinnerService.hide('game-list');
      }
    });
  }

  ngOnChanges() {
    this.updateState({ isReloading: true });

    this.gameService
      .readMany(this.params)
      .pipe(
        finalize(() => {
          this.updateState({ isReloading: false });
        }),
      )
      .subscribe();
  }

  onScrollEnd() {
    this.gameService.readManyMore(this.params)?.subscribe();
  }

  trackById(index: number, game: Game) {
    return game.id;
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    super.ngOnDestroy();
  }
}
