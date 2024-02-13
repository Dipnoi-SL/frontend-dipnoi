import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProposalService } from '../../../services/proposal.service';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';
import { ProposalSectionCardComponent } from '../proposal-section-card/proposal-section-card.component';

@Component({
  selector: 'dipnoi-proposal-section-list',
  standalone: true,
  templateUrl: './proposal-section-list.component.html',
  styleUrl: './proposal-section-list.component.scss',
  imports: [
    CommonModule,
    InfiniteScrollModule,
    ProposalSectionCardComponent,
    InsufficientItemsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalSectionListComponent implements OnChanges {
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
}
