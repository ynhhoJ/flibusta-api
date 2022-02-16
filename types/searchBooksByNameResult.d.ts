import { BooksByName } from './booksByName';
import { Nullable } from './generals';

export type SearchBooksByNameResult = {
  items: Array<BooksByName>
  currentPage: number;
  totalCountItems: Nullable<number>;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
