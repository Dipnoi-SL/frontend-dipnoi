import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../../game/proposals/proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ParamsComponent } from '../../common/params/params.component';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  imports: [CommonModule, ProposalListComponent, ParamsComponent],
  selector: 'dipnoi-profile-proposals',
  standalone: true,
  templateUrl: './profile-proposals.component.html',
  styleUrl: './profile-proposals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileProposalsComponent
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
  }>
  implements OnInit, OnDestroy
{
  filterOptionsData = [
    {
      key: 'resetAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      text: 'Day',
    },
    {
      key: 'resetAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      text: 'Week',
    },
    {
      key: 'resetAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 30).toISOString(),
      text: 'Month',
    },
    {
      key: 'resetAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 365).toISOString(),
      text: 'Year',
    },
    { key: 'resetAt', text: 'All time' },
  ];
  filterOptions = this.filterOptionsData.map((option) => option.text);
  orderOptionsData = [
    { key: 'orderBy', value: ProposalOrderByEnum.RESET_AT, text: 'Recent' },
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
  authUser$!: Subscription;

  constructor(public userService: UserService) {
    super({
      params: {
        states: [ProposalStateEnum.FINAL_PHASE, ProposalStateEnum.LAST_CALL],
        orderBy: ProposalOrderByEnum.RESET_AT,
        order: OrderEnum.DESC,
      },
    });
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.updateState({
          params: { ...this.state.params, userId: authUser.id },
        });
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

  override ngOnDestroy() {
    this.authUser$.unsubscribe();

    super.ngOnDestroy();
  }
}
