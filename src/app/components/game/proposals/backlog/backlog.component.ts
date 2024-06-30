import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../../constants/enums';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { ParamsComponent } from '../../../common/params/params.component';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'dipnoi-backlog',
  standalone: true,
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.scss',
  imports: [CommonModule, ProposalListComponent, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BacklogComponent extends StatefulComponent<{
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
  filterOptionsData = [
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      text: 'Day',
    },
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      text: 'Week',
    },
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 30).toISOString(),
      text: 'Month',
    },
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 365).toISOString(),
      text: 'Year',
    },
    { key: 'selectedAt', text: 'All time' },
  ];
  filterOptions = this.filterOptionsData.map((option) => option.text);
  orderOptionsData = [
    { key: 'orderBy', value: ProposalOrderByEnum.SELECTED_AT, text: 'Recent' },
    {
      key: 'orderBy',
      value: ProposalOrderByEnum.IMPORTANCE,
      text: 'Top importance',
    },
    {
      key: 'orderBy',
      value: ProposalOrderByEnum.COST,
      text: 'Most cost',
    },
  ];
  orderOptions = this.orderOptionsData.map((option) => option.text);

  constructor(public gameService: GameService) {
    super({
      params: {
        states: [
          ProposalStateEnum.SELECTED_FOR_DEVELOPMENT,
          ProposalStateEnum.IN_DEVELOPMENT,
        ],
        orderBy: ProposalOrderByEnum.SELECTED_AT,
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
      [this.filterOptionsData[params.selectedFilter].key]:
        this.filterOptionsData[params.selectedFilter].value,
      [this.orderOptionsData[params.selectedOrder].key]:
        this.orderOptionsData[params.selectedOrder].value,
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
