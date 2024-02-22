import { PageMeta } from './page-meta.model';

export interface Page<T> {
  data: T[];
  meta: PageMeta;
}
