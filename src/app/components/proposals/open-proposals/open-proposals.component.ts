import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';

@Component({
  selector: 'dipnoi-open-proposals',
  standalone: true,
  templateUrl: './open-proposals.component.html',
  styleUrl: './open-proposals.component.scss',
  imports: [CommonModule, ProposalListComponent],
})
export class OpenProposalsComponent {
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
  } = {
    states: [ProposalStateEnum.FINAL_PHASE],
  };
}
