import Author from './authors';
import { Nullable } from './generals';

export default interface AuthorBooks extends Author {
  books: Nullable<number>;
  translations: Nullable<number>;
}
