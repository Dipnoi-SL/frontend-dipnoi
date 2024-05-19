import { RoutePathEnum } from '../app.routes';
import { AbstractEntity } from './abstract-entity.model';

export class Game extends AbstractEntity {
  name!: string;
  thumbnailUri!: string;
  iconUri!: string;
  active!: boolean;
  myRequest?: boolean | null;

  constructor(data: Game) {
    super(data);

    Object.assign(this, data);
  }

  get selectedGameRoutePath() {
    return `/${RoutePathEnum.GAMES}/${this.id}`;
  }
}
