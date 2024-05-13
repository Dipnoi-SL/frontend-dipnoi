import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../../services/proposal.service';
import { ActivatedRoute } from '@angular/router';
import { RoutePathEnum } from '../../../../app.routes';
import { Subscription } from 'rxjs';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { PollService } from '../../../../services/poll.service';
import { PollComponent } from '../poll/poll.component';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../../services/user.service';
import { ProposalStatsComponent } from '../proposal-stats/proposal-stats.component';
import { ProposalContentComponent } from '../proposal-content/proposal-content.component';

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
    ProposalContentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalDialogComponent implements OnInit, OnDestroy {
  authUser$!: Subscription;
  proposalId!: number;

  constructor(
    public userService: UserService,
    public proposalService: ProposalService,
    public pollService: PollService,
    public route: ActivatedRoute,
  ) {
    this.proposalId = parseInt(
      this.route.snapshot.queryParams[RoutePathEnum.SELECTED_PROPOSAL],
    );
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe(() => {
      this.proposalService
        .readOne({
          id: this.proposalId,
        })
        .subscribe();

      this.pollService.readMany().subscribe();
    });
  }

  ngOnDestroy() {
    this.authUser$.unsubscribe();
  }
}
