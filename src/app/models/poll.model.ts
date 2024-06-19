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

    const totalValue = Math.abs(this.positiveValue - this.negativeValue);

    const millions = Math.floor(totalValue / 1000000);

    if (millions) {
      return millions + 'M';
    }

    const thousands = Math.floor(totalValue / 1000);

    if (thousands) {
      return thousands + 'K';
    }

    return Math.floor(totalValue);
  }

  get prettyPositiveValue() {
    if (this.positiveValue === undefined) {
      return;
    }

    const millions = Math.floor(this.positiveValue / 1000000);

    if (millions) {
      return millions + 'M';
    }

    const thousands = Math.floor(this.positiveValue / 1000);

    if (thousands) {
      return thousands + 'K';
    }

    return Math.floor(this.positiveValue);
  }

  get prettyNullValue() {
    if (this.nullValue === undefined) {
      return;
    }

    const millions = Math.floor(this.nullValue / 1000000);

    if (millions) {
      return millions + 'M';
    }

    const thousands = Math.floor(this.nullValue / 1000);

    if (thousands) {
      return thousands + 'K';
    }

    return Math.floor(this.nullValue);
  }

  get prettyNegativeValue() {
    if (this.negativeValue === undefined) {
      return;
    }

    const millions = Math.floor(this.negativeValue / 1000000);

    if (millions) {
      return millions + 'M';
    }

    const thousands = Math.floor(this.negativeValue / 1000);

    if (thousands) {
      return thousands + 'K';
    }

    return Math.floor(this.negativeValue);
  }
}
