import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../models/comment.model';
import { CommentService } from '../../../services/comment.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-comment',
  standalone: true,
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  imports: [CommonModule, NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input({ required: true }) comment!: Comment;

  constructor(public commentService: CommentService) {}

  onVoteClick(myFeedback: boolean | null) {
    this.commentService
      .createOrUpdateOneFeedback({
        id: this.comment.id,
        myFeedback,
      })
      .subscribe();
  }
}
