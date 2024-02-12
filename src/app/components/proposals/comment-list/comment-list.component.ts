import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommentOrderByEnum, OrderEnum } from '../../../constants/enums';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';
import { CommentService } from '../../../services/comment.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Comment } from '../../../models/comment.model';
import { PageMeta } from '../../../models/page-meta.model';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { CommentComponent } from '../comment/comment.component';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent
  extends StatefulComponent<{
    params: {
      proposalId?: number;
      orderBy?: CommentOrderByEnum;
      order?: OrderEnum;
    };
    comments?: Comment[];
    meta?: PageMeta;
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) proposalId!: number;

  signedIn$!: Subscription;

  constructor(
    public commentService: CommentService,
    public authService: AuthService,
  ) {
    super({ params: {} });
  }

  ngOnInit() {
    this.updateState({ params: { proposalId: this.proposalId } });

    this.signedIn$ = this.authService.signedIn$.subscribe(() => {
      this.commentService.readMany(this.state.params).subscribe({
        next: (res) => {
          this.updateState({ comments: res.data, meta: res.meta });
        },
      });
    });
  }

  onScrollEnd() {
    if (this.state.meta?.hasNextPage) {
      this.commentService
        .readMany({ ...this.state.params, page: this.state.meta.page + 1 })
        .subscribe({
          next: (res) => {
            this.updateState({
              comments: this.state.comments!.concat(res.data),
              meta: res.meta,
            });
          },
        });
    }
  }

  override ngOnDestroy() {
    this.signedIn$.unsubscribe();

    super.ngOnDestroy();
  }
}
