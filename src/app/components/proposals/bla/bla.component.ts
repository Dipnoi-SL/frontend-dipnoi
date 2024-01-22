import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import { BehaviorSubject } from 'rxjs';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';

@Component({
  selector: 'dipnoi-bla',
  standalone: true,
  templateUrl: './bla.component.html',
  styleUrl: './bla.component.scss',
  imports: [CommonModule, ProposalListComponent],
})
export class BlaComponent {
  params = new BehaviorSubject<{
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }>({
    states: [],
  });
}
