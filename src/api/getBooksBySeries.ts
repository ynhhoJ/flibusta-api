import Book from '../../types/book';
import BookSeries from '../../types/bookSeries';
import FlibustaAPIHelper from '../flibustaApiHelper';
import { AxiosInstance } from 'axios';
import { HTMLElement } from 'node-html-parser';
import { SearchBooksBySeriesResult } from '../../types/searchBooksBySeriesResult';
import { isEmpty, isNil } from 'lodash';

class GetBooksBySeries extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetBooksByNameURL(name: string, page: number) {
    return `booksearch?ask=${encodeURIComponent(name)}&page=${page}&chs=on`;
  }

  private async fetchBooksBySeriesFromFlibusta(name: string, page: number): Promise<HTMLElement | null> {
    const url = GetBooksBySeries.generateGetBooksByNameURL(name, page);

    return this.getFlibustaHTMLPage(url);
  }

  public async getBooksBySeries(name: string, page = 0, limit = 50): Promise<undefined | SearchBooksBySeriesResult> {
    const booksSeriesListResult = await this.fetchBooksBySeriesFromFlibusta(name, page);

    if (isNil(booksSeriesListResult)) {
      return undefined;
    }

    const pages = this.getCurrentPageInformation(booksSeriesListResult);
    const pagerElement = booksSeriesListResult.querySelectorAll('div.item-list .pager');

    if (!isEmpty(pagerElement)) {
      pagerElement[0].remove();
    }

    const authors = booksSeriesListResult.querySelectorAll('ul li').slice(0, limit);

    const items: Array<BookSeries> = authors.map((item) => {
      const [authorInformation, ...booksOrTranslations] = item.childNodes;
      const books = this.getBooksOrTranslations(booksOrTranslations, this.getAuthorBooksRegExp);
      const authorInformationAsHTML = authorInformation as HTMLElement;
      const bookInformation: Book = this.getInformationOfBookOrAuthor(authorInformationAsHTML);

      return {
        ...bookInformation,
        books,
      };
    });

    const booksSeriesListResultAsHTML = booksSeriesListResult as HTMLElement;
    const totalCountItems = this.getTotalItemsCount(booksSeriesListResultAsHTML);

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pages,
    };
  }
}

export default GetBooksBySeries;
