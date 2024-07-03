import { RoutePathEnum } from '../app.routes';
import { AbstractEntity } from './abstract-entity.model';
import { Proposal } from './proposal.model';
import { User } from './user.model';

export class Comment extends AbstractEntity {
  body!: string;
  positiveValue?: number;
  negativeValue?: number;
  popularity?: number;
  lastDayPopularity?: number;
  myFeedback?: boolean | null;
  user!: User;
  proposalId!: number;
  proposal?: Proposal;

  constructor(data: Comment) {
    super(data);

    Object.assign(this, data);

    this.user = new User(data.user);

    if (data.proposal) {
      this.proposal = new Proposal(data.proposal);
    }
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

  get timeCreated() {
    const daysCreated = Math.floor(
      (Date.now() - new Date(this.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    const yearsCreated = Math.floor(daysCreated / 365);

    if (yearsCreated) {
      return yearsCreated + 'y';
    }

    const monthsCreated = Math.floor(daysCreated / 30);

    if (monthsCreated) {
      return monthsCreated + 'm';
    }

    const weeksCreated = Math.floor(daysCreated / 7);

    if (weeksCreated) {
      return weeksCreated + 'w';
    }

    if (daysCreated) {
      return daysCreated + 'd';
    }

    return 'now';
  }
}
