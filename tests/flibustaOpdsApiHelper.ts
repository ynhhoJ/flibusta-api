import 'mocha';
import { expect, should } from 'chai';
import axios, { AxiosInstance } from 'axios';
import { isBoolean, isNil, isString } from 'lodash';

import FlibustaOpdsApiHelper from '@src/flibustaOpdsApiHelper';
import { OpdsSearchResult } from '@localTypes/opdsSearchResult';
import { SearchBooksByNameOpdsResult } from '@localTypes/searchBooksByNameOpdsResult';
import { PagesInformation } from '@localTypes/pagesInformation';

should();

class TestFlibustaOpdsApiHelper extends FlibustaOpdsApiHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }
}

describe('FlibustaOpdsApiHelper', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const flibustaOpdsApiHelper = new TestFlibustaOpdsApiHelper(axiosInstance);

  describe('getFlibustaOpdsEntry()', () => {
    it('should return correct response from opds entry', async () => {
      const name = 'Шерлок';
      const url = `opds/opensearch?searchTerm=${encodeURIComponent(name)}&searchType=books&pageNumber=0`;
      const result = await flibustaOpdsApiHelper.getFlibustaOpdsEntry(url) as OpdsSearchResult;

      expect(result.feed.entry?.length).to.be.equal(20);
    });

    it('should return undefined response from opds entry', async () => {
      const name = '%1432zcxcds';
      const url = `opds/opensearch?searchTerm=${encodeURIComponent(name)}&searchType=books&pageNumber=0`;
      // TODO: Need's help here
      const result = await flibustaOpdsApiHelper.getFlibustaOpdsEntry(url) as OpdsSearchResult;

      expect(result.feed.entry).to.be.equal(undefined);
    });
  });

  describe('prepareResponseFromOpdsEntry()', () => {
    it('should return correct prepared response from opds entry', async () => {
      const name = 'Шерлок';
      const url = `opds/opensearch?searchTerm=${encodeURIComponent(name)}&searchType=books&pageNumber=0`;
      const result = await flibustaOpdsApiHelper.getFlibustaOpdsEntry(url);

      if (isNil(result)) {
        return;
      }

      const { feed } = result;
      const { entry } = feed;

      if (isNil(entry)) {
        return;
      }

      const preparedEntry = flibustaOpdsApiHelper.prepareResponseFromOpdsEntry(entry);

      preparedEntry.forEach((entryItem) => {
        expect(entryItem.author).to.satisfy(
          (item: SearchBooksByNameOpdsResult['author']) => item.every(
            (authorItem) => isString(authorItem.name) && isString(authorItem.uri),
          ),
        );
        expect(entryItem.title).to.satisfy((item: SearchBooksByNameOpdsResult['title']) => isString(item));
        expect(entryItem.updated).to.satisfy((item: SearchBooksByNameOpdsResult['updated']) => isString(item));
        expect(entryItem.categories).to.satisfy((item: SearchBooksByNameOpdsResult['categories']) => item.every(
          (categoriesItem) => isString(categoriesItem),
        ));
        expect(entryItem.cover).to.satisfy(
          (item: SearchBooksByNameOpdsResult['cover']) => isNil(item) || isString(item),
        );
        expect(entryItem.downloads).to.satisfy(
          (item: SearchBooksByNameOpdsResult['downloads']) => item.every(
            (downloadItems) => isString(downloadItems.link) && isString(downloadItems.type),
          ),
        );
        expect(entryItem.description).to.satisfy((item: SearchBooksByNameOpdsResult['description']) => isString(item));
      });
    });
  });

  describe('hasPreviousPage()', () => {
    it('should return correct values', () => {
      let pageIndex = 1;
      let result = flibustaOpdsApiHelper.hasPreviousPage(pageIndex);

      expect(result).to.be.equal(true);

      pageIndex = 0;
      result = flibustaOpdsApiHelper.hasPreviousPage(pageIndex);

      expect(result).to.be.equal(false);

      pageIndex = 10;
      result = flibustaOpdsApiHelper.hasPreviousPage(pageIndex);

      expect(result).to.be.equal(true);
    });
  });

  describe('getCurrentOpdsPageInformation()', () => {
    it('should return correct page information', async () => {
      const name = 'Шерлок';
      const page = 0;
      const url = `opds/opensearch?searchTerm=${encodeURIComponent(name)}&searchType=books&pageNumber=${page}`;
      const result = await flibustaOpdsApiHelper.getFlibustaOpdsEntry(url);

      if (isNil(result)) {
        return;
      }

      const { feed } = result;
      const pageInformation = flibustaOpdsApiHelper.getCurrentOpdsPageInformation(feed, page);

      expect(pageInformation).to.satisfy(
        (item: PagesInformation) => isBoolean(item.hasNextPage)
              && isBoolean(item.hasPreviousPage),
      );
    });
  });
});
