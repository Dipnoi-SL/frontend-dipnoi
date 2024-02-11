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
import { Proposal } from '../../../models/proposal.model';
import { PageMeta } from '../../../models/page-meta.model';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
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
export class ProposalSectionListComponent
  extends StatefulComponent<{ proposals?: Proposal[]; meta?: PageMeta }>
  implements OnChanges
{
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

  constructor(public proposalService: ProposalService) {
    super({});
  }

  ngOnChanges() {
    this.proposalService.readMany(this.params).subscribe({
      next: (res) => {
        this.updateState({ proposals: res.data, meta: res.meta });
      },
    });
  }

  onScrollEnd() {
    if (this.state.meta?.hasNextPage) {
      this.proposalService
        .readMany({ ...this.params, page: this.state.meta.page + 1 })
        .subscribe({
          next: (res) => {
            this.updateState({
              proposals: this.state.proposals!.concat(res.data),
              meta: res.meta,
            });
          },
        });
    }
  }
}
