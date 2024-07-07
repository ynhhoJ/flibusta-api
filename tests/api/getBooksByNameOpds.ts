/* eslint-disable sonarjs/no-identical-functions */
import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';
import { isNil, isNumber, isString } from 'lodash';

import GetBooksByNameOpds from '@src/api/getBooksByNameOpds';
import { SearchBooksByNameOpdsResult } from '@localTypes/searchBooksByNameOpdsResult';
import { PaginatedSearchResult } from '@localTypes/paginatedSearchResult';

should();

describe('getBooksByNameOpds', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getBooksByNameOpdsApi = new GetBooksByNameOpds(axiosInstance);

  describe('getBooksByNameFromOpds()', () => {
    it('should return correct books parsed by name from opds', async () => {
      const name = 'Шерлок';
      const booksByNameFromOpds = await getBooksByNameOpdsApi.getBooksByNameFromOpds(name);

      if (isNil(booksByNameFromOpds)) {
        return;
      }

      booksByNameFromOpds.forEach((booksItem) => {
        expect(booksItem.author).to.satisfy(
          (item: SearchBooksByNameOpdsResult['author']) => item.every(
            (authorItem) => isString(authorItem.name) && isString(authorItem.uri),
          ),
        );
        expect(booksItem.title).to.satisfy((item: SearchBooksByNameOpdsResult['title']) => isString(item));
        expect(booksItem.updated).to.satisfy((item: SearchBooksByNameOpdsResult['updated']) => isString(item));
        expect(booksItem.categories).to.satisfy((item: SearchBooksByNameOpdsResult['categories']) => item.every(
          (categoriesItem) => isString(categoriesItem),
        ));
        expect(booksItem.cover).to.satisfy(
          (item: SearchBooksByNameOpdsResult['cover']) => isNil(item) || isString(item),
        );
        expect(booksItem.downloads).to.satisfy(
          (item: SearchBooksByNameOpdsResult['downloads']) => item.every(
            (downloadItems) => isString(downloadItems.link) && isString(downloadItems.type),
          ),
        );
        expect(booksItem.description).to.satisfy((item: SearchBooksByNameOpdsResult['description']) => isString(item));
      });
    });

    it('books parsed by name from opds should be undefined', async () => {
      const name = 'undLas,nm412-e32uj';
      const booksByNameFromOpds = await getBooksByNameOpdsApi.getBooksByNameFromOpds(name);

      expect(booksByNameFromOpds).to.be.equal(undefined);
    });

    it('should be returned correct response when entry is an object', async () => {
      const name = 'Почему я отвлекаюсь';

      const booksByNameFromOpds = await getBooksByNameOpdsApi.getBooksByNameFromOpds(name);

      if (isNil(booksByNameFromOpds)) {
        return;
      }

      booksByNameFromOpds.forEach((booksItem) => {
        expect(booksItem.author).to.satisfy(
          (item: SearchBooksByNameOpdsResult['author']) => item.every(
            (authorItem) => isString(authorItem.name) && isString(authorItem.uri),
          ),
        );
        expect(booksItem.title).to.satisfy((item: SearchBooksByNameOpdsResult['title']) => isString(item));
        expect(booksItem.updated).to.satisfy((item: SearchBooksByNameOpdsResult['updated']) => isString(item));
        expect(booksItem.categories).to.satisfy((item: SearchBooksByNameOpdsResult['categories']) => item.every(
          (categoriesItem) => isString(categoriesItem),
        ));
        expect(booksItem.cover).to.satisfy(
          (item: SearchBooksByNameOpdsResult['cover']) => isNil(item) || isString(item),
        );
        expect(booksItem.downloads).to.satisfy(
          (item: SearchBooksByNameOpdsResult['downloads']) => item.every(
            (downloadItems) => isString(downloadItems.link) && isString(downloadItems.type),
          ),
        );
        expect(booksItem.description).to.satisfy((item: SearchBooksByNameOpdsResult['description']) => isString(item));
      });
    });
  });

  describe('getBooksByNameFromOpdsPaginated()', () => {
    it('should return correct paginated books parsed by name from opds', async () => {
      const name = 'Шерлок';
      const booksByNameFromOpdsPaginated = await getBooksByNameOpdsApi.getBooksByNameFromOpdsPaginated(name);

      if (isNil(booksByNameFromOpdsPaginated)) {
        return;
      }

      booksByNameFromOpdsPaginated.items.forEach((booksItem) => {
        expect(booksItem.author).to.satisfy(
          (item: SearchBooksByNameOpdsResult['author']) => item.every(
            (authorItem) => isString(authorItem.name) && isString(authorItem.uri),
          ),
        );
        expect(booksItem.title).to.satisfy((item: SearchBooksByNameOpdsResult['title']) => isString(item));
        expect(booksItem.updated).to.satisfy((item: SearchBooksByNameOpdsResult['updated']) => isString(item));
        expect(booksItem.categories).to.satisfy((item: SearchBooksByNameOpdsResult['categories']) => item.every(
          (categoriesItem) => isString(categoriesItem),
        ));
        expect(booksItem.cover).to.satisfy(
          (item: SearchBooksByNameOpdsResult['cover']) => isNil(item) || isString(item),
        );
        expect(booksItem.downloads).to.satisfy(
          (item: SearchBooksByNameOpdsResult['downloads']) => item.every(
            (downloadItems) => isString(downloadItems.link) && isString(downloadItems.type),
          ),
        );
        expect(booksItem.description).to.satisfy((item: SearchBooksByNameOpdsResult['description']) => isString(item));
      });

      expect(booksByNameFromOpdsPaginated.hasNextPage).to.be.equal(true);
      expect(booksByNameFromOpdsPaginated.hasPreviousPage).to.be.equal(false);
      expect(booksByNameFromOpdsPaginated.totalPages).to.satisfy(
        (item: PaginatedSearchResult<Array<SearchBooksByNameOpdsResult>>['totalPages']) => isNumber(item),
      );
      expect(booksByNameFromOpdsPaginated.totalCountItems).to.satisfy(
        (
          item: PaginatedSearchResult<Array<SearchBooksByNameOpdsResult>>['totalCountItems'],
        ) => isNil(item) || isNumber(item),
      );
      expect(booksByNameFromOpdsPaginated.currentPage).to.satisfy(
        (item: PaginatedSearchResult<Array<SearchBooksByNameOpdsResult>>['currentPage']) => isNumber(item),
      );
    });
  });
});
