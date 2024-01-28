import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { StatefulComponent } from '../../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-proposal-dialog',
  standalone: true,
  templateUrl: './proposal-dialog.component.html',
  styleUrl: './proposal-dialog.component.scss',
  imports: [CommonModule, CommentListComponent, PollComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalDialogComponent
  extends StatefulComponent<{ proposal?: Proposal; polls?: Poll[] }>
  implements OnInit, OnDestroy
{
  signedIn$!: Subscription;
  proposalId!: number;

  constructor(
    public authService: AuthService,
    public proposalService: ProposalService,
    public pollService: PollService,
    public route: ActivatedRoute,
  ) {
    super({});

    this.proposalId = parseInt(
      this.route.snapshot.queryParams[RoutePathEnum.PROPOSAL],
    );
  }

  ngOnInit() {
    this.signedIn$ = this.authService.signedIn$.subscribe(() => {
      this.proposalService
        .readOne({
          id: this.proposalId,
        })
        .subscribe({
          next: (res) => {
            this.updateState({ proposal: res });
          },
        });

      this.pollService
        .readMany({
          proposalId: this.proposalId,
        })
        .subscribe({
          next: (res) => {
            this.updateState({ polls: res });
          },
        });
    });
  }

  override ngOnDestroy() {
    this.signedIn$.unsubscribe();

    super.ngOnDestroy();
  }
}
