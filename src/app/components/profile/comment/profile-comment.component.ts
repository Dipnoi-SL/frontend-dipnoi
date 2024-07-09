import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsComponent } from '../../common/params/params.component';
import { Comment } from '../../../models/comment.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';

@Component({
  selector: 'dipnoi-profile-comment',
  standalone: true,
  templateUrl: './profile-comment.component.html',
  styleUrl: './profile-comment.component.scss',
  imports: [CommonModule, ParamsComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCommentComponent implements OnInit {
  @Input({ required: true }) comment!: Comment;

  proposalQueryParam = {};

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.proposalQueryParam = {
      [RoutePathEnum.SELECTED_PROPOSAL]: this.comment.proposalId,
    };
  }
}
