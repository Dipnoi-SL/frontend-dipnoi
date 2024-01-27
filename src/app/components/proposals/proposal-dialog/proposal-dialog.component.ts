import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { ProposalContentComponent } from '../proposal-content/proposal-content.component';
import { Proposal } from '../../../models/proposal.model';
import { ActivatedRoute } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { PollService } from '../../../services/poll.service';

@Component({
  selector: 'dipnoi-proposal-dialog',
  standalone: true,
  templateUrl: './proposal-dialog.component.html',
  styleUrl: './proposal-dialog.component.scss',
  imports: [CommonModule, ProposalContentComponent, CommentListComponent],
})
export class ProposalDialogComponent implements OnInit, OnDestroy {
  signedIn$!: Subscription;
  proposalId!: number;
  initialProposal?: Proposal;

  constructor(
    public authService: AuthService,
    public proposalService: ProposalService,
    public pollService: PollService,
    public route: ActivatedRoute,
  ) {
    this.proposalId = parseInt(
      this.route.snapshot.queryParams[RoutePathEnum.PROPOSAL],
    );

    this.initialProposal = this.proposalService.proposalsList.value.find(
      (proposal) => proposal.id === this.proposalId,
    );
  }

  ngOnInit() {
    this.signedIn$ = this.authService.signedIn.subscribe(() => {
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

  ngOnDestroy() {
    this.signedIn$.unsubscribe();
  }
}
