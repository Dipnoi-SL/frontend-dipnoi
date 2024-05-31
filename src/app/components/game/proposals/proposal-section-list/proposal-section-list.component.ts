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
import { ProposalService } from '../../../../services/proposal.service';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../../constants/enums';
import { InsufficientItemsDirective } from '../../../../directives/insufficient-items.directive';
import { ProposalSectionCardComponent } from '../proposal-section-card/proposal-section-card.component';
import { Proposal } from '../../../../models/proposal.model';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

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
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalSectionListComponent
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
        this.spinnerService.show('proposal-section-list');
      } else {
        this.spinnerService.hide('proposal-section-list');
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
