import { AbstractEntity } from './abstract-entity.model';

export class Post extends AbstractEntity {
  title!: string;
  body!: string;
  thumbnailUri!: string;
  gameId!: number;

  constructor(data: Post) {
    super(data);

    Object.assign(this, data);
  }

  get timeCreated() {
    const daysCreated = Math.floor(
      (Date.now() - new Date(this.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    const yearsCreated = Math.floor(daysCreated / 365);

    if (yearsCreated) {
      return yearsCreated + 'y';
    }

    const monthsCreated = Math.floor(daysCreated / 30);

    if (monthsCreated) {
      return monthsCreated + 'm';
    }

    const weeksCreated = Math.floor(daysCreated / 7);

    if (weeksCreated) {
      return weeksCreated + 'w';
    }

    if (daysCreated) {
      return daysCreated + 'd';
    }

    return 'now';
  }

  get formattedCreatedAt() {
    return new Date(this.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  get htmlBody() {
    return this.body
      .replace(
        /(<p|<ul|<ol)/g,
        '$1' + ' style="margin-bottom: 15px; margin-top: 0px;"',
      )
      .replace(
        /(<h1|<h2|<h3|<h4|<h5|<h6)/g,
        '$1' + ' style="margin-bottom: 15px; margin-top: 30px;"',
      );
  }
}
