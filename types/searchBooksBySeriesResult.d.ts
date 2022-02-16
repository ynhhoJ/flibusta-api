import BookSeries from './bookSeries';
import { Nullable } from './generals';

export type SearchBooksBySeriesResult = {
  items: Array<BookSeries>
  currentPage: number;
  totalCountItems: Nullable<number>;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
