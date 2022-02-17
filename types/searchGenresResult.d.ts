import { Nullable } from './generals';
import { Genres } from '@localTypes/genres';

export type SearchGenresResult = {
  items: Array<Genres>
  currentPage: number;
  totalCountItems: Nullable<number>;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
