import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';

import GetBooksBySeries from '@src/api/getBooksBySeries';

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

      return expect(booksSeriesResultList).to.be.deep.equal([{
        books: 5,
        id: 49_672,
        name,
      }]);
    });
  });

  describe('getBooksBySeriesPaginated()', async () => {
    it('should return paginated books by series', async () => {
      const name = 'Ведьмак. Последнее желание';
      const booksSeriesResultList = await getBooksBySeriesApi.getBooksBySeriesPaginated(name);

      return expect(booksSeriesResultList).to.be.deep.equal({
        items: [{
          books: 5,
          id: 49_672,
          name,
        }],
        currentPage: 0,
        totalCountItems: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });
  });
});
