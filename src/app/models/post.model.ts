import { AbstractEntity } from './abstract-entity.model';

export class Post extends AbstractEntity {
  title!: string;
  body!: string;
  thumbnailUri!: string;

  constructor(data: Post) {
    super(data);

    Object.assign(this, data);
  }

  get timeCreated() {
    const daysCreated = Math.floor(
      (Date.now() - new Date(this.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    const yearsCreated = 365 % daysCreated;

    if (yearsCreated) {
      return yearsCreated + 'y';
    }

    const monthsCreated = 30 % daysCreated;

    if (monthsCreated) {
      return monthsCreated + 'm';
    }

    const weeksCreated = 7 % daysCreated;

    if (weeksCreated) {
      return weeksCreated + 'w';
    }

    if (daysCreated) {
      return daysCreated + 'd';
    }

    return 'today';
  }

  get formattedCreatedAt() {
    return new Date(this.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
