import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommentOrderByEnum, OrderEnum } from '../../../../constants/enums';
import { InsufficientItemsDirective } from '../../../../directives/insufficient-items.directive';
import { CommentService } from '../../../../services/comment.service';
import { Subscription, finalize } from 'rxjs';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { CommentComponent } from '../comment/comment.component';
import { UserService } from '../../../../services/user.service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Comment } from '../../../../models/comment.model';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ProposalService } from '../../../../services/proposal.service';

@Component({
  selector: 'dipnoi-comment-list',
  standalone: true,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
  imports: [
    CommonModule,
    InfiniteScrollModule,
    InsufficientItemsDirective,
    CommentComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent
  extends StatefulComponent<{
    params: {
      orderBy?: CommentOrderByEnum;
      order?: OrderEnum;
    };
    isCreateCommentLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;

  createCommentForm = this.formBuilder.group({
    commentToCreate: ['', Validators.required],
  });
  authUser$!: Subscription;
  spinners$!: Subscription;

  constructor(
    public commentService: CommentService,
    public proposalService: ProposalService,
    public userService: UserService,
    public formBuilder: NonNullableFormBuilder,
    public spinnerService: NgxSpinnerService,
  ) {
    super({
      params: {},
      isCreateCommentLoading: false,
    });
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe(() => {
      this.commentService
        .readMany({
          ...this.state.params,
          proposalId: this.proposalService.selectedProposalId,
        })
        .subscribe();
    });

    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isCreateCommentLoading) {
        this.spinnerService.show('create-comment');
      } else {
        this.spinnerService.hide('create-comment');
      }
    });
  }

  onScrollEnd() {
    this.commentService
      .readManyMore({
        ...this.state.params,
        proposalId: this.proposalService.selectedProposalId,
      })
      ?.subscribe();
  }

  onCancel() {
    this.createCommentForm.reset();
  }

  onSubmit() {
    this.updateState({ isCreateCommentLoading: true });

    this.commentService
      .createOne({
        body: this.createCommentForm.controls.commentToCreate.value,
      })
      ?.pipe(
        finalize(() => {
          this.updateState({ isCreateCommentLoading: false });
        }),
      )
      .subscribe({
        next: () => {
          this.onCancel();
        },
      });
  }

  trackById(index: number, comment: Comment) {
    return comment.id;
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    this.authUser$.unsubscribe();

    super.ngOnDestroy();
  }
}
