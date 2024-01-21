import { RoleEnum } from '../constants/enums';
import { AbstractEntity } from './abstract-entity.model';

export interface User extends AbstractEntity {
  role: RoleEnum;
  nickname: string | null;
  avatarUri: string;
  reputation: number;
  popularity: number;
}
