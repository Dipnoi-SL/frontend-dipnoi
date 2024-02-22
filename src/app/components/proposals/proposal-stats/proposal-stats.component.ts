import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { NgIconComponent } from '@ng-icons/core';
import { Proposal } from '../../../models/proposal.model';
import { PollService } from '../../../services/poll.service';
import { Poll } from '../../../models/poll.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'dipnoi-proposal-stats',
  standalone: true,
  templateUrl: './proposal-stats.component.html',
  styleUrl: './proposal-stats.component.scss',
  imports: [CommonModule, NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalStatsComponent {
  @Input({ required: true }) proposal!: Proposal;

  constructor(
    public proposalService: ProposalService,
    public pollService: PollService,
    public userService: UserService,
  ) {}

  onImportanceVote(myImportanceVote: number) {
    if (myImportanceVote === this.proposal.myImportanceVote) {
      this.proposalService
        .createOrUpdateOneImportanceVote({
          id: this.proposal.id,
          myImportanceVote: null,
        })
        ?.subscribe();
    } else {
      this.proposalService
        .createOrUpdateOneImportanceVote({
          id: this.proposal.id,
          myImportanceVote,
        })
        ?.subscribe();
    }
  }

  onInterestVote(myInterestVote: boolean, poll: Poll) {
    if (myInterestVote === poll.myInterestVote) {
      this.pollService
        .createOrUpdateOneInterestVote({
          id: poll.id,
          myInterestVote: null,
        })
        ?.subscribe();
    } else {
      this.pollService
        .createOrUpdateOneInterestVote({
          id: poll.id,
          myInterestVote,
        })
        ?.subscribe();
    }
  }
}
