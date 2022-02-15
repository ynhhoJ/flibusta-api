import Book from './book';
import Author from './authors';

export type BooksByName = {
  book: Book;
  authors: Array<Author>;
};
