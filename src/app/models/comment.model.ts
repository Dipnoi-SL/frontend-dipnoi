import { RoutePathEnum } from '../app.routes';
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

  get selectedProposalQueryParam() {
    return { [RoutePathEnum.SELECTED_PROPOSAL]: this.proposalId };
  }

  get formattedCreatedAt() {
    return new Date(this.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
