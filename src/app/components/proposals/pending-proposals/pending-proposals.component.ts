import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-pending-proposals',
  standalone: true,
  templateUrl: './pending-proposals.component.html',
  styleUrl: './pending-proposals.component.scss',
  imports: [CommonModule, ProposalListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingProposalsComponent extends StatefulComponent<{
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
          ProposalStateEnum.INITIAL_PHASE,
          ProposalStateEnum.PENDING_SPECIFICATION,
          ProposalStateEnum.PENDING_REVIEW,
        ],
      },
    });
  }
}
