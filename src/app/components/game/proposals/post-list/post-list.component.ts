import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostOrderByEnum, OrderEnum } from '../../../../constants/enums';
import { InsufficientItemsDirective } from '../../../../directives/insufficient-items.directive';
import { PostService } from '../../../../services/post.service';
import { PostItemComponent } from '../post-item/post-item.component';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { Post } from '../../../../models/post.model';

@Component({
  selector: 'dipnoi-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  imports: [
    CommonModule,
    InfiniteScrollModule,
    InsufficientItemsDirective,
    PostItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent
  extends StatefulComponent<{ selectedPost: number }>
  implements OnInit
{
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;

  @Output() onSelectedUpdated = new EventEmitter<number>();

  constructor(public postService: PostService) {
    super({ selectedPost: 0 });
  }

  ngOnInit() {
    this.postService
      .readMany({ orderBy: PostOrderByEnum.CREATED_AT, order: OrderEnum.DESC })
      .subscribe();
  }

  onScrollEnd() {
    this.postService
      .readManyMore({
        orderBy: PostOrderByEnum.CREATED_AT,
        order: OrderEnum.DESC,
      })
      ?.subscribe();
  }

  onSelected(index: number) {
    this.updateState({ selectedPost: index });

    this.onSelectedUpdated.emit(index);
  }

  trackById(index: number, post: Post) {
    return post.id;
  }
}
