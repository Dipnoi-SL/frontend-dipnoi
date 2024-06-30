import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsComponent } from '../../common/params/params.component';
import { Comment } from '../../../models/comment.model';

@Component({
  selector: 'dipnoi-profile-comment',
  standalone: true,
  templateUrl: './profile-comment.component.html',
  styleUrl: './profile-comment.component.scss',
  imports: [CommonModule, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCommentComponent {
  @Input({ required: true }) comment!: Comment;
}
