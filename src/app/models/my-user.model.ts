import { User } from './user.model';

export class MyUser extends User {
  email!: string;
  active!: boolean;
  isBanned!: boolean;
  canSocialActivate!: boolean;

  constructor(data: MyUser) {
    super(data);

    Object.assign(this, data);
  }
}
