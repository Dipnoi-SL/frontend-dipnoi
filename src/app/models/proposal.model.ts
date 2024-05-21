import { RoutePathEnum } from '../app.routes';
import { ProposalCategoryEnum, ProposalStateEnum } from '../constants/enums';
import { AbstractEntity } from './abstract-entity.model';
import { MyUser } from './my-user.model';
import { User } from './user.model';

export class Proposal extends AbstractEntity {
  initialTitle!: string;
  finalTitle!: string | null;
  initialDescription!: string;
  finalDescription!: string | null;
  thumbnailUri!: string;
  state!: ProposalStateEnum;
  numComments!: number;
  positiveValue!: number;
  negativeValue!: number;
  popularity!: number;
  lastDayPopularity!: number;
  trending!: number;
  cost!: number | null;
  importance!: number;
  importanceWeightsSum!: number;
  priority!: number;
  disregardingReason!: string | null;
  categories!: ProposalCategoryEnum[];
  resetAt!: string | null;
  selectedAt!: string | null;
  completedAt!: string | null;
  disregardedAt!: string | null;
  myImportanceVote?: number | null;
  followed!: boolean;
  user!: User;
  gameId!: number;

  constructor(data: Proposal) {
    super(data);

    Object.assign(this, data);
  }

  get isInitialPhase() {
    return this.state === ProposalStateEnum.INITIAL_PHASE;
  }

  get isPendingSpecification() {
    return this.state === ProposalStateEnum.PENDING_SPECIFICATION;
  }

  get isPendingReview() {
    return this.state === ProposalStateEnum.PENDING_REVIEW;
  }

  get isFinalPhase() {
    return this.state === ProposalStateEnum.FINAL_PHASE;
  }

  get isLastCall() {
    return this.state === ProposalStateEnum.LAST_CALL;
  }

  get isSelectedForDevelopment() {
    return this.state === ProposalStateEnum.SELECTED_FOR_DEVELOPMENT;
  }

  get isInDevelopment() {
    return this.state === ProposalStateEnum.IN_DEVELOPMENT;
  }

  get isCompleted() {
    return this.state === ProposalStateEnum.COMPLETED;
  }

  get isNotBacked() {
    return this.state === ProposalStateEnum.NOT_BACKED;
  }

  get isNotViable() {
    return this.state === ProposalStateEnum.NOT_VIABLE;
  }

  get totalValue() {
    return this.positiveValue + this.negativeValue;
  }

  get prettyTotalValue() {
    const millions = Math.floor(this.totalValue / 1000000);

    if (millions) {
      return millions + 'M';
    }

    const thousands = Math.floor(this.totalValue / 1000);

    if (thousands) {
      return thousands + 'K';
    }

    return Math.round(this.totalValue);
  }

  get prettyCost() {
    if (this.cost === null) {
      return null;
    }

    const millions = Math.floor(this.cost / 1000000);

    if (millions) {
      return millions + 'M';
    }

    const thousands = Math.floor(this.cost / 1000);

    if (thousands) {
      return thousands + 'K';
    }

    return this.cost;
  }

  get prettyImportance() {
    return this.importance.toFixed(2).toString().replace('.', ',');
  }

  get prettyImportanceWeightsSum() {
    return this.importanceWeightsSum.toFixed(2).toString().replace('.', ',');
  }

  get prettyState() {
    return this.state === ProposalStateEnum.INITIAL_PHASE ||
      this.state === ProposalStateEnum.PENDING_SPECIFICATION ||
      this.state === ProposalStateEnum.PENDING_REVIEW
      ? 'Pending'
      : this.state === ProposalStateEnum.FINAL_PHASE ||
          this.state === ProposalStateEnum.LAST_CALL
        ? 'Open'
        : this.state === ProposalStateEnum.SELECTED_FOR_DEVELOPMENT ||
            this.state === ProposalStateEnum.IN_DEVELOPMENT
          ? 'Selected'
          : this.state === ProposalStateEnum.COMPLETED
            ? 'Implemented'
            : 'Archived';
  }

  get prettyDisregardingReason() {
    return this.state === ProposalStateEnum.NOT_BACKED
      ? 'Not backed'
      : this.state === ProposalStateEnum.NOT_VIABLE
        ? 'Not viable'
        : 'None';
  }

  get positiveRatio() {
    return this.totalValue
      ? Math.round((100 * this.positiveValue) / this.totalValue)
      : 0;
  }

  get selectedQueryParam() {
    return { [RoutePathEnum.SELECTED_PROPOSAL]: this.id };
  }

