import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../../constants/enums';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { ParamsComponent } from '../params/params.component';

@Component({
  selector: 'dipnoi-pending-review',
  standalone: true,
  templateUrl: './pending-review.component.html',
  styleUrl: './pending-review.component.scss',
  imports: [CommonModule, ProposalListComponent, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingReviewComponent extends StatefulComponent<{
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
  };
}> {
  filterOptionsData = [
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      text: 'Day',
    },
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      text: 'Week',
    },
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 30).toISOString(),
      text: 'Month',
    },
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 365).toISOString(),
      text: 'Year',
    },
    { key: 'createdAt', text: 'All time' },
  ];
  filterOptions = this.filterOptionsData.map((option) => option.text);
  orderOptionsData = [
    { key: 'orderBy', value: ProposalOrderByEnum.CREATED_AT, text: 'Recent' },
    {
      key: 'orderBy',
      value: ProposalOrderByEnum.POPULARITY,
      text: 'Top rated',
    },
    {
      key: 'orderBy',
      value: ProposalOrderByEnum.INTEREST_WEIGHTS_SUM,
      text: 'Most voted',
    },
  ];
  orderOptions = this.orderOptionsData.map((option) => option.text);

  constructor() {
    super({
      params: {
        states: [ProposalStateEnum.PENDING_REVIEW],
        orderBy: ProposalOrderByEnum.CREATED_AT,
        order: OrderEnum.DESC,
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
