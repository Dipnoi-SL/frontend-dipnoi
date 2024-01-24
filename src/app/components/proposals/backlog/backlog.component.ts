import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';

@Component({
  selector: 'dipnoi-backlog',
  standalone: true,
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.scss',
  imports: [CommonModule, ProposalListComponent],
})
export class BacklogComponent {
  params: {
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  } = {
    states: [],
  };
}
