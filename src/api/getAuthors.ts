import AxiosController from '../axiosController';
import FlibustaAPIHelper from '../flibustaApiHelper';
import { HTMLElement } from 'node-html-parser';
import { isEmpty, isNil } from 'lodash';
import { SearchBooksBySeriesResult } from '../../types/searchBooksBySeriesResult';

class GetAuthors extends FlibustaAPIHelper {
  public axiosController: AxiosController;

  constructor(axiosController: AxiosController) {
    super(axiosController);

    this.axiosController = axiosController;
  }

  private static generateGetBooksByNameURL(name: string, page: number) {
    return `booksearch?ask=${encodeURIComponent(name)}&page=${page}&cha=on`;
  }

  private async fetchAuthorsFromFlibusta(name: string, page: number): Promise<HTMLElement | null> {
    const url = GetAuthors.generateGetBooksByNameURL(name, page);

    return this.getFlibustaHTMLPage(url);
  }

  public async getAuthors(name: string, page = 0, limit = 50): Promise<undefined | SearchBooksBySeriesResult> {
    const authorsListResult = await this.fetchAuthorsFromFlibusta(name, page);

    if (isNil(authorsListResult)) {
      return undefined;
    }

    const pages = this.getCurrentPageInformation(authorsListResult);
    const pagerElement = authorsListResult.querySelectorAll('div.item-list .pager');

    if (!isEmpty(pagerElement)) {
      pagerElement[0].remove();
    }

    const booksSeries = authorsListResult.querySelectorAll('ul li').slice(0, limit);

    const items = booksSeries.map((series) => {
      const [authorInformation, ...booksOrTranslations] = series.childNodes;
      const booksAsString = this.getBooksOrTranslations(booksOrTranslations, this.getAuthorBooksRegExp);
      const books = Number.parseInt(booksAsString, 10);

      return {
        ...this.getInformationOfBookOrAuthor(authorInformation),
        books,
      };
    });

    const booksSeriesListResultAsHTML = authorsListResult as HTMLElement;
    const totalCountItems = this.getTotalItemsCount(booksSeriesListResultAsHTML);

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pages,
    };
  }
}

export default GetAuthors;
