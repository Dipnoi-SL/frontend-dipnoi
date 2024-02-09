import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ParamsComponent } from '../params/params.component';

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
    userId?: number;
  };
}> {
  constructor() {
    super({
      params: {
        states: [
          ProposalStateEnum.SELECTED_FOR_DEVELOPMENT,
          ProposalStateEnum.IN_DEVELOPMENT,
        ],
      },
    });
  }

  handleNewParams(newParams: {
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    this.updateState({ params: { ...this.state.params, ...newParams } });
  }
}
