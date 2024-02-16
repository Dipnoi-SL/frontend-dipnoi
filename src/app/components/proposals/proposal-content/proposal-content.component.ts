import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../services/user.service';
import { ProposalStateEnum } from '../../../constants/enums';
import { Proposal } from '../../../models/proposal.model';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'dipnoi-proposal-content',
  standalone: true,
  templateUrl: './proposal-content.component.html',
  styleUrl: './proposal-content.component.scss',
  imports: [CommonModule, NgIconComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalContentComponent extends StatefulComponent<{
  changingTo: ProposalStateEnum | null;
  isEditingCost: boolean;
  isEditingDisregardingReason: boolean;
}> {
  @Input({ required: true }) proposal!: Proposal;

  stateChangeForm = this.formBuilder.group({
    cost: [0],
    disregardingReason: [''],
  });

  constructor(
    public userService: UserService,
    public proposalService: ProposalService,
    public formBuilder: NonNullableFormBuilder,
  ) {
    super({
      changingTo: null,
      isEditingCost: false,
      isEditingDisregardingReason: false,
    });
  }

  onFollow() {
    if (this.proposal.followed) {
      this.proposalService
        .deleteOneFollow({ id: this.proposal.id })
        .subscribe();
    } else {
      this.proposalService
        .createOneFollow({ id: this.proposal.id })
        .subscribe();
    }
  }

  onNextState() {
    this.updateState({
      changingTo: this.proposal.nextState,
      isEditingCost: this.proposal.isPendingReview,
      isEditingDisregardingReason: false,
    });
  }

  onPreviousState() {
    this.updateState({
      changingTo: this.proposal.previousState,
      isEditingCost: false,
      isEditingDisregardingReason: this.proposal.isPendingReview,
    });
  }

  onDisregard() {
    this.updateState({
      changingTo: ProposalStateEnum.NOT_VIABLE,
      isEditingCost: false,
      isEditingDisregardingReason: true,
    });
  }

  onCancel() {
    this.updateState({
      changingTo: null,
      isEditingCost: false,
      isEditingDisregardingReason: false,
    });
  }

  onSubmit() {
    if (this.state.changingTo) {
      if (this.proposal.isPendingReview) {
        this.proposalService
          .createOrUpdateOneReview({
            id: this.proposal.id,
            state: this.state.changingTo,
            cost:
              this.state.changingTo === ProposalStateEnum.FINAL_PHASE
                ? this.stateChangeForm.controls.cost.value
                : undefined,
            disregardingReason:
              this.state.changingTo === ProposalStateEnum.FINAL_PHASE
                ? undefined
                : this.stateChangeForm.controls.disregardingReason.value,
          })
          .subscribe();
      } else {
        this.proposalService
          .createOneTransition({
            id: this.proposal.id,
            state: this.state.changingTo,
          })
          .subscribe();
      }
    }
  }
}
