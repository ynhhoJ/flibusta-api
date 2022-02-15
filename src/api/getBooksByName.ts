import Author from '../../types/authors';
import Book from '../../types/book';
import FlibustaAPIHelper from '../flibustaApiHelper';
import StringUtils from '../utils/string';
import { BooksByName } from '../../types/booksByName';
import { HTMLElement, Node } from 'node-html-parser';
import { SearchBooksByNameResult } from '../../types/searchBooksByNameResult';
import { isEmpty, isNil } from 'lodash';
import { AxiosInstance } from 'axios';

class GetBooksByName extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetBooksByNameURL(name: string, page: number) {
    return `booksearch?ask=${encodeURIComponent(name)}&page=${page}&chb=on`;
  }

  private async fetchBooksByNameFromFlibusta(name: string, page: number): Promise<HTMLElement | null> {
    const url = GetBooksByName.generateGetBooksByNameURL(name, page);

    return this.getFlibustaHTMLPage(url);
  }

  private getBookAuthors(node: Array<Node>): Array<Author> {
    const result: Array<Author> = [];

    node.forEach((author) => {
      const authorAsHTML = author as HTMLElement;

      if (StringUtils.isComma(authorAsHTML.text)) {
        return;
      }

      const idAsString = StringUtils.getNumbersFromString(authorAsHTML.attrs.href);
      const id = Number.parseInt(idAsString, 10);

      result.push({
        id,
        name: authorAsHTML.text,
      });
    });

    return result;
  }

  public async getBooksByName(name: string, page = 0, limit = 50): Promise<undefined | SearchBooksByNameResult> {
    const booksListResult = await this.fetchBooksByNameFromFlibusta(name, page);

    if (isNil(booksListResult)) {
      return undefined;
    }

    const pages = this.getCurrentPageInformation(booksListResult);
    const pagerElement = booksListResult.querySelectorAll('div.item-list .pager');

    if (!isEmpty(pagerElement)) {
      pagerElement[0].remove();
    }

    const books = booksListResult.querySelectorAll('ul li').slice(0, limit);

    const items: Array<BooksByName> = books.map((bookHTMLElement) => {
      const [resultBookName, /* divider */, ...resultBookAuthors] = bookHTMLElement.childNodes;
      const resultBookNameAsHTML = resultBookName as HTMLElement;
      const book: Book = this.getInformationOfBookOrAuthor(resultBookNameAsHTML);
      const authors: Array<Author> = this.getBookAuthors(resultBookAuthors);

      return {
        book,
        authors,
      };
    });
    const booksSeriesListResultAsHTML = booksListResult as HTMLElement;
    const totalCountItems = this.getTotalItemsCount(booksSeriesListResultAsHTML);

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pages,
    };
  }
}

export default GetBooksByName;
