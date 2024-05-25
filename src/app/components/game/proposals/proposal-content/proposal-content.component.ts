import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../../services/proposal.service';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../../services/user.service';
import { ProposalStateEnum } from '../../../../constants/enums';
import { Proposal } from '../../../../models/proposal.model';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SafeHtmlPipe } from '../../../../pipes/safe-html.pipe';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

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
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalContentComponent
  extends StatefulComponent<{
    changingTo: ProposalStateEnum | null;
    isEditingCost: boolean;
    isEditingDisregardingReason: boolean;
    isSpecifying: boolean;
    isFollowLoading: boolean;
    isTransitionLoading: boolean;
    isSpecificationLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) commentSectionRef!: HTMLElement;
  @Input({ required: true }) proposal!: Proposal;

  stateChangeForm = this.formBuilder.group({
    cost: ['0'],
    disregardingReason: [''],
  });
  specificationForm = this.formBuilder.group({
    finalTitle: ['', Validators.required],
    finalDescription: ['', Validators.required],
  });
  editor$!: Subscription;
  spinners$!: Subscription;
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
    [{ heading: ['h3', 'h4', 'h5', 'h6'] }],
  ];

  constructor(
    public userService: UserService,
    public proposalService: ProposalService,
    public formBuilder: NonNullableFormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public spinnerService: NgxSpinnerService,
  ) {
    super({
      changingTo: null,
      isEditingCost: false,
      isEditingDisregardingReason: false,
      isSpecifying: false,
      isFollowLoading: false,
      isTransitionLoading: false,
      isSpecificationLoading: false,
    });
  }

  ngOnInit() {
    this.editor = new Editor();

    this.editor$ = this.editor.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isFollowLoading) {
        this.spinnerService.show('follow');
      } else {
        this.spinnerService.hide('follow');
      }

      if (state.isTransitionLoading) {
        this.spinnerService.show('transition');
      } else {
        this.spinnerService.hide('transition');
      }

      if (state.isSpecificationLoading) {
        this.spinnerService.show('specification');
      } else {
        this.spinnerService.hide('specification');
      }
    });
  }

  onFollow() {
    this.updateState({ isFollowLoading: true });

    if (this.proposal.followed) {
      this.proposalService
        .deleteOneFollow()
        ?.pipe(
          finalize(() => {
            this.updateState({ isFollowLoading: false });
          }),
        )
        .subscribe();
    } else {
      this.proposalService
        .createOneFollow()
        ?.pipe(
          finalize(() => {
            this.updateState({ isFollowLoading: false });
          }),
        )
        .subscribe();
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

  onSubmitTransition() {
    if (this.state.changingTo) {
      this.updateState({ isTransitionLoading: true });

      if (this.proposal.isPendingReview) {
        if (this.state.changingTo === ProposalStateEnum.FINAL_PHASE) {
          this.proposalService
            .createOrUpdateOneApproval({
              cost: parseInt(this.stateChangeForm.controls.cost.value),
            })
            ?.pipe(
              finalize(() => {
                this.updateState({ isTransitionLoading: false });
              }),
            )
            .subscribe({
              next: () => {
                this.onCancel();
              },
            });
        } else {
          this.proposalService
            .createOrUpdateOneRejection({
              state: this.state.changingTo,
              disregardingReason:
                this.stateChangeForm.controls.disregardingReason.value,
            })
            ?.pipe(
              finalize(() => {
                this.updateState({ isTransitionLoading: false });
              }),
            )
            .subscribe({
              next: () => {
                this.onCancel();
              },
            });
        }
      } else {
        this.proposalService
          .createOneTransition({
            state: this.state.changingTo,
          })
          ?.pipe(
            finalize(() => {
              this.updateState({ isTransitionLoading: false });
            }),
          )
          .subscribe({
            next: () => {
              this.onCancel();
            },
          });
      }
    }
  }

  onSubmitSpecification() {
    this.updateState({ isSpecificationLoading: true });

    this.proposalService
      .createOrUpdateOneSpecification({
        finalTitle: this.specificationForm.controls.finalTitle.value,
        finalDescription:
          this.specificationForm.controls.finalDescription.value,
      })
      ?.pipe(
        finalize(() => {
          this.updateState({ isSpecificationLoading: false });
        }),
      )
      .subscribe({
        next: () => {
          this.onCancel();
        },
      });
  }

  onScrollToCommentSection() {
    this.commentSectionRef.scrollIntoView({ behavior: 'smooth' });
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    this.editor.destroy();

    this.editor$.unsubscribe();

    super.ngOnDestroy();
  }
}
