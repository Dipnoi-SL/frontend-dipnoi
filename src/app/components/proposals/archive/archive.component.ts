import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../../../constants/enums';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ParamsComponent } from '../params/params.component';
import { ProposalSectionListComponent } from '../proposal-section-list/proposal-section-list.component';

@Component({
  selector: 'dipnoi-archive',
  standalone: true,
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  imports: [CommonModule, ProposalSectionListComponent, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveComponent extends StatefulComponent<{
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
        states: [ProposalStateEnum.NOT_BACKED, ProposalStateEnum.NOT_VIABLE],
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
