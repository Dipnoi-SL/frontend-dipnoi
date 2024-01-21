import { User } from './user.model';

export interface MyUser extends User {
  email: string;
  active: boolean;
  isBanned: boolean;
  canSocialActivate: boolean;
}
