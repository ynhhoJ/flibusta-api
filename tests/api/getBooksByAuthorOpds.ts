/* eslint-disable sonarjs/no-identical-functions */
import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';
import { isNil, isString } from 'lodash';

import GetBooksByAuthorOpds from '@src/api/getBooksByAuthorOpds';
import { SearchBooksByNameOpdsResult } from '@localTypes/searchBooksByNameOpdsResult';

should();

describe('GetAuthorsOpds', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getAuthorsOpdsApi = new GetBooksByAuthorOpds(axiosInstance);
  // NOTE: Arthur Conan Doyle
  const authorId = 6116;

  describe('getAuthorsFromOpds()', async () => {
    it('should get authors by id from opds', async () => {
      const authorsResultList = await getAuthorsOpdsApi.getAuthorsFromOpds(authorId);

      if (isNil(authorsResultList)) {
        return;
      }

      authorsResultList.forEach((authorBook) => {
        expect(authorBook.author).to.satisfy(
          (author: SearchBooksByNameOpdsResult['author']) => author.every(
            (info) => isString(info.name) && isString(info.uri),
          ),
        );
        expect(authorBook.title).to.satisfy((title: SearchBooksByNameOpdsResult['title']) => isString(title));
        expect(authorBook.updated).to.satisfy(
          (updated: SearchBooksByNameOpdsResult['updated']) => isString(updated),
        );
        expect(authorBook.categories).to.satisfy(
          (categories: SearchBooksByNameOpdsResult['categories']) => categories.every(
            (category) => isString(category),
          ),
        );
        expect(authorBook.cover).to.satisfy(
          (cover: SearchBooksByNameOpdsResult['cover']) => isNil(cover) || isString(cover),
        );
        expect(authorBook.downloads).to.satisfy(
          (downloads: SearchBooksByNameOpdsResult['downloads']) => downloads.every(
            (downloadsInfo) => isString(downloadsInfo.link) && isString(downloadsInfo.type),
          ),
        );
        expect(authorBook.description).to.satisfy(
          (description: SearchBooksByNameOpdsResult['description']) => isString(description),
        );
      });
    });

    it('should return undefined authors by id from opds', async () => {
      const authorsResultList = await getAuthorsOpdsApi.getAuthorsFromOpds(Number.POSITIVE_INFINITY);

      expect(authorsResultList).to.be.equal(undefined);
    });
  });

  describe('getAuthorsFromOpdsPaginated()', async () => {
    it('should get paginated authors by id from opds', async () => {
      const authorsResultList = await getAuthorsOpdsApi.getAuthorsFromOpdsPaginated(authorId);

      if (isNil(authorsResultList)) {
        return;
      }

      const {
        items,
        currentPage,
        hasNextPage,
        hasPreviousPage,
      } = authorsResultList;

      items.forEach((authorBook) => {
        expect(authorBook.author).to.satisfy(
          (author: SearchBooksByNameOpdsResult['author']) => author.every(
            (info) => isString(info.name) && isString(info.uri),
          ),
        );
        expect(authorBook.title).to.satisfy((title: SearchBooksByNameOpdsResult['title']) => isString(title));
        expect(authorBook.updated).to.satisfy(
          (updated: SearchBooksByNameOpdsResult['updated']) => isString(updated),
        );
        expect(authorBook.categories).to.satisfy(
          (categories: SearchBooksByNameOpdsResult['categories']) => categories.every(
            (category) => isString(category),
          ),
        );
        expect(authorBook.cover).to.satisfy(
          (cover: SearchBooksByNameOpdsResult['cover']) => isNil(cover) || isString(cover),
        );
        expect(authorBook.downloads).to.satisfy(
          (downloads: SearchBooksByNameOpdsResult['downloads']) => downloads.every(
            (downloadsInfo) => isString(downloadsInfo.link) && isString(downloadsInfo.type),
          ),
        );
        expect(authorBook.description).to.satisfy(
          (description: SearchBooksByNameOpdsResult['description']) => isString(description),
        );
      });

      expect(currentPage).to.be.equal(0);
      expect(hasNextPage).to.be.equal(true);
      expect(hasPreviousPage).to.be.equal(false);
    });

    it('should return undefined authors by id from opds', async () => {
      const authorsResultList = await getAuthorsOpdsApi.getAuthorsFromOpdsPaginated(Number.POSITIVE_INFINITY);

      expect(authorsResultList).to.be.equal(undefined);
    });
  });
});
