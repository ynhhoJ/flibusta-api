import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';
import { isBoolean, isNil, isNumber, isString } from 'lodash';

import GetBooksByName from '@src/api/getBooksByName';
import Author from '@localTypes/authors';
import Book from '@localTypes/book';
import { BooksByName } from '@localTypes/booksByName';
import { PaginatedSearchResult } from '@localTypes/paginatedSearchResult';

should();

describe('getBooksByName', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getBooksByNameApi = new GetBooksByName(axiosInstance);
  const bookName = 'Этюд в багровых тонах; Знак четырех: Повести; Приключения Шерлока Холмса: Рассказы';

  describe('getBooksByName()', () => {
    it('should get books by name', async () => {
      const authorsResultList = await getBooksByNameApi.getBooksByName(bookName);

      if (isNil(authorsResultList)) {
        return;
      }

      authorsResultList.forEach((bookSeries) => {
        const { authors, book } = bookSeries;

        authors.forEach((author) => {
          expect(author.id).to.satisfy((id: Author['id']) => isNumber(id));
          expect(author.name).to.satisfy((authorName: Author['name']) => isString(authorName));
        });

        expect(book.id).to.satisfy((id: Book['id']) => isNumber(id));
        expect(book.name).to.satisfy((name: Book['name']) => name === bookName);
      });
    });
  });

  describe('getBooksByNamePaginated()', () => {
    it('should get books by name paginated', async () => {
      const authorsResultList = await getBooksByNameApi.getBooksByNamePaginated(bookName);

      if (isNil(authorsResultList)) {
        return;
      }

      // eslint-disable-next-line sonarjs/no-identical-functions
      authorsResultList.items.forEach((bookSeries) => {
        const { authors, book } = bookSeries;

        authors.forEach((author) => {
          expect(author.id).to.satisfy((id: Author['id']) => isNumber(id));
          expect(author.name).to.satisfy((authorName: Author['name']) => isString(authorName));
        });

        expect(book.id).to.satisfy((id: Book['id']) => isNumber(id));
        expect(book.name).to.satisfy((name: Book['name']) => name === bookName);
      });

      expect(authorsResultList.currentPage).to.satisfy(
        (currentPage: PaginatedSearchResult<BooksByName>['currentPage']) => isNumber(currentPage),
      );
      expect(authorsResultList.hasNextPage).to.satisfy(
        (hasNextPage: PaginatedSearchResult<BooksByName>['hasNextPage']) => isBoolean(hasNextPage),
      );
      expect(authorsResultList.hasPreviousPage).to.satisfy(
        (hasPreviousPage: PaginatedSearchResult<BooksByName>['hasPreviousPage']) => isBoolean(hasPreviousPage),
      );
      expect(authorsResultList.totalCountItems).to.satisfy(
        (
          totalCountItems: PaginatedSearchResult<BooksByName>['totalCountItems'],
        ) => isNil(totalCountItems) || isNumber(totalCountItems),
      );
      expect(authorsResultList.totalPages).to.satisfy(
        (totalPages: PaginatedSearchResult<BooksByName>['totalPages']) => isNumber(totalPages),
      );
    });
  });
});
