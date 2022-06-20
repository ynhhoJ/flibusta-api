import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';
import { isBoolean, isNil, isNumber, isString } from 'lodash';

import GetAuthors from '@src/api/getAuthors';
import AuthorBooks from '@localTypes/authorsBook';
import { PaginatedSearchResult } from '@localTypes/paginatedSearchResult';

should();

describe('getAuthorsApi', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getAuthorsApi = new GetAuthors(axiosInstance);
  const authorName = 'Артур Конан Дойль';
  const unexistAuthorName = 'Арт$ур Ко@$!12на312 Дой%#@ль';

  describe('getAuthors()', () => {
    it('should get authors by name', async () => {
      const authorsResultList = await getAuthorsApi.getAuthors(authorName);

      if (isNil(authorsResultList)) {
        return;
      }

      authorsResultList.forEach((author) => {
        expect(author.id).to.satisfy(
          (id: AuthorBooks['id']) => !isNil(id) || isNumber(id),
        );

        expect(author.name).to.satisfy(
          (name: AuthorBooks['name']) => authorName === name,
        );

        expect(author.books).to.satisfy(
          (books: AuthorBooks['books']) => !isNil(books) || isNumber(books),
        );

        expect(author.translations).to.satisfy(
          (translations: AuthorBooks['translations']) => isNil(translations),
        );
      });
    });

    it('should get authors by name empty result', async () => {
      const authorsResultList = await getAuthorsApi.getAuthors(unexistAuthorName);

      return expect(authorsResultList).to.be.deep.equal([]);
    });
  });

  describe('getAuthorsPaginated()', () => {
    it('should get authors paginated by name', async () => {
      const authorsResultListPaginated = await getAuthorsApi.getAuthorsPaginated(
        authorName,
        0,
        1,
      );

      if (isNil(authorsResultListPaginated)) {
        return;
      }

      authorsResultListPaginated.items.forEach((authorBooks) => {
        expect(authorBooks.id).to.satisfy((item: AuthorBooks['id']) => isNumber(item));
        expect(authorBooks.name).to.satisfy((item: AuthorBooks['name']) => isString(item));
        expect(authorBooks.books).to.satisfy((item: AuthorBooks['books']) => isNumber(item));
        expect(authorBooks.translations).to.satisfy(
          (item: AuthorBooks['translations']) => isNil(item) || isNumber(item),
        );
      });

      expect(authorsResultListPaginated.currentPage).to.satisfy(
        (currentPage: PaginatedSearchResult<AuthorBooks>['currentPage']) => isNumber(currentPage),
      );
      expect(authorsResultListPaginated.hasNextPage).to.satisfy(
        (hasNextPage: PaginatedSearchResult<AuthorBooks>['hasNextPage']) => isBoolean(hasNextPage),
      );
      expect(authorsResultListPaginated.hasPreviousPage).to.satisfy(
        (hasPreviousPage: PaginatedSearchResult<AuthorBooks>['hasPreviousPage']) => isBoolean(hasPreviousPage),
      );
      expect(authorsResultListPaginated.totalCountItems).to.satisfy(
        (
          totalCountItems: PaginatedSearchResult<AuthorBooks>['totalCountItems'],
        ) => isNil(totalCountItems) || isNumber(totalCountItems),
      );
      expect(authorsResultListPaginated.totalPages).to.satisfy(
        (totalPages: PaginatedSearchResult<AuthorBooks>['totalPages']) => isNumber(totalPages),
      );
    });

    it('should get authors by name empty result', async () => {
      const authorsResultListPaginated = await getAuthorsApi.getAuthorsPaginated(unexistAuthorName, 0, 1);

      return expect(authorsResultListPaginated).to.be.deep.equal({
        items: [],
        currentPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        totalCountItems: undefined,
        totalPages: 1,
      });
    });
  });
});
