import Book from './book';

export default interface BookSeries extends Book {
  books: number;
}
