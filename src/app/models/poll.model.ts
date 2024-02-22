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

  get totalValue() {
    let totalValue = this.positiveValue + this.negativeValue;

    if (!this.isInitial && !this.isFinal) {
      totalValue += this.nullValue;
    }

    return totalValue;
  }

  get positiveRatio() {
    return this.totalValue
      ? Math.round((100 * this.positiveValue) / this.totalValue)
      : 0;
  }

  get nullRatio() {
    return this.totalValue
      ? Math.round((100 * this.nullValue) / this.totalValue)
      : 0;
  }

  get negativeRatio() {
    return this.totalValue
      ? Math.round((100 * this.negativeValue) / this.totalValue)
      : 0;
  }
}
