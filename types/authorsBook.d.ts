import Author from './authors';

export default interface AuthorBooks extends Author {
  books: number;
  translations: number;
}
