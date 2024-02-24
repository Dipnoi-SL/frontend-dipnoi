import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Comment } from '../../../models/comment.model';

@Component({
  selector: 'dipnoi-spotlight-comment',
  standalone: true,
  templateUrl: './spotlight-comment.component.html',
  styleUrl: './spotlight-comment.component.scss',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpotlightCommentComponent {
  @Input({ required: true }) comment!: Comment;

  constructor(public route: ActivatedRoute) {}
}
