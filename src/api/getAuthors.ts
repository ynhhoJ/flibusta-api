import AuthorBooks from '../../types/authorsBook';
import FlibustaAPIHelper from '../flibustaApiHelper';
import { AxiosInstance } from 'axios';
import { HTMLElement } from 'node-html-parser';
import { SearchAuthorsResult } from '../../types/searchAuthorsResult';
import { isNil } from 'lodash';
import { Nullable } from '../../types/generals';

class GetAuthors extends FlibustaAPIHelper {
  private static getAuthorTranslationsRegExp = /\d (перевода|перевод)/g;

  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetBooksByNameURL(name: string, page: number) {
    return `booksearch?ask=${encodeURIComponent(name)}&page=${page}&cha=on`;
  }

  private async fetchAuthorsFromFlibusta(name: string, page = 0): Promise<HTMLElement | null> {
    const url = GetAuthors.generateGetBooksByNameURL(name, page);

    return this.getFlibustaHTMLPage(url);
  }

  private generateAuthorsListResponse(authorsHTMLList: Array<HTMLElement>): Array<AuthorBooks> {
    return authorsHTMLList.map((author) => {
      const [authorInformationHTML, ...booksOrTranslations] = author.childNodes;

      const authorInformationAsHTML = authorInformationHTML as HTMLElement;
      const authorInformation = this.getInformationOfBookOrAuthor(authorInformationAsHTML);

      const books = this.getBooksOrTranslations(booksOrTranslations, this.getAuthorBooksRegExp);
      const translations = this.getBooksOrTranslations(
        booksOrTranslations,
        GetAuthors.getAuthorTranslationsRegExp,
      );

      return {
        ...authorInformation,
        books,
        translations,
      };
    });
  }

  public async getAuthors(name: string): Promise<Nullable<Array<AuthorBooks>>> {
    const authorsListResult = await this.fetchAuthorsFromFlibusta(name);

    if (isNil(authorsListResult)) {
      return undefined;
    }

    const authorsHtmlListWithoutPager = this.removePagerElements(authorsListResult);
    const authorsList = authorsHtmlListWithoutPager.querySelectorAll('ul li');

    return this.generateAuthorsListResponse(authorsList);
  }

  public async getAuthorsPaginated(name: string, page = 0, limit = 50): Promise<Nullable<SearchAuthorsResult>> {
    const authorsListResult = await this.fetchAuthorsFromFlibusta(name, page);

    if (isNil(authorsListResult)) {
      return undefined;
    }

    const pages = this.getCurrentPageInformation(authorsListResult);

    const authorsListResultWithoutPagination = this.removePagerElements(authorsListResult);
    const authorsList = authorsListResultWithoutPagination.querySelectorAll('ul li').slice(0, limit);

    const items = this.generateAuthorsListResponse(authorsList);

    const authorsListResultAsHTML = authorsListResultWithoutPagination as HTMLElement;
    const totalCountItems = this.getTotalItemsCount(authorsListResultAsHTML);

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pages,
    };
  }
}

export default GetAuthors;
