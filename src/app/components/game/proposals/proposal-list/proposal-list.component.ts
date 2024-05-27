import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProposalCardComponent } from '../proposal-card/proposal-card.component';
import { ProposalService } from '../../../../services/proposal.service';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../../constants/enums';
import { InsufficientItemsDirective } from '../../../../directives/insufficient-items.directive';
import { Proposal } from '../../../../models/proposal.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalListComponent implements OnChanges {
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

  constructor(public proposalService: ProposalService) {}

  ngOnChanges() {
    this.proposalService.readMany(this.params).subscribe();
  }

  onScrollEnd() {
    this.proposalService.readManyMore(this.params)?.subscribe();
  }

  trackById(index: number, proposal: Proposal) {
    return proposal.id;
  }
}
