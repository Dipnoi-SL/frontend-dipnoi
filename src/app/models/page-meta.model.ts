export class PageMeta {
  page!: number;
  take!: number;
  itemCount!: number;
  pageCount!: number;
  hasPreviousPage!: boolean;
  hasNextPage!: boolean;

  constructor(data: PageMeta) {
    Object.assign(this, data);
  }
}
