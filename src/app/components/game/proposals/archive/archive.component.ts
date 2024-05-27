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

@Component({
  selector: 'dipnoi-archive',
  standalone: true,
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  imports: [CommonModule, ProposalSectionListComponent, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveComponent extends StatefulComponent<{
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
  constructor() {
    super({
      params: {
        states: [ProposalStateEnum.NOT_BACKED, ProposalStateEnum.NOT_VIABLE],
        orderBy: ProposalOrderByEnum.DISREGARDED_AT,
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
