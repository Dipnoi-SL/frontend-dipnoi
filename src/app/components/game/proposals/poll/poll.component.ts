import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollService } from '../../../../services/poll.service';
import { Poll } from '../../../../models/poll.model';
import { UserService } from '../../../../services/user.service';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'dipnoi-poll',
  standalone: true,
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.scss',
  imports: [CommonModule, NgxSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollComponent
  extends StatefulComponent<{
    isYesLoading: boolean;
    isSkipLoading: boolean;
    isNoLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) poll!: Poll;

  spinners$!: Subscription;

  constructor(
    public userService: UserService,
    public pollService: PollService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ isYesLoading: false, isSkipLoading: false, isNoLoading: false });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isYesLoading) {
        this.spinnerService.show('yes' + this.poll.id);
      } else {
        this.spinnerService.hide('yes' + this.poll.id);
      }

      if (state.isSkipLoading) {
        this.spinnerService.show('skip' + this.poll.id);
      } else {
        this.spinnerService.hide('skip' + this.poll.id);
      }

      if (state.isNoLoading) {
        this.spinnerService.show('no' + this.poll.id);
      } else {
        this.spinnerService.hide('no' + this.poll.id);
      }
    });
  }

  onVote(myInterestVote: boolean | null) {
    if (myInterestVote !== this.poll.myInterestVote) {
      this.updateState({
        isYesLoading: !!myInterestVote,
        isSkipLoading: myInterestVote === null,
        isNoLoading: myInterestVote === false,
      });

      this.pollService
        .createOrUpdateOneInterestVote({
          id: this.poll.id,
          myInterestVote,
        })
        ?.pipe(
          finalize(() => {
            this.updateState({
              isYesLoading: false,
              isSkipLoading: false,
              isNoLoading: false,
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
