import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'dipnoi-post-item',
  standalone: true,
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss',
  imports: [CommonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {
  @Input({ required: true }) post!: Post;
  @Input() selected = false;
}
