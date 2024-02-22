import { RoleEnum } from '../constants/enums';
import { AbstractEntity } from './abstract-entity.model';

export class User extends AbstractEntity {
  role!: RoleEnum;
  nickname!: string | null;
  avatarUri!: string;
  reputation!: number;
  popularity!: number;

  constructor(data: User) {
    super(data);

    Object.assign(this, data);
  }

  get isDeveloper() {
    return this.role === RoleEnum.DEVELOPER;
  }
}
