import { AbstractEntity } from './abstract-entity.model';

export class Poll extends AbstractEntity {
  label!: string | null;
  isInitial!: boolean;
  isFinal!: boolean;
  positiveValue?: number;
  negativeValue?: number;
  nullValue?: number;
  myInterestVote?: boolean | null;
  proposalId!: number;

  constructor(data: Poll) {
    super(data);

    Object.assign(this, data);
  }

  get totalValue() {
    if (
      this.positiveValue === undefined ||
      this.negativeValue === undefined ||
      this.nullValue === undefined
    ) {
      return;
    }

    let totalValue = this.positiveValue + this.negativeValue;

    if (!this.isInitial && !this.isFinal) {
      totalValue += this.nullValue;
    }

    return totalValue;
  }

  get positiveRatio() {
    if (!this.totalValue || this.positiveValue === undefined) {
      return;
    }

    return Math.round((100 * this.positiveValue) / this.totalValue);
  }

  get nullRatio() {
    if (!this.totalValue || this.nullValue === undefined) {
      return;
    }

    return Math.round((100 * this.nullValue) / this.totalValue);
  }

  get negativeRatio() {
    if (!this.totalValue || this.negativeValue === undefined) {
      return;
    }

    return Math.round((100 * this.negativeValue) / this.totalValue);
  }

  get balance() {
    if (this.positiveValue === undefined || this.negativeValue === undefined) {
      return;
    }

    return Math.round(Math.abs(this.positiveValue - this.negativeValue));
  }

  get prettyPositiveValue() {
    if (this.positiveValue === undefined) {
      return;
    }

    return Math.round(this.positiveValue);
  }

  get prettyNullValue() {
    if (this.nullValue === undefined) {
      return;
    }

    return Math.round(this.nullValue);
  }

  get prettyNegativeValue() {
    if (this.negativeValue === undefined) {
      return;
    }

    return Math.round(this.negativeValue);
  }
}
