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
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { CommentComponent } from '../comment/comment.component';
import { UserService } from '../../../services/user.service';
import { ProposalService } from '../../../services/proposal.service';

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
  }>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) proposalId!: number;

  authUser$!: Subscription;

  constructor(
    public commentService: CommentService,
    public userService: UserService,
    public proposalService: ProposalService,
  ) {
    super({ params: {} });
  }

  ngOnInit() {
    this.updateState({ params: { proposalId: this.proposalId } });

    this.authUser$ = this.userService.authUser$.subscribe(() => {
      this.commentService.readMany(this.state.params).subscribe();
    });
  }

  onScrollEnd() {
    this.commentService.readManyMore(this.state.params)?.subscribe();
  }

  override ngOnDestroy() {
    this.authUser$.unsubscribe();

    super.ngOnDestroy();
  }
}
