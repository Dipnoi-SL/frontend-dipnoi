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
} from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ParamsComponent } from '../params/params.component';
import { ToggleComponent } from '../toggle/toggle.component';
import { ProposalCardComponent } from '../proposal-card/proposal-card.component';
import { ProposalService } from '../../../services/proposal.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';

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
      userId?: number;
    };
    isPinnedShown: boolean;
  }>
  implements OnInit, OnDestroy
{
  authUser$!: Subscription;
  proposalCreationQueryParam = { [RoutePathEnum.CREATION]: 'proposal' };

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
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    this.updateState({ params: { ...this.state.params, ...params } });
  }

  handleOnToggleUpdated(isToggled: boolean) {
    this.updateState({ isPinnedShown: isToggled });
  }

  override ngOnDestroy() {
    this.authUser$.unsubscribe;

    super.ngOnDestroy();
  }
}
