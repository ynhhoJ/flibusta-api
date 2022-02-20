import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';

import GetAuthors from '@src/api/getAuthors';

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

      return expect(authorsResultList).to.be.deep.equal([{
        id: 6116,
        name: authorName,
        books: 584,
        translations: undefined,
      }]);
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

      return expect(authorsResultListPaginated).to.be.deep.equal({
        items: [{
          id: 6116,
          name: authorName,
          books: 584,
          translations: undefined,
        }],
        currentPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        totalCountItems: 1,
        totalPages: 1,
      });
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
