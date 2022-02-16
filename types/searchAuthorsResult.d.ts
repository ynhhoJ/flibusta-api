import AuthorBooks from './authorsBook';
import { Nullable } from './generals';

export type SearchAuthorsResult = {
  items: Array<AuthorBooks>
  currentPage: number;
  totalCountItems: Nullable<number>;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
