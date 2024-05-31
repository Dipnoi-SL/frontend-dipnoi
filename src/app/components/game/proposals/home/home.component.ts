import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../post-list/post-list.component';
import { SpotlightProposalComponent } from '../spotlight-proposal/spotlight-proposal.component';
import { ProposalService } from '../../../../services/proposal.service';
import { SpotlightCommentComponent } from '../spotlight-comment/spotlight-comment.component';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { PostService } from '../../../../services/post.service';
import { PostComponent } from '../post/post.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subscription, finalize } from 'rxjs';
import { OrderEnum, PostOrderByEnum } from '../../../../constants/enums';

@Component({
  selector: 'dipnoi-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    PostListComponent,
    SpotlightProposalComponent,
    SpotlightCommentComponent,
    PostComponent,
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent
  extends StatefulComponent<{
    selectedPost: number;
    isSpotlightReloading: boolean;
    isNewsReloading: boolean;
  }>
  implements OnInit, OnDestroy
{
  spinners$!: Subscription;

  constructor(
    public proposalService: ProposalService,
    public postService: PostService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({
      selectedPost: 0,
      isSpotlightReloading: false,
      isNewsReloading: false,
    });
  }

  ngOnInit() {
    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isSpotlightReloading) {
        this.spinnerService.show('spotlight');
      } else {
        this.spinnerService.hide('spotlight');
      }

      if (state.isNewsReloading) {
        this.spinnerService.show('news');
      } else {
        this.spinnerService.hide('news');
      }
    });

    this.updateState({ isSpotlightReloading: true, isNewsReloading: true });

    this.proposalService
      .readOneAsSpotlight()
      .pipe(
        finalize(() => {
          this.updateState({ isSpotlightReloading: false });
        }),
      )
      .subscribe();

    this.postService
      .readMany({ orderBy: PostOrderByEnum.CREATED_AT, order: OrderEnum.DESC })
      .pipe(
        finalize(() => {
          this.updateState({ isNewsReloading: false });
        }),
      )
      .subscribe();
  }

  onSelectedPostUpdated(index: number) {
    this.updateState({ selectedPost: index });
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    super.ngOnDestroy();
  }
}
