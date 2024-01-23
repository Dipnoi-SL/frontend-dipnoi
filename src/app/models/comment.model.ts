import { AbstractEntity } from './abstract-entity.model';
import { User } from './user.model';

export interface Comment extends AbstractEntity {
  body: string;
  positiveValue: number;
  negativeValue: number;
  popularity: number;
  myFeedback: boolean | null;
  user: User;
}
