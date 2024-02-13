import { AbstractEntity } from './abstract-entity.model';

export class Poll extends AbstractEntity {
  label!: string | null;
  isInitial!: boolean;
  isFinal!: boolean;
  positiveValue!: number;
  negativeValue!: number;
  nullValue!: number;
  myInterestVote?: boolean | null;
  proposalId!: number;

  constructor(data: Poll) {
    super(data);

    Object.assign(this, data);
  }
}
