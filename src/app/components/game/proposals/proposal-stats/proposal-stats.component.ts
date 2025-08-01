import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../../services/proposal.service';
import { NgIconComponent } from '@ng-icons/core';
import { Proposal } from '../../../../models/proposal.model';
import { PollService } from '../../../../services/poll.service';
import { Poll } from '../../../../models/poll.model';
import { UserService } from '../../../../services/user.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'dipnoi-proposal-stats',
  standalone: true,
  templateUrl: './proposal-stats.component.html',
  styleUrl: './proposal-stats.component.scss',
  imports: [CommonModule, NgIconComponent, NgxSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalStatsComponent
  extends StatefulComponent<{
    isImportanceLoading: boolean[];
    isPositiveInterestLoading: boolean;
    isNegativeInterestLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) proposal!: Proposal;

  spinners$!: Subscription;

  constructor(
    public proposalService: ProposalService,
    public pollService: PollService,
    public userService: UserService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({
      isImportanceLoading: [],
      isPositiveInterestLoading: false,
      isNegativeInterestLoading: false,
    });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isPositiveInterestLoading) {
        this.spinnerService.show('positive-interest');
      } else {
        this.spinnerService.hide('positive-interest');
      }

      if (state.isNegativeInterestLoading) {
        this.spinnerService.show('negative-interest');
      } else {
        this.spinnerService.hide('negative-interest');
      }

      for (let i = 1; i < 6; i += 1) {
        if (state.isImportanceLoading[i]) {
          this.spinnerService.show('importance-' + i);
        } else {
          this.spinnerService.hide('importance-' + i);
        }
      }
    });
  }

  onImportanceVote(myImportanceVote: number) {
    this.state.isImportanceLoading[myImportanceVote] = true;

    this.updateState({ isImportanceLoading: this.state.isImportanceLoading });

    if (myImportanceVote === this.proposal.myImportanceVote) {
      this.proposalService
        .createOrUpdateOneImportanceVote({
          myImportanceVote: null,
        })
        ?.pipe(
          finalize(() => {
            this.state.isImportanceLoading[myImportanceVote] = false;

            this.updateState({
              isImportanceLoading: this.state.isImportanceLoading,
            });
          }),
        )
        .subscribe();
    } else {
      this.proposalService
        .createOrUpdateOneImportanceVote({
          myImportanceVote,
        })
        ?.pipe(
          finalize(() => {
            this.state.isImportanceLoading[myImportanceVote] = false;

            this.updateState({
              isImportanceLoading: this.state.isImportanceLoading,
            });
          }),
        )
        .subscribe();
    }
  }

  onInterestVote(myInterestVote: boolean, poll: Poll) {
    if (myInterestVote) {
      this.updateState({ isPositiveInterestLoading: true });
    } else {
      this.updateState({ isNegativeInterestLoading: true });
    }

    if (myInterestVote === poll.myInterestVote) {
      this.pollService
        .createOrUpdateOneInterestVote({
          id: poll.id,
          myInterestVote: null,
        })
        ?.pipe(
          finalize(() => {
            this.updateState({
              isPositiveInterestLoading: false,
              isNegativeInterestLoading: false,
            });
          }),
        )
        .subscribe();
    } else {
      this.pollService
        .createOrUpdateOneInterestVote({
          id: poll.id,
          myInterestVote,
        })
        ?.pipe(
          finalize(() => {
            this.updateState({
              isPositiveInterestLoading: false,
              isNegativeInterestLoading: false,
            });
          }),
        )
        .subscribe();
    }
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    super.ngOnDestroy();
  }
}
