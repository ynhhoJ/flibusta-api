import { BooksByName } from './booksByName';

export type SearchBooksByNameResult = {
  items: Array<BooksByName>
  currentPage: number;
  totalCountItems: number;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