  get lastImportantDate() {
    return this.completedAt
      ? new Date(this.completedAt)
      : this.disregardedAt
        ? new Date(this.disregardedAt)
        : this.selectedAt
          ? new Date(this.selectedAt)
          : this.resetAt
            ? new Date(this.resetAt)
            : new Date(this.createdAt);
  }

  get formattedCreatedAt() {
    return new Date(this.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  get formattedResetAt() {
    return this.resetAt
      ? new Date(this.resetAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : undefined;
  }

  get formattedSelectedAt() {
    return this.selectedAt
      ? new Date(this.selectedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : undefined;
  }

  get formattedCompletedAt() {
    return this.completedAt
      ? new Date(this.completedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : undefined;
  }

  get formattedDisregardedAt() {
    return this.disregardedAt
      ? new Date(this.disregardedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : undefined;
  }

  get formattedLastImportantDate() {
    return this.lastImportantDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  get nextState() {
    return this.state === ProposalStateEnum.INITIAL_PHASE
      ? ProposalStateEnum.PENDING_SPECIFICATION
      : this.state === ProposalStateEnum.PENDING_SPECIFICATION
        ? ProposalStateEnum.PENDING_REVIEW
        : this.state === ProposalStateEnum.PENDING_REVIEW
          ? ProposalStateEnum.FINAL_PHASE
          : this.state === ProposalStateEnum.FINAL_PHASE
            ? ProposalStateEnum.LAST_CALL
            : this.state === ProposalStateEnum.LAST_CALL
              ? ProposalStateEnum.SELECTED_FOR_DEVELOPMENT
              : this.state === ProposalStateEnum.SELECTED_FOR_DEVELOPMENT
                ? ProposalStateEnum.IN_DEVELOPMENT
                : ProposalStateEnum.COMPLETED;
  }

  get previousState() {
    return this.state === ProposalStateEnum.PENDING_SPECIFICATION
      ? ProposalStateEnum.INITIAL_PHASE
      : this.state === ProposalStateEnum.PENDING_REVIEW
        ? ProposalStateEnum.PENDING_SPECIFICATION
        : this.state === ProposalStateEnum.FINAL_PHASE
          ? ProposalStateEnum.PENDING_REVIEW
          : this.state === ProposalStateEnum.LAST_CALL
            ? ProposalStateEnum.FINAL_PHASE
            : this.state === ProposalStateEnum.SELECTED_FOR_DEVELOPMENT
              ? ProposalStateEnum.LAST_CALL
              : this.state === ProposalStateEnum.IN_DEVELOPMENT
                ? ProposalStateEnum.SELECTED_FOR_DEVELOPMENT
                : ProposalStateEnum.IN_DEVELOPMENT;
  }

  isFirstInSection(previousProposal?: Proposal) {
    if (!previousProposal) {
      return true;
    }

    return (
      this.lastImportantDate.getFullYear() !==
        previousProposal.lastImportantDate.getFullYear() ||
      this.lastImportantDate.getMonth() !==
        previousProposal.lastImportantDate.getMonth()
    );
  }

  getCurrentTitle(authUser: MyUser | null) {
    return !this.finalTitle ||
      this.state === ProposalStateEnum.PENDING_SPECIFICATION ||
      (this.state === ProposalStateEnum.PENDING_REVIEW &&
        !authUser?.isDeveloper)
      ? this.initialTitle
      : this.finalTitle;
  }

  getCurrentHtmlDescription(authUser: MyUser | null) {
    const html =
      !this.finalDescription ||
      this.state === ProposalStateEnum.PENDING_SPECIFICATION ||
      (this.state === ProposalStateEnum.PENDING_REVIEW &&
        !authUser?.isDeveloper)
        ? this.initialDescription
        : this.finalDescription;

    return html
      .replace(
        /(<p|<ul|<ol)/g,
        '$1' + ' style="margin-bottom: 15px; margin-top: 0px;"',
      )
      .replace(
        /(<h1|<h2|<h3|<h4|<h5|<h6)/g,
        '$1' + ' style="margin-bottom: 15px; margin-top: 30px;"',
      )
      .replace(/(<[^>]+>)/, function (match) {
        if (match.includes('style=')) {
          return match.replace(
            /style="([^"]*)"/,
            'style="$1; margin-top: 0px;"',
          );
        } else {
          return match.replace(/<([^>]+)>/, '<$1 style="margin-top: 0px;">');
        }
      });
  }

  getCurrentDescription(authUser: MyUser | null) {
    return this.getCurrentHtmlDescription(authUser).replace(/<[^>]*>?/gm, ' ');
  }
}
