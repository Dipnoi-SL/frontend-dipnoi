import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'dipnoi-post',
  standalone: true,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  @Input({ required: true }) post!: Post;
}
