import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
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
import { StatefulComponent } from '../../../directives/stateful-component.directive';

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
export class ProposalListComponent
  extends StatefulComponent<{ proposals?: Proposal[]; meta?: PageMeta }>
  implements OnInit
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

  ngOnInit() {
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
