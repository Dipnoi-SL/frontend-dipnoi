import { RoutePathEnum } from '../app.routes';
import { ProposalCategoryEnum, ProposalStateEnum } from '../constants/enums';
import { AbstractEntity } from './abstract-entity.model';
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
  completedAt!: string | null;
  disregardedAt!: string | null;
  myImportanceVote?: number | null;
  followed!: boolean;
  user!: User;

  constructor(data: Proposal) {
    super(data);

    Object.assign(this, data);
  }

  get currentTitle() {
    return this.finalTitle ?? this.initialTitle;
  }

  get currentDescription() {
    return this.finalDescription ?? this.initialDescription;
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

  get positiveRatio() {
    return this.totalValue
      ? Math.round((100 * this.positiveValue) / this.totalValue)
      : 0;
  }

  get importanceTag() {
    return this.importance > 4
      ? 'MAX'
      : this.importance > 3
        ? 'HIGH'
        : this.importance > 2
          ? 'MED'
          : this.importance > 1
            ? 'LOW'
            : 'MIN';
  }

  get selectedQueryParam() {
    return { [RoutePathEnum.PROPOSAL]: this.id };
  }

  get finalDate() {
    return this.state === ProposalStateEnum.COMPLETED
      ? new Date(this.completedAt!)
      : new Date(this.disregardedAt!);
  }

  isFirstInSection(previousProposal?: Proposal) {
    if (!previousProposal) {
      return true;
    }

    return (
      this.finalDate.getFullYear() !==
        previousProposal.finalDate.getFullYear() ||
      this.finalDate.getMonth() !== previousProposal.finalDate.getMonth()
    );
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
}
