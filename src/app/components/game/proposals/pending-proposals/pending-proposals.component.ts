import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../../constants/enums';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { ParamsComponent } from '../../../common/params/params.component';
import { ToggleComponent } from '../toggle/toggle.component';
import { ProposalCardComponent } from '../proposal-card/proposal-card.component';
import { ProposalService } from '../../../../services/proposal.service';
import { UserService } from '../../../../services/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../../app.routes';

@Component({
  selector: 'dipnoi-pending-proposals',
  standalone: true,
  templateUrl: './pending-proposals.component.html',
  styleUrl: './pending-proposals.component.scss',
  imports: [
    CommonModule,
    ProposalListComponent,
    ParamsComponent,
    ToggleComponent,
    ProposalCardComponent,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingProposalsComponent
  extends StatefulComponent<{
    params: {
      take?: number;
      page?: number;
      orderBy?: ProposalOrderByEnum;
      order?: OrderEnum;
      states?: ProposalStateEnum[];
      search?: string;
      createdAt?: string;
      resetAt?: string;
      selectedAt?: string;
      disregardedAt?: string;
      completedAt?: string;
      userId?: number;
    };
    isPinnedShown: boolean;
  }>
  implements OnInit, OnDestroy
{
  authUser$!: Subscription;
  proposalCreationQueryParam = { [RoutePathEnum.CREATION]: true };
  filterOptionsData = [
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      text: 'Day',
    },
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      text: 'Week',
    },
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 30).toISOString(),
      text: 'Month',
    },
    {
      key: 'createdAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 365).toISOString(),
      text: 'Year',
    },
    { key: 'createdAt', text: 'All time' },
  ];
  filterOptions = this.filterOptionsData.map((option) => option.text);
  orderOptionsData = [
    { key: 'orderBy', value: ProposalOrderByEnum.CREATED_AT, text: 'Recent' },
    {
      key: 'orderBy',
      value: ProposalOrderByEnum.POPULARITY,
      text: 'Top rated',
    },
    {
      key: 'orderBy',
      value: ProposalOrderByEnum.INTEREST_WEIGHTS_SUM,
      text: 'Most voted',
    },
  ];
  orderOptions = this.orderOptionsData.map((option) => option.text);

  constructor(
    public proposalService: ProposalService,
    public userService: UserService,
    public route: ActivatedRoute,
  ) {
    super({
      params: {
        states: [
          ProposalStateEnum.INITIAL_PHASE,
          ProposalStateEnum.PENDING_SPECIFICATION,
          ProposalStateEnum.PENDING_REVIEW,
        ],
        orderBy: ProposalOrderByEnum.CREATED_AT,
        order: OrderEnum.DESC,
      },
      isPinnedShown: true,
    });
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.proposalService
          .readManyAsPinned({
            take: 3,
            orderBy: ProposalOrderByEnum.CREATED_AT,
            order: OrderEnum.DESC,
            states: [ProposalStateEnum.PENDING_SPECIFICATION],
            userId: authUser.id,
          })
          .subscribe({
            next: () => {
              this.updateState({ isPinnedShown: true });
            },
          });
      } else {
        this.updateState({ isPinnedShown: false });
      }
    });
  }

  handleOnParamsUpdated(params: {
    search?: string;
    selectedFilter: number;
    selectedOrder: number;
  }) {
    const newParams: Record<string, unknown> = {
      ...this.state.params,
      search: params.search,
      [this.filterOptionsData[params.selectedFilter].key]:
        this.filterOptionsData[params.selectedFilter].value,
      [this.orderOptionsData[params.selectedOrder].key]:
        this.orderOptionsData[params.selectedOrder].value,
    };

    for (const key of Object.keys(newParams)) {
      if (newParams[key] === undefined || newParams[key] === '') {
        delete newParams[key];
      }
    }

    this.updateState({
      params: newParams,
    });
  }

  handleOnToggleUpdated(isToggled: boolean) {
    this.updateState({ isPinnedShown: isToggled });
  }

  override ngOnDestroy() {
    this.authUser$.unsubscribe();

    super.ngOnDestroy();
  }
}
