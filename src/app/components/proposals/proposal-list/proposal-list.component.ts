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
import { Proposal } from '../../../models/proposal.model';
import { PageMeta } from '../../../models/page-meta.model';

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

  proposals?: Proposal[];
  meta?: PageMeta;

  constructor(public proposalService: ProposalService) {}

  ngOnInit() {
    this.proposalService.readMany(this.params).subscribe({
      next: (res) => {
        this.proposals = res.data;
        this.meta = res.meta;
      },
    });
  }

  onScrollEnd() {
    if (this.meta?.hasNextPage) {
      this.proposalService
        .readMany({ ...this.params, page: this.meta.page + 1 })
        .subscribe({
          next: (res) => {
            this.proposals = this.proposals!.concat(res.data);
            this.meta = res.meta;
          },
        });
    }
  }
}
