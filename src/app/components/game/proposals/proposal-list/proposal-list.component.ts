import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

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
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalListComponent
  extends StatefulComponent<{ isReloading: boolean }>
  implements OnInit, OnChanges, OnDestroy
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

  spinners$!: Subscription;

  constructor(
    public proposalService: ProposalService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ isReloading: false });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isReloading) {
        this.spinnerService.show('proposal-list');
      } else {
        this.spinnerService.hide('proposal-list');
      }
    });
  }

  ngOnChanges() {
    this.updateState({ isReloading: true });

    this.proposalService
      .readMany(this.params)
      .pipe(
        finalize(() => {
          this.updateState({ isReloading: false });
        }),
      )
      .subscribe();
  }

  onScrollEnd() {
    this.proposalService.readManyMore(this.params)?.subscribe();
  }

  trackById(index: number, proposal: Proposal) {
    return proposal.id;
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    super.ngOnDestroy();
  }
}
