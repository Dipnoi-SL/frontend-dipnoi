import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../services/user.service';
import { ProposalStateEnum } from '../../../constants/enums';
import { Proposal } from '../../../models/proposal.model';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
  isSpecifying: boolean;
}> {
  @Input({ required: true }) proposal!: Proposal;

  stateChangeForm = this.formBuilder.group({
    cost: [0],
    disregardingReason: [''],
  });
  specificationForm = this.formBuilder.group({
    finalTitle: ['', Validators.required],
    finalDescription: ['', Validators.required],
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
      isSpecifying: false,
    });
  }

  onFollow() {
    if (this.proposal.followed) {
      this.proposalService
        .deleteOneFollow({ id: this.proposal.id })
        ?.subscribe();
    } else {
      this.proposalService
        .createOneFollow({ id: this.proposal.id })
        ?.subscribe();
    }
  }

  onNextState() {
    this.updateState({
      changingTo: this.proposal.nextState,
      isEditingCost: this.proposal.isPendingReview,
      isEditingDisregardingReason: false,
      isSpecifying: this.proposal.isPendingSpecification,
    });
  }

  onPreviousState() {
    this.updateState({
      changingTo: this.proposal.previousState,
      isEditingCost: false,
      isEditingDisregardingReason: this.proposal.isPendingReview,
      isSpecifying: false,
    });
  }

  onDisregard() {
    this.updateState({
      changingTo: ProposalStateEnum.NOT_VIABLE,
      isEditingCost: false,
      isEditingDisregardingReason: true,
      isSpecifying: false,
    });
  }

  onCancel() {
    this.updateState({
      changingTo: null,
      isEditingCost: false,
      isEditingDisregardingReason: false,
      isSpecifying: false,
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
          ?.subscribe();
      } else if (this.proposal.isPendingSpecification) {
        this.proposalService
          .createOrUpdateOneSpecification({
            id: this.proposal.id,
            finalTitle: this.specificationForm.controls.finalTitle.value,
            finalDescription:
              this.specificationForm.controls.finalDescription.value,
          })
          ?.subscribe();
      } else {
        this.proposalService
          .createOneTransition({
            id: this.proposal.id,
            state: this.state.changingTo,
          })
          ?.subscribe();
      }

      this.onCancel();
    }
  }
}
