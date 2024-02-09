import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ParamsComponent } from '../params/params.component';

@Component({
  selector: 'dipnoi-changelog',
  standalone: true,
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
  imports: [CommonModule, ProposalListComponent, ParamsComponent],
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

  handleNewParams(newParams: {
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    this.updateState({ params: { ...this.state.params, ...newParams } });
  }
}
