import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Subscription, finalize } from 'rxjs';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { InsufficientItemsDirective } from '../../../directives/insufficient-items.directive';
import { CommentOrderByEnum, OrderEnum } from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { CommentService } from '../../../services/comment.service';
import { ProfileCommentComponent } from '../comment/profile-comment.component';
import { Comment } from '../../../models/comment.model';

@Component({
  selector: 'dipnoi-profile-comment-list',
  standalone: true,
  templateUrl: './profile-comment-list.component.html',
  styleUrl: './profile-comment-list.component.scss',
  imports: [
    CommonModule,
    InfiniteScrollModule,
    InsufficientItemsDirective,
    NgxSpinnerComponent,
    ProfileCommentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCommentListComponent
  extends StatefulComponent<{ isReloading: boolean }>
  implements OnInit, OnChanges, OnDestroy
{
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;
  @Input({ required: true }) params!: {
    take?: number;
    page?: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
    userId?: number;
    withProposal?: string;
  };

  spinners$!: Subscription;

  constructor(
    public commentService: CommentService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ isReloading: false });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isReloading) {
        this.spinnerService.show('profile-comment-list');
      } else {
        this.spinnerService.hide('profile-comment-list');
      }
    });
  }

  ngOnChanges() {
    this.updateState({ isReloading: true });

    this.commentService
      .readManyAsProfile(this.params)
      .pipe(
        finalize(() => {
          this.updateState({ isReloading: false });
        }),
      )
      .subscribe();
  }

  onScrollEnd() {
    this.commentService.readManyMoreAsProfile(this.params)?.subscribe();
  }

  trackById(index: number, comment: Comment) {
    return comment.id;
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    super.ngOnDestroy();
  }
}
