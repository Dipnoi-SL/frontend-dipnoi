import { RoleEnum } from '../constants/role.enum';

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  role: RoleEnum;
  active: boolean;
}
