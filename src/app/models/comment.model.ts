import { AbstractEntity } from './abstract-entity.model';
import { User } from './user.model';

export class Comment extends AbstractEntity {
  body!: string;
  positiveValue!: number;
  negativeValue!: number;
  popularity!: number;
  myFeedback?: boolean | null;
  user!: User;
  proposalId!: number;

  constructor(data: Comment) {
    super(data);

    Object.assign(this, data);
  }
}
