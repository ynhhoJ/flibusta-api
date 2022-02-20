import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';

import GetBooksByName from '@src/api/getBooksByName';

should();

describe('getBooksByName', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getBooksByNameApi = new GetBooksByName(axiosInstance);
  const bookName = 'Этюд в багровых тонах; Знак четырех: Повести; Приключения Шерлока Холмса: Рассказы';
  const expectedItem = [{
    authors: [
      {
        id: 6116,
        name: 'Артур Конан Дойль',
      },
    ],
    book: {
      id: 577_484,
      name: bookName,
    },
  }];

  describe('getBooksByName()', () => {
    it('should get books by name', async () => {
      const authorsResultList = await getBooksByNameApi.getBooksByName(bookName);

      return expect(authorsResultList).to.be.deep.equal(expectedItem);
    });
  });

  describe('getBooksByNamePaginated()', () => {
    it('should get books by name paginated', async () => {
      const authorsResultList = await getBooksByNameApi.getBooksByNamePaginated(bookName);

      return expect(authorsResultList).to.be.deep.equal({
        items: expectedItem,
        currentPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        totalCountItems: 1,
        totalPages: 1,
      });
    });
  });
});
