import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { Proposal } from '../../../models/proposal.model';
import { ActivatedRoute } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { PollService } from '../../../services/poll.service';
import { PollComponent } from '../poll/poll.component';
import { Poll } from '../../../models/poll.model';

@Component({
  selector: 'dipnoi-proposal-dialog',
  standalone: true,
  templateUrl: './proposal-dialog.component.html',
  styleUrl: './proposal-dialog.component.scss',
  imports: [CommonModule, CommentListComponent, PollComponent],
})
export class ProposalDialogComponent implements OnInit, OnDestroy {
  signedIn$!: Subscription;
  proposalId!: number;
  proposal?: Proposal;
  polls?: Poll[];

  constructor(
    public authService: AuthService,
    public proposalService: ProposalService,
    public pollService: PollService,
    public route: ActivatedRoute,
  ) {
    this.proposalId = parseInt(
      this.route.snapshot.queryParams[RoutePathEnum.PROPOSAL],
    );
  }

  ngOnInit() {
    this.signedIn$ = this.authService.signedIn.subscribe(() => {
      this.proposalService
        .readOne({
          id: this.proposalId,
        })
        .subscribe({
          next: (res) => {
            this.proposal = res;
          },
        });

      this.pollService
        .readMany({
          proposalId: this.proposalId,
        })
        .subscribe({
          next: (res) => {
            this.polls = res;
          },
        });
    });
  }

  ngOnDestroy() {
    this.signedIn$.unsubscribe();
  }
}
