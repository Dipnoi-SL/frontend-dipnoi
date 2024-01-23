import { AbstractEntity } from './abstract-entity.model';

export interface Poll extends AbstractEntity {
  label: string | null;
  isInitial: boolean;
  isFinal: boolean;
  positiveValue: number;
  negativeValue: number;
  myInterestVote: boolean | null;
}
