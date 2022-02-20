/* eslint-disable */
import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';
import { isNil, isString } from 'lodash';

import GetGenres from '@src/api/getGenres';
import { Genres } from '@localTypes/genres';

should();

describe('getGenres', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getBooksBySeriesApi = new GetGenres(axiosInstance);

  describe('getGenres()', async () => {
    it('should return genres', async () => {
      const name = 'Роман';
      const genresResultList = await getBooksBySeriesApi.getGenres(name);

      if (isNil(genresResultList)) {
        return;
      }

      genresResultList.forEach((genre) => {
        expect(genre.name).to.satisfy(
          (item: Genres['name']) => isString(item),
        );
        expect(genre.id).to.satisfy(
          (item: Genres['id']) => isString(item),
        );
      });
    });

    it('should return empty genres', async () => {
      const name = 'undefined';
      const genresResultList = await getBooksBySeriesApi.getGenres(name);

      expect(genresResultList).to.be.deep.equal([]);
    });
  });

  describe('getGenresPaginated()', async () => {
    it('should return paginated books series', async () => {
      const name = 'Роман';
      const genresResultList = await getBooksBySeriesApi.getGenresPaginated(name);

      if (isNil(genresResultList)) {
        return;
      }

      genresResultList.items.forEach((genre) => {
        expect(genre.name).to.satisfy(
          (item: Genres['name']) => isString(item),
        );
        expect(genre.id).to.satisfy(
          (item: Genres['id']) => isString(item),
        );
      });
      expect(genresResultList.currentPage).to.be.equal(0)
      expect(genresResultList.totalCountItems).to.be.equal(12)
      expect(genresResultList.totalPages).to.be.equal(1)
      expect(genresResultList.hasPreviousPage).to.be.equal(false)
      expect(genresResultList.hasNextPage).to.be.equal(false)
    });

    it('should return paginated books series empty', async () => {
      const name = 'Р$ом@ан5';
      const genresResultList = await getBooksBySeriesApi.getGenresPaginated(name);

      expect(genresResultList).to.be.deep.equal({
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
