import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';
import { isBoolean, isNil, isNumber } from 'lodash';

import GetBooksBySeries from '@src/api/getBooksBySeries';
import BookSeries from '@localTypes/bookSeries';
import { PaginatedSearchResult } from '@localTypes/paginatedSearchResult';

should();

describe('getBooksBySeries', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getBooksBySeriesApi = new GetBooksBySeries(axiosInstance);

  describe('getBooksBySeries()', async () => {
    it('should return books by series', async () => {
      const name = 'Ведьмак. Последнее желание';
      const booksSeriesResultList = await getBooksBySeriesApi.getBooksBySeries(name);

      if (isNil(booksSeriesResultList)) {
        return;
      }

      booksSeriesResultList.forEach((bookSeries) => {
        expect(bookSeries.books).to.satisfy((books: BookSeries['books']) => isNumber(books));
        expect(bookSeries.id).to.satisfy((id: BookSeries['id']) => isNumber(id));
        expect(bookSeries.name).to.satisfy((bookSeriesName: BookSeries['name']) => bookSeriesName === name);
      });
    });
  });

  describe('getBooksBySeriesPaginated()', async () => {
    it('should return paginated books by series', async () => {
      const name = 'Ведьмак. Последнее желание';
      const booksSeriesResultList = await getBooksBySeriesApi.getBooksBySeriesPaginated(name);

      if (isNil(booksSeriesResultList)) {
        return;
      }

      // eslint-disable-next-line
      booksSeriesResultList.items.forEach((bookSeries) => {
        expect(bookSeries.books).to.satisfy((books: BookSeries['books']) => isNumber(books));
        expect(bookSeries.id).to.satisfy((id: BookSeries['id']) => isNumber(id));
        expect(bookSeries.name).to.satisfy((bookSeriesName: BookSeries['name']) => bookSeriesName === name);
      });

      expect(booksSeriesResultList.currentPage).to.satisfy(
        (currentPage: PaginatedSearchResult<BookSeries>['currentPage']) => isNumber(currentPage),
      );
      expect(booksSeriesResultList.hasNextPage).to.satisfy(
        (hasNextPage: PaginatedSearchResult<BookSeries>['hasNextPage']) => isBoolean(hasNextPage),
      );
      expect(booksSeriesResultList.hasPreviousPage).to.satisfy(
        (hasPreviousPage: PaginatedSearchResult<BookSeries>['hasPreviousPage']) => isBoolean(hasPreviousPage),
      );
      expect(booksSeriesResultList.totalCountItems).to.satisfy(
        (
          totalCountItems: PaginatedSearchResult<BookSeries>['totalCountItems'],
        ) => isNil(totalCountItems) || isNumber(totalCountItems),
      );
      expect(booksSeriesResultList.totalPages).to.satisfy(
        (totalPages: PaginatedSearchResult<BookSeries>['totalPages']) => isNumber(totalPages),
      );
    });
  });
});
