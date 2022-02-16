import Book from '../../types/book';
import BookSeries from '../../types/bookSeries';
import FlibustaAPIHelper from '../flibustaApiHelper';
import { AxiosInstance } from 'axios';
import { HTMLElement } from 'node-html-parser';
import { SearchBooksBySeriesResult } from '../../types/searchBooksBySeriesResult';
import { isNil } from 'lodash';
import { Nullable } from '../../types/generals';

class GetBooksBySeries extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetBooksByNameURL(name: string, page: number) {
    return `booksearch?ask=${encodeURIComponent(name)}&page=${page}&chs=on`;
  }

  private async fetchBooksBySeriesFromFlibusta(name: string, page = 0): Promise<HTMLElement | null> {
    const url = GetBooksBySeries.generateGetBooksByNameURL(name, page);

    return this.getFlibustaHTMLPage(url);
  }

  private generateBooksSeriesListResponse(booksSeriesHtmlList: Array<HTMLElement>): Array<BookSeries> {
    return booksSeriesHtmlList.map((item) => {
      const [authorInformation, ...booksOrTranslations] = item.childNodes;
      const books = this.getBooksOrTranslations(booksOrTranslations, this.getAuthorBooksRegExp);
      const authorInformationAsHTML = authorInformation as HTMLElement;
      const bookInformation: Book = this.getInformationOfBookOrAuthor(authorInformationAsHTML);

      return {
        ...bookInformation,
        books,
      };
    });
  }

  public async getBooksBySeries(name: string): Promise<Nullable<Array<BookSeries>>> {
    const booksListResult = await this.fetchBooksBySeriesFromFlibusta(name);

    if (isNil(booksListResult)) {
      return undefined;
    }

    const booksHtmlListWithoutPager = this.removePagerElements(booksListResult);
    const booksHtmlList = booksHtmlListWithoutPager.querySelectorAll('ul li');

    return this.generateBooksSeriesListResponse(booksHtmlList);
  }

  public async getBooksBySeriesPaginated(
    name: string,
    page = 0,
    limit = 50,
  ): Promise<Nullable<SearchBooksBySeriesResult>> {
    const booksSeriesListResult = await this.fetchBooksBySeriesFromFlibusta(name, page);

    if (isNil(booksSeriesListResult)) {
      return undefined;
    }

    const pages = this.getCurrentPageInformation(booksSeriesListResult);

    const booksSeriesHtmlListWithoutPager = this.removePagerElements(booksSeriesListResult);
    const booksSeriesListHTMLList = booksSeriesHtmlListWithoutPager.querySelectorAll('ul li').slice(0, limit);

    const items = this.generateBooksSeriesListResponse(booksSeriesListHTMLList);

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
