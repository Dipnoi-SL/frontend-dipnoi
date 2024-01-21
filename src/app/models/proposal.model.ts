import { ProposalCategoryEnum, ProposalStateEnum } from '../constants/enums';
import { AbstractEntity } from './abstract-entity.model';
import { User } from './user.model';

export interface Proposal extends AbstractEntity {
  initialTitle: string;
  finalTitle: string | null;
  initialDescription: string;
  finalDescription: string | null;
  thumbnailUri: string;
  state: ProposalStateEnum;
  numComments: number;
  positiveValue: number;
  negativeValue: number;
  popularity: number;
  lastDayPopularity: number;
  trending: number;
  cost: number | null;
  importance: number;
  priority: number;
  disregardingReason: string | null;
  categories: ProposalCategoryEnum[];
  resetAt: string | null;
  completedAt: string | null;
  disregardedAt: string | null;
  myImportanceVote: number | null;
  followed: boolean;
  user: User;
}
