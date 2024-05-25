import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Comment } from '../../../../models/comment.model';
import { CommentService } from '../../../../services/comment.service';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../../services/user.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subscription, finalize } from 'rxjs';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-comment',
  standalone: true,
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  imports: [
    CommonModule,
    NgIconComponent,
    NgOptimizedImage,
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent
  extends StatefulComponent<{
    isThumbsUpLoading: boolean;
    isThumbsDownLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) comment!: Comment;

  spinners$!: Subscription;

  constructor(
    public userService: UserService,
    public commentService: CommentService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ isThumbsUpLoading: false, isThumbsDownLoading: false });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isThumbsUpLoading) {
        this.spinnerService.show('thumbs-up' + this.comment.id);
      } else {
        this.spinnerService.hide('thumbs-up' + this.comment.id);
      }

      if (state.isThumbsDownLoading) {
        this.spinnerService.show('thumbs-down' + this.comment.id);
      } else {
        this.spinnerService.hide('thumbs-down' + this.comment.id);
      }
    });
  }

  onVote(myFeedback: boolean) {
    if (myFeedback) {
      this.updateState({ isThumbsUpLoading: true });
    } else {
      this.updateState({ isThumbsDownLoading: true });
    }

    if (myFeedback === this.comment.myFeedback) {
      this.commentService
        .createOrUpdateOneFeedback({
          id: this.comment.id,
          myFeedback: null,
        })
        ?.pipe(
          finalize(() => {
            this.updateState({
              isThumbsUpLoading: false,
              isThumbsDownLoading: false,
            });
          }),
        )
        .subscribe();
    } else {
      this.commentService
        .createOrUpdateOneFeedback({
          id: this.comment.id,
          myFeedback,
        })
        ?.pipe(
          finalize(() => {
            this.updateState({
              isThumbsUpLoading: false,
              isThumbsDownLoading: false,
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
