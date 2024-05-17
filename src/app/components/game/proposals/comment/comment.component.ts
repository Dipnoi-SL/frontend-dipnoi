import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Comment } from '../../../../models/comment.model';
import { CommentService } from '../../../../services/comment.service';
import { NgIconComponent } from '@ng-icons/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'dipnoi-comment',
  standalone: true,
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  imports: [CommonModule, NgIconComponent, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input({ required: true }) comment!: Comment;

  constructor(
    public userService: UserService,
    public commentService: CommentService,
  ) {}

  onVote(myFeedback: boolean) {
    if (myFeedback === this.comment.myFeedback) {
      this.commentService
        .createOrUpdateOneFeedback({
          id: this.comment.id,
          myFeedback: null,
        })
        ?.subscribe();
    } else {
      this.commentService
        .createOrUpdateOneFeedback({
          id: this.comment.id,
          myFeedback,
        })
        ?.subscribe();
    }
  }
}
