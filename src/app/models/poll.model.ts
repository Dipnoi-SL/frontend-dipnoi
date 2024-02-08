import { AbstractEntity } from './abstract-entity.model';

export interface Poll extends AbstractEntity {
  label: string | null;
  isInitial: boolean;
  isFinal: boolean;
  positiveValue: number;
  negativeValue: number;
  nullValue: number;
  myInterestVote?: boolean | null;
  proposalId: number;
}
