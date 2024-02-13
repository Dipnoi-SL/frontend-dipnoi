import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { ActivatedRoute } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import { Subscription } from 'rxjs';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { PollService } from '../../../services/poll.service';
import { PollComponent } from '../poll/poll.component';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../services/user.service';
import { ProposalStateEnum } from '../../../constants/enums';
import { ProposalStatsComponent } from '../proposal-stats/proposal-stats.component';

@Component({
  selector: 'dipnoi-proposal-dialog',
  standalone: true,
  templateUrl: './proposal-dialog.component.html',
  styleUrl: './proposal-dialog.component.scss',
  imports: [
    CommonModule,
    CommentListComponent,
    PollComponent,
    NgIconComponent,
    ProposalStatsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalDialogComponent
  extends StatefulComponent<{
    changingTo: ProposalStateEnum | null;
  }>
  implements OnInit, OnDestroy
{
  authUser$!: Subscription;
  proposalId!: number;

  constructor(
    public userService: UserService,
    public proposalService: ProposalService,
    public pollService: PollService,
    public route: ActivatedRoute,
  ) {
    super({ changingTo: null });

    this.proposalId = parseInt(
      this.route.snapshot.queryParams[RoutePathEnum.PROPOSAL],
    );
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe(() => {
      this.proposalService
        .readOne({
          id: this.proposalId,
        })
        .subscribe();

      this.pollService
        .readMany({
          proposalId: this.proposalId,
        })
        .subscribe();
    });
  }

  override ngOnDestroy() {
    this.authUser$?.unsubscribe();

    super.ngOnDestroy();
  }
}
