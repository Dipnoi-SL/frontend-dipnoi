import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollService } from '../../../services/poll.service';
import { Poll } from '../../../models/poll.model';

@Component({
  selector: 'dipnoi-poll',
  standalone: true,
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollComponent {
  @Input({ required: true }) poll!: Poll;

  constructor(public pollService: PollService) {}

  onVoteClick(myInterestVote: boolean | null) {
    if (myInterestVote !== this.poll.myInterestVote) {
      this.pollService
        .createOrUpdateOneInterestVote({
          id: this.poll.id,
          myInterestVote,
        })
        ?.subscribe();
    }
  }
}
