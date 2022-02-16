import Book from './book';
import { Nullable } from './generals';

export default interface BookSeries extends Book {
  books: Nullable<number>;
}
