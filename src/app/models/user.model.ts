import { RoleEnum } from '../constants/enums';

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  role: RoleEnum;
  active: boolean;
}
