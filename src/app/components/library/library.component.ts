import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsComponent } from '../common/params/params.component';
import { GameOrderByEnum, OrderEnum } from '../../constants/enums';
import { StatefulComponent } from '../../directives/stateful-component.directive';
import { GameListComponent } from './game-list/game-list.component';

@Component({
  selector: 'dipnoi-library',
  standalone: true,
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  imports: [CommonModule, ParamsComponent, GameListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent extends StatefulComponent<{
  params: {
    take?: number;
    page?: number;
    orderBy?: GameOrderByEnum;
    order?: OrderEnum;
    search?: string;
  };
}> {
  orderOptionsData = [
    {
      key: 'orderBy',
      value: GameOrderByEnum.NAME,
      text: 'Name',
    },
    {
      key: 'orderBy',
      value: GameOrderByEnum.NUM_VOTES,
      text: 'Interaction',
    },
  ];
  orderOptions = this.orderOptionsData.map((option) => option.text);

  constructor() {
    super({
      params: {
        take: 20,
        orderBy: GameOrderByEnum.NAME,
        order: OrderEnum.ASC,
      },
    });
  }

  handleOnParamsUpdated(params: {
    search?: string;
    selectedFilter: number;
    selectedOrder: number;
  }) {
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
}
