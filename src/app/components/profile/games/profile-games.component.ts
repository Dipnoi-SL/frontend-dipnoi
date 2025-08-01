import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { GameOrderByEnum, OrderEnum } from '../../../constants/enums';
import { ParamsComponent } from '../../common/params/params.component';
import { GameListComponent } from '../../library/game-list/game-list.component';

@Component({
  selector: 'dipnoi-profile-games',
  standalone: true,
  templateUrl: './profile-games.component.html',
  styleUrl: './profile-games.component.scss',
  imports: [CommonModule, ParamsComponent, GameListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileGamesComponent extends StatefulComponent<{
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
        take: 50,
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
