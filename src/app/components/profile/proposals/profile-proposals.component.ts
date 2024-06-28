import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
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
      followed?: boolean;
    };
    userId?: number;
    selectedSection: number;
    isSectionDropdownOpen: boolean;
  }>
  implements OnInit, OnDestroy
{
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
  sectionOptionsData = [
    { key: 'userId', value: undefined, text: 'CREATED' },
    {
      key: 'followed',
      value: undefined,
      text: 'FAVORITES',
    },
  ];
  sectionOptions = this.sectionOptionsData.map((option) => option.text);
  authUser$!: Subscription;

  constructor(public userService: UserService) {
    super({
      params: {
        states: [],
        orderBy: ProposalOrderByEnum.CREATED_AT,
        order: OrderEnum.DESC,
      },
      selectedSection: 0,
      isSectionDropdownOpen: false,
    });
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.updateState({
          params: { ...this.state.params },
          userId: authUser.id,
        });

        if (this.state.selectedSection === 0) {
          this.updateState({
            params: { ...this.state.params, userId: authUser.id },
          });
        }
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(element: HTMLElement) {
    if (!element.closest('.dropdown-button-section')) {
      this.updateState({
        isSectionDropdownOpen: false,
      });
    }
  }

  toggleSectionDropdown() {
    this.updateState({
      isSectionDropdownOpen: !this.state.isSectionDropdownOpen,
    });
  }

  onSectionChange(index: number) {
    const newParams: Record<string, unknown> = {
      ...this.state.params,
      userId: index === 0 ? this.state.userId : undefined,
      followed: index === 1 ? true : undefined,
    };

    for (const key of Object.keys(newParams)) {
      if (newParams[key] === undefined || newParams[key] === '') {
        delete newParams[key];
      }
    }

    this.updateState({
      params: newParams,
      selectedSection: index,
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
