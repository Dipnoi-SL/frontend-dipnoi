export class AbstractEntity {
  id!: number;
  createdAt!: string;

  constructor(data: AbstractEntity) {
    Object.assign(this, data);
  }
}
