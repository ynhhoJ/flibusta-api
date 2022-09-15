import 'mocha';
import axios, { AxiosInstance } from 'axios';
import { HTMLElement, Node } from 'node-html-parser';
import { expect, should } from 'chai';
import { isNil, isNumber } from 'lodash';

import FlibustaAPIHelper from '@src/flibustaApiHelper';

should();

class TestFlibustaApiHelper extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }
}

describe('FlibustaAPIHelper', () => {
  const axiosInstance = axios.create({
    baseURL: 'http://flibusta.is/',
  });
  const flibustaApiHelper = new TestFlibustaApiHelper(axiosInstance);

  describe('getCurrentPageInformation()', () => {
    it('should return page information', async () => {
      const name = 'Шерлок';
      const url = `booksearch?ask=${encodeURIComponent(name)}&page=0&chb=on`;
      const flibustaHTMLPage = await flibustaApiHelper.getFlibustaHTMLPage(url);

      if (isNil(flibustaHTMLPage)) {
        return;
      }

      const currentPageInformation = await flibustaApiHelper.getCurrentPageInformation(flibustaHTMLPage);

      expect(currentPageInformation).to.be.deep.equal({
        hasNextPage: true,
        hasPreviousPage: false,
        totalPages: 5,
      });
    });
  });

  describe('getFlibustaHTMLPage()', () => {
    it('should return flibusta html page', async () => {
      const name = 'Шерлок';
      const url = `booksearch?ask=${encodeURIComponent(name)}&page=0&chb=on`;
      const flibustaHTMLPage = await flibustaApiHelper.getFlibustaHTMLPage(url);

      if (isNil(flibustaHTMLPage)) {
        return;
      }

      expect(flibustaHTMLPage.id).to.be.equal('main');
    });

    it('should return axios error when flibusta html page is wrong', async () => {
      const url = 'booksed';

      await flibustaApiHelper.getFlibustaHTMLPage(url).catch((error) => {
        expect(axios.isAxiosError(error)).to.be.equal(true);
      });
    });
  });

  describe('getInformationOfBookOrAuthor()', () => {
    it('should get information of book or author correctly', async () => {
      const name = 'Этюд в багровых тонах; Знак четырех: Повести; Приключения Шерлока Холмса: Рассказы';
      const url = `booksearch?ask=${encodeURIComponent(name)}&page=0&chb=on`;
      const flibustaHTMLPage = await flibustaApiHelper.getFlibustaHTMLPage(url);

      if (isNil(flibustaHTMLPage)) {
        return;
      }

      const booksHtmlListWithoutPager = flibustaApiHelper.removePagerElements(flibustaHTMLPage);
      const [firstElement] = booksHtmlListWithoutPager.querySelectorAll('ul li');
      const [booksInformationHTML] = firstElement.childNodes;

      const bookInformationAsHTML = booksInformationHTML as HTMLElement;
      const result = flibustaApiHelper.getInformationOfBookOrAuthor(bookInformationAsHTML);

      expect(result).to.be.deep.equal({
        id: 577_484,
        name,
      });
    });
  });

  describe('getBooksOrTranslations()', () => {
    const getAuthorTranslationsRegExp = /\d+ (перевода|перевод)/g;

    it('should get books or translations number correctly', () => {
      let string = '(584 перевода)' as unknown as Array<Node>;
      let result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(584);

      string = '(666 перевода)' as unknown as Array<Node>;
      result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(666);

      string = '(1 перевода)' as unknown as Array<Node>;
      result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(1);

      string = '(10 перевода)' as unknown as Array<Node>;
      result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(10);
    });

    it('should return undefined when books or translations number is wrong', () => {
      let string = '(?? перевода)' as unknown as Array<Node>;
      let result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(undefined);

      string = '(-5_-= перевода)' as unknown as Array<Node>;
      result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(undefined);

      string = 'dasd' as unknown as Array<Node>;
      result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(undefined);

      string = 'перевода' as unknown as Array<Node>;
      result = flibustaApiHelper.getBooksOrTranslations(string, getAuthorTranslationsRegExp);

      expect(result).to.be.equal(undefined);
    });
  });

  describe('getTotalItemsCount()', () => {
    it('should return total items count correctly', async () => {
      const name = 'Шерлок';
      const url = `booksearch?ask=${encodeURIComponent(name)}&page=0&chb=on`;
      const flibustaHTMLPage = await flibustaApiHelper.getFlibustaHTMLPage(url);

      if (isNil(flibustaHTMLPage)) {
        return;
      }

      const booksListResultAsHTML = flibustaHTMLPage as HTMLElement;
      const totalCountItems = flibustaApiHelper.getTotalItemsCount(booksListResultAsHTML);

      expect(totalCountItems).to.satisfy(
        (value: number) => isNumber(value),
      );
    });

    it('should return undefined total items count correctly if books list is empty', async () => {
      const name = '142131шерasdas';
      const url = `booksearch?ask=${encodeURIComponent(name)}&page=0&chb=on`;
      const flibustaHTMLPage = await flibustaApiHelper.getFlibustaHTMLPage(url);

      if (isNil(flibustaHTMLPage)) {
        return;
      }

      const booksListResultAsHTML = flibustaHTMLPage as HTMLElement;
      const totalCountItems = flibustaApiHelper.getTotalItemsCount(booksListResultAsHTML);

      expect(totalCountItems).to.be.equal(undefined);
    });
  });

  describe('removePagerElements()', () => {
    it('should return html element without pagination correctly', async () => {
      const name = 'Шерлок';
      const url = `booksearch?ask=${encodeURIComponent(name)}&page=0&chb=on`;
      const flibustaHTMLPage = await flibustaApiHelper.getFlibustaHTMLPage(url);

      if (isNil(flibustaHTMLPage)) {
        return;
      }

      const booksListResultAsHTML = flibustaHTMLPage as HTMLElement;
      const booksListResultWithoutPagination = flibustaApiHelper.removePagerElements(booksListResultAsHTML);
      const hasBooksListPagination = booksListResultWithoutPagination.querySelectorAll('div.item-list .pager');
      expect(hasBooksListPagination).to.be.deep.equal([]);
    });

    it('should return same html element with pagination if pager elements does not exists', async () => {
      const name = 'Шas23rlock';
      const url = `booksearch?ask=${encodeURIComponent(name)}&page=0&chb=on`;
      const flibustaHTMLPage = await flibustaApiHelper.getFlibustaHTMLPage(url);

      if (isNil(flibustaHTMLPage)) {
        return;
      }

      const booksListResultAsHTML = flibustaHTMLPage as HTMLElement;
      const booksListResultWithoutPagination = flibustaApiHelper.removePagerElements(booksListResultAsHTML);

      expect(booksListResultWithoutPagination).to.be.deep.equal(booksListResultAsHTML);
    });
  });
});
