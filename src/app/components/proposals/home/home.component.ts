import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../post-list/post-list.component';
import { SpotlightProposalComponent } from '../spotlight-proposal/spotlight-proposal.component';
import { ProposalService } from '../../../services/proposal.service';
import { CommentService } from '../../../services/comment.service';
import { SpotlightCommentComponent } from '../spotlight-comment/spotlight-comment.component';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { PostService } from '../../../services/post.service';
import { PostComponent } from '../post/post.component';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent
  extends StatefulComponent<{ selectedPost: number }>
  implements OnInit
{
  constructor(
    public proposalService: ProposalService,
    public commentService: CommentService,
    public postService: PostService,
  ) {
    super({ selectedPost: 0 });
  }

  ngOnInit() {
    this.proposalService.readOneAsSpotlight().subscribe();

    this.commentService.readOneAsSpotlight().subscribe();
  }

  onSelectedPostUpdated(index: number) {
    this.updateState({ selectedPost: index });
  }
}
