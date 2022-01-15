import Book from './book';
import Author from './authors';

export type SearchBooksByNameResult = {
  items: Array<{ book: Book; authors: Array<Author>; }>
  currentPage: number;
  totalCountItems: number;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
