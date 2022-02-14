import AxiosController from '../axiosController';
import FlibustaAPIHelper from '../flibustaApiHelper';
import { HTMLElement, Node } from 'node-html-parser';
import { isEmpty, isNil } from 'lodash';
import { SearchBooksByNameResult } from '../../types/searchBooksByNameResult';
import Author from '../../types/authors';
import StringUtils from '../utils/string';

class GetBooksByName extends FlibustaAPIHelper {
  public axiosController: AxiosController;

  constructor(axiosController: AxiosController) {
    super(axiosController);

    this.axiosController = axiosController;
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

    const items = books.map((book) => {
      const [resultBookName, /* divider */, ...resultBookAuthors] = book.childNodes;

      return {
        book: this.getInformationOfBookOrAuthor(resultBookName),
        authors: this.getBookAuthors(resultBookAuthors),
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
