import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dipnoi-proposal-content',
  standalone: true,
  templateUrl: './proposal-content.component.html',
  styleUrl: './proposal-content.component.scss',
  imports: [
    CommonModule,
    NgIconComponent,
    ReactiveFormsModule,
    SafeHtmlPipe,
    NgxEditorModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalContentComponent
  extends StatefulComponent<{
    changingTo: ProposalStateEnum | null;
    isEditingCost: boolean;
    isEditingDisregardingReason: boolean;
    isSpecifying: boolean;
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) proposal!: Proposal;

  stateChangeForm = this.formBuilder.group({
    cost: [0],
    disregardingReason: [''],
  });
  specificationForm = this.formBuilder.group({
    finalTitle: ['', Validators.required],
    finalDescription: ['', Validators.required],
  });
  editor$!: Subscription;
  editor!: Editor;
  toolbar: Toolbar = [
    [
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'code',
      'bullet_list',
      'ordered_list',
      'image',
      'text_color',
      'background_color',
      'format_clear',
    ],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ];

  constructor(
    public userService: UserService,
    public proposalService: ProposalService,
    public formBuilder: NonNullableFormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    super({
      changingTo: null,
      isEditingCost: false,
      isEditingDisregardingReason: false,
      isSpecifying: false,
    });
  }

  ngOnInit() {
    this.editor = new Editor();

    this.editor$ = this.editor.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
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

  override ngOnDestroy() {
    this.editor.destroy();

    this.editor$.unsubscribe();

    super.ngOnDestroy();
  }
}
