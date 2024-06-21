import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../../constants/enums';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { ParamsComponent } from '../../../common/params/params.component';
import { ProposalSectionListComponent } from '../proposal-section-list/proposal-section-list.component';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'dipnoi-changelog',
  standalone: true,
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
  imports: [CommonModule, ProposalSectionListComponent, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogComponent extends StatefulComponent<{
  params: {
    take?: number;
    page?: number;
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    selectedAt?: string;
    disregardedAt?: string;
    completedAt?: string;
    userId?: number;
    gameId?: number;
  };
}> {
  constructor(public gameService: GameService) {
    super({
      params: {
        states: [ProposalStateEnum.COMPLETED],
        orderBy: ProposalOrderByEnum.COMPLETED_AT,
        order: OrderEnum.DESC,
        gameId: gameService.selectedGameId,
      },
    });
  }

  handleOnParamsUpdated(params: {
    search?: string;
    selectedFilter: number;
    selectedOrder: number;
  }) {
    const newParams: Record<string, unknown> = {
      ...this.state.params,
      search: params.search,
    };

    for (const key of Object.keys(newParams)) {
      if (newParams[key] === undefined || newParams[key] === '') {
        delete newParams[key];
      }
    }

    this.updateState({
      params: newParams,
    });
  }
}
