import { AxiosInstance } from 'axios';
import { HTMLElement, Node } from 'node-html-parser';
import { isNil } from 'lodash';

import Author from '@localTypes/authors';
import Book from '@localTypes/book';
import FlibustaAPIHelper from '@src/flibustaApiHelper';
import String from '@utils/string';
import { BooksByName } from '@localTypes/booksByName';
import { Nullable } from '@localTypes/generals';
import { PaginatedSearchResult } from '@localTypes/paginatedSearchResult';

class GetBooksByName extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetBooksByNameURL(name: string, page: number) {
    return `booksearch?ask=${encodeURIComponent(name)}&page=${page}&chb=on`;
  }

  private async fetchBooksByNameFromFlibusta(name: string, page = 0): Promise<HTMLElement | null> {
    const url = GetBooksByName.generateGetBooksByNameURL(name, page);

    return this.getFlibustaHTMLPage(url);
  }

  private getBookAuthors(node: Array<Node>): Array<Author> {
    const result: Array<Author> = [];

    node.forEach((author) => {
      const authorAsHTML = author as HTMLElement;

      if (String.containsComma(authorAsHTML.text)) {
        return;
      }

      const idAsString = String.getNumbersFromString(authorAsHTML.attrs.href);
      const id = Number.parseInt(idAsString, 10);

      result.push({
        id,
        name: authorAsHTML.text,
      });
    });

    return result;
  }

  private generateBooksListResponse(booksHtmlList: Array<HTMLElement>): Array<BooksByName> {
    return booksHtmlList.map((bookHTMLElement) => {
      const [resultBookName, /* divider */, ...resultBookAuthors] = bookHTMLElement.childNodes;
      const resultBookNameAsHTML = resultBookName as HTMLElement;
      const book: Book = this.getInformationOfBookOrAuthor(resultBookNameAsHTML);
      const authors: Array<Author> = this.getBookAuthors(resultBookAuthors);

      return {
        book,
        authors,
      };
    });
  }

  public async getBooksByName(name: string): Promise<Nullable<Array<BooksByName>>> {
    const booksListResult = await this.fetchBooksByNameFromFlibusta(name);

    if (isNil(booksListResult)) {
      return undefined;
    }

    const booksHtmlListWithoutPager = this.removePagerElements(booksListResult);
    const booksHtmlList = booksHtmlListWithoutPager.querySelectorAll('ul li');

    return this.generateBooksListResponse(booksHtmlList);
  }

  public async getBooksByNamePaginated(
    name: string,
    page = 0,
    limit = 50,
  ): Promise<Nullable<PaginatedSearchResult<Array<BooksByName>>>> {
    const booksListResult = await this.fetchBooksByNameFromFlibusta(name, page);

    if (isNil(booksListResult)) {
      return undefined;
    }

    const pages = this.getCurrentPageInformation(booksListResult);

    const booksSeriesHtmlListWithoutPager = this.removePagerElements(booksListResult);
    const books = booksSeriesHtmlListWithoutPager.querySelectorAll('ul li').slice(0, limit);

    const items = this.generateBooksListResponse(books);

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
