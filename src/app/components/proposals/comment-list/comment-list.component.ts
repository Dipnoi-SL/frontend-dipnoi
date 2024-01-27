import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommentOrderByEnum, OrderEnum } from '../../../constants/enums';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';
import { CommentService } from '../../../services/comment.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'dipnoi-comment-list',
  standalone: true,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
  imports: [CommonModule, InfiniteScrollModule, InsufficientItemsDirective],
})
export class CommentListComponent implements OnInit, OnDestroy {
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) proposalId!: number;

  signedIn$!: Subscription;
  params!: {
    proposalId: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
  };

  constructor(
    public commentService: CommentService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.params = { proposalId: this.proposalId };

    this.signedIn$ = this.authService.signedIn.subscribe(() => {
      this.commentService.readMany(this.params).subscribe();
    });
  }

  onScrollEnd() {
    this.commentService.readMore(this.params)?.subscribe();
  }

  ngOnDestroy() {
    this.signedIn$.unsubscribe();
  }
}
