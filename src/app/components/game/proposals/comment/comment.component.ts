import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Comment } from '../../../../models/comment.model';
import { CommentService } from '../../../../services/comment.service';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../../services/user.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { finalize } from 'rxjs';
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
export class CommentComponent extends StatefulComponent<{
  isThumbsUpLoading: boolean;
  isThumbsDownLoading: boolean;
}> {
  @Input({ required: true }) comment!: Comment;

  constructor(
    public userService: UserService,
    public commentService: CommentService,
  ) {
    super({ isThumbsUpLoading: false, isThumbsDownLoading: false });
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
}
