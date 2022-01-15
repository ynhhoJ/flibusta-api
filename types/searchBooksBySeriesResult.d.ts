import BookSeries from './bookSeries';

export type SearchBooksBySeriesResult = {
  items: Array<BookSeries>
  currentPage: number;
  totalCountItems: number;
  totalPages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
