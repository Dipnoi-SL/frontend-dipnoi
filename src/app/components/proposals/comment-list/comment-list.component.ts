import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommentOrderByEnum, OrderEnum } from '../../../constants/enums';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'dipnoi-comment-list',
  standalone: true,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
  imports: [CommonModule, InfiniteScrollModule, InsufficientItemsDirective],
})
export class CommentListComponent implements OnInit {
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) proposalId!: number;

  params!: {
    proposalId: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
  };

  constructor(public commentService: CommentService) {}

  ngOnInit() {
    this.params = { proposalId: this.proposalId };

    this.commentService.reset(this.params).subscribe();
  }

  onScrollEnd() {
    this.commentService.readMore(this.params)?.subscribe();
  }
}
