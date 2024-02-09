import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';

@Component({
  selector: 'dipnoi-changelog',
  standalone: true,
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
  imports: [CommonModule, ProposalListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogComponent extends StatefulComponent<{
  params: {
    take?: number;
    page?: number;
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  };
}> {
  constructor() {
    super({
      params: {
        states: [ProposalStateEnum.COMPLETED],
      },
    });
  }
}
