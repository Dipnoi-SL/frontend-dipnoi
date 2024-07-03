import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentOrderByEnum, OrderEnum } from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ParamsComponent } from '../../common/params/params.component';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ProfileCommentListComponent } from '../comment-list/profile-comment-list.component';

@Component({
  imports: [CommonModule, ProfileCommentListComponent, ParamsComponent],
  selector: 'dipnoi-profile-comments',
  standalone: true,
  templateUrl: './profile-comments.component.html',
  styleUrl: './profile-comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCommentsComponent
  extends StatefulComponent<{
    params: {
      take?: number;
      page?: number;
      orderBy?: CommentOrderByEnum;
      order?: OrderEnum;
      userId?: number;
      withProposal?: string;
    };
  }>
  implements OnInit, OnDestroy
{
  orderOptionsData = [
    { key: 'orderBy', value: CommentOrderByEnum.CREATED_AT, text: 'Recent' },
    {
      key: 'orderBy',
      value: CommentOrderByEnum.POPULARITY,
      text: 'Top rated',
    },
  ];
  orderOptions = this.orderOptionsData.map((option) => option.text);
  authUser$!: Subscription;

  constructor(public userService: UserService) {
    super({
      params: {
        orderBy: CommentOrderByEnum.CREATED_AT,
        order: OrderEnum.DESC,
        withProposal: 'true',
      },
    });
  }

  ngOnInit() {
    this.authUser$ = this.userService.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.updateState({
          params: { ...this.state.params, userId: authUser.id },
        });
      }
    });
  }

  handleOnParamsUpdated(params: { search?: string; selectedOrder: number }) {
    const newParams: Record<string, unknown> = {
      ...this.state.params,
      search: params.search,
      [this.orderOptionsData[params.selectedOrder].key]:
        this.orderOptionsData[params.selectedOrder].value,
    };

    for (const key of Object.keys(newParams)) {
      if (newParams[key] === undefined || newParams[key] === '') {
        delete newParams[key];
      }
    }

    this.updateState({
      params: newParams,
    });
  }

  override ngOnDestroy() {
    this.authUser$.unsubscribe();

    super.ngOnDestroy();
  }
}
