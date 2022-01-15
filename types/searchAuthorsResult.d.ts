import AuthorBooks from './authorsBook';

export type SearchAuthorsResult = {
  items: Array<AuthorBooks>
  currentPage: number;
  totalCountItems: number;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
