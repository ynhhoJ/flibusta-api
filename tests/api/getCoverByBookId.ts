import 'mocha';
import { expect, should } from 'chai';
import axios from 'axios';
import { isNil } from 'lodash';

import GetCoverByBookId from '@src/api/getCoverByBookId';

should();

describe('GetCoverBookById', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const getCoverByBookIdApi = new GetCoverByBookId(axiosInstance);

  describe('fetchCoverByUrl()', () => {
    it('should return jpg file', async () => {
      const coverByBookId = await getCoverByBookIdApi.getCoverByBookId(402_475);

      // TODO: Should be rewritten to check if file was returned correctly
      expect(coverByBookId).to.satisfy((cover: File) => !isNil(cover));
    });

    it('should return png file', async () => {
      const coverByBookId = await getCoverByBookIdApi.getCoverByBookId(226_302);

      // TODO: Should be rewritten to check if file was returned correctly
      expect(coverByBookId).to.satisfy((cover: File) => !isNil(cover));
    });

    it('should return undefined', async () => {
      const coverByBookId = await getCoverByBookIdApi.getCoverByBookId(Number.POSITIVE_INFINITY);

      expect(coverByBookId).to.be.equal(undefined);
    });
  });
});
