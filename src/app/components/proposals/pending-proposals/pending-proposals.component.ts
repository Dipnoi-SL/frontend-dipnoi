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
import { Proposal } from '../../../models/proposal.model';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { MyUser } from '../../../models/my-user.model';

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
    pinnedProposals: Proposal[];
  }>
  implements OnInit, OnDestroy
{
  authUser$!: Subscription;

  constructor(
    public proposalService: ProposalService,
    public userService: UserService,
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
      pinnedProposals: [],
    });
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe(
      (authUser: MyUser | null) => {
        if (authUser) {
          this.proposalService
            .readMany({
              take: 3,
              orderBy: ProposalOrderByEnum.CREATED_AT,
              order: OrderEnum.DESC,
              states: [ProposalStateEnum.PENDING_SPECIFICATION],
              userId: authUser.id,
            })
            .subscribe({
              next: (res) => {
                this.updateState({ pinnedProposals: res.data });
              },
            });
        } else {
          this.updateState({ isPinnedShown: true });
        }
      },
    );
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
