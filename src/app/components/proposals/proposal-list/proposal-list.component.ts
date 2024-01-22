import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProposalCardComponent } from '../proposal-card/proposal-card.component';
import { ProposalService } from '../../../services/proposal.service';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';

@Component({
  selector: 'dipnoi-proposal-list',
  standalone: true,
  templateUrl: './proposal-list.component.html',
  styleUrl: './proposal-list.component.scss',
  imports: [
    CommonModule,
    InfiniteScrollModule,
    ProposalCardComponent,
    InsufficientItemsDirective,
  ],
})
export class ProposalListComponent implements OnInit {
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) params!: {
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  };

  constructor(public proposalService: ProposalService) {}

  ngOnInit() {
    this.proposalService.reset(this.params).subscribe();
  }

  onScrollEnd() {
    this.proposalService.readMore(this.params)?.subscribe();
  }
}
