import axios from 'axios';
import { HTMLElement, Node, parse } from 'node-html-parser';
import StringUtils from './utils/string';
import Errors from './errors';
import Author from '../types/authors';
import Book from '../types/book';
import { SearchAuthorsResult } from '../types/searchAuthorsResult';
import { SearchBooksByNameResult } from '../types/searchBooksByNameResult';
import { SearchBooksBySeriesResult } from '../types/searchBooksBySeriesResult';
import { isEmpty, isNil } from 'lodash';
import { PagesInformation } from '../types/pagesInformation';

class FlibustaApi {
  public static flibustaOirigin = 'http://flibusta.is/';

  private static axiosInstance = axios.create({
    baseURL: FlibustaApi.flibustaOirigin,
  });

  private static getAuthorBooksRegExp = /\d книг/g;

  private static getAuthorTranslationsRegExp = /\d перевода|\d перевод/g;

  private static parsedHTMLData: HTMLElement;

  private static getPagesCountedAndRemoveElement(): PagesInformation {
    const { parsedHTMLData } = FlibustaApi;
    // NOTE: Remove List of items which contains page numbers, because they contains <ul> & <li> and can create
    //       problems on parsing items from Flibusta
    const pagerElement = parsedHTMLData.querySelectorAll('div.item-list .pager');

    if (isEmpty(pagerElement)) {
      return {
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    // NOTE: In flibusta's search is 2 pager elements. We remove second, to get correct values on parsing pages number
    pagerElement[1].remove();

    const firstPagerElement = pagerElement[0];
    const firstPagerElementChildNodes = pagerElement[0].childNodes;
    const count = firstPagerElementChildNodes.filter((element) => {
      const htmlElement = element as HTMLElement;

      return htmlElement.attrs?.class.includes('pager-current') || htmlElement.attrs?.class.includes('pager-item');
    });
    const hasNextPage = firstPagerElementChildNodes.some((element) => {
      const htmlElement = element as HTMLElement;

      return htmlElement.attrs?.class === 'pager-next';
    });
    const hasPreviousPage = firstPagerElementChildNodes.some((element) => {
      const htmlElement = element as HTMLElement;

      return htmlElement.attrs?.class === 'pager-previous';
    });

    firstPagerElement.remove();

    return {
      totalPages: count.length,
      hasNextPage,
      hasPreviousPage,
    };
  }

  private static getTotalItemsCount(): number {
    const { parsedHTMLData } = FlibustaApi;
    const elementWithInformation = parsedHTMLData.querySelector('h3');
    const informationText = elementWithInformation?.text;

    if (isNil(informationText)) {
      return 0;
    }

    const number = informationText.split('из');

    if (number.length === 1) {
      return 0;
    }

    const matchedResult = number[1].match(/\d+/);

    if (isNil(matchedResult)) {
      return 0;
    }

    return Number.parseInt(matchedResult[0], 10);
  }

  private static getInformationOfBookOrAuthor(node: Node): Author;
  private static getInformationOfBookOrAuthor(node: Node): Book {
    const nodeAsHTMl = node as HTMLElement;
    const idAsString = StringUtils.getNumbersFromString(nodeAsHTMl.attrs.href);
    const id = Number.parseInt(idAsString, 10);
    const name = node.childNodes.map((string) => string.text).join('');

    return {
      id,
      name,
    };
  }

  private static getBookAuthors(node: Array<Node>): Array<Author> {
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

  private static getBooksOrTranslations(booksOrTranslations: Array<Node>, regexRule: RegExp): string {
    const booksOrTranslationsAsString = booksOrTranslations.toString();
    const stringMatch = StringUtils.getStringMatches(booksOrTranslationsAsString, regexRule);

    if (isNil(stringMatch)) {
      // TODO: Remove "magic"/"unknown" string
      return '0';
    }

    const firstStringMatch = stringMatch[0];

    return StringUtils.getNumbersFromString(firstStringMatch);
  }

  public static async searchAuthors(author: string, limit = 50, page = 0): Promise<SearchAuthorsResult> {
    const searchResult = await FlibustaApi.axiosInstance.get(
      `booksearch?page=${page}&ask=${encodeURIComponent(author)}&cha=on`,
    );
    const parsedHTMLFromSearchResult = parse(searchResult.data).querySelector('#main');

    if (isNil(parsedHTMLFromSearchResult)) {
      const { searchAuthors } = FlibustaApi;
      const currentFunctionName = searchAuthors.name;

      throw new Error(`[${currentFunctionName}] ${Errors.PARSED_HTML_DATA_IS_NULL}`);
    }

    FlibustaApi.parsedHTMLData = parsedHTMLFromSearchResult;
    const totalPages = FlibustaApi.getPagesCountedAndRemoveElement();
    const authors = parsedHTMLFromSearchResult.querySelectorAll('ul li').slice(0, limit);

    const items = authors.map((item) => {
      const [authorInformation, ...booksOrTranslations] = item.childNodes;
      const booksAsString = FlibustaApi.getBooksOrTranslations(booksOrTranslations, FlibustaApi.getAuthorBooksRegExp);
      const translationsAsString = FlibustaApi.getBooksOrTranslations(
        booksOrTranslations,
        FlibustaApi.getAuthorTranslationsRegExp,
      );
      const books = Number.parseInt(booksAsString, 10);
      const translations = Number.parseInt(translationsAsString, 10);

      return {
        ...FlibustaApi.getInformationOfBookOrAuthor(authorInformation),
        books,
        translations,
      };
    });
    const totalCountItems = FlibustaApi.getTotalItemsCount();

    return {
      items,
      currentPage: page,
      ...totalPages,
      totalCountItems,
    };
  }

  public static async searchBooksByName(name: string, limit = 50, page = 0): Promise<SearchBooksByNameResult> {
    const searchResult = await FlibustaApi.axiosInstance.get(
      `booksearch?page=${page}&ask=${encodeURIComponent(name)}&chb=on`,
    );
    const parsedHTMLFromSearchResult = parse(searchResult.data).querySelector('#main');

    if (isNil(parsedHTMLFromSearchResult)) {
      const { searchBooksByName } = FlibustaApi;
      const currentFunctionName = searchBooksByName.name;

      throw new Error(`[${currentFunctionName}] ${Errors.PARSED_HTML_DATA_IS_NULL}`);
    }

    FlibustaApi.parsedHTMLData = parsedHTMLFromSearchResult;

    const pagesInformation = FlibustaApi.getPagesCountedAndRemoveElement();
    const books = parsedHTMLFromSearchResult.querySelectorAll('ul li').slice(0, limit);

    const items = books.map((book) => {
      const [resultBookName, /* divider */, ...resultBookAuthors] = book.childNodes;

      return {
        book: FlibustaApi.getInformationOfBookOrAuthor(resultBookName),
        authors: FlibustaApi.getBookAuthors(resultBookAuthors),
      };
    });
    const totalCountItems = FlibustaApi.getTotalItemsCount();

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pagesInformation,
    };
  }

  public static async searchBooksBySeries(name: string, limit = 50, page = 0): Promise<SearchBooksBySeriesResult> {
    const searchResult = await FlibustaApi.axiosInstance.get(
      `booksearch?page=${page}&ask=${encodeURIComponent(name)}&chs=on`,
    );
    const parsedHTMLFromSearchResult = parse(searchResult.data).querySelector('#main');

    if (isNil(parsedHTMLFromSearchResult)) {
      const { searchBooksBySeries } = FlibustaApi;
      const currentFunctionName = searchBooksBySeries.name;

      throw new Error(`[${currentFunctionName}] ${Errors.PARSED_HTML_DATA_IS_NULL}`);
    }

    FlibustaApi.parsedHTMLData = parsedHTMLFromSearchResult;

    const pagesInformation = FlibustaApi.getPagesCountedAndRemoveElement();
    const booksHTMLElement = parsedHTMLFromSearchResult.querySelectorAll('ul li').slice(0, limit);

    const items = booksHTMLElement.map((series) => {
      const [authorInformation, ...booksOrTranslations] = series.childNodes;
      const booksAsString = FlibustaApi.getBooksOrTranslations(booksOrTranslations, FlibustaApi.getAuthorBooksRegExp);
      const books = Number.parseInt(booksAsString, 10);

      return {
        ...FlibustaApi.getInformationOfBookOrAuthor(authorInformation),
        books,
      };
    });
    const totalCountItems = FlibustaApi.getTotalItemsCount();

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pagesInformation,
    };
  }
}

export const {
  searchBooksByName, searchBooksBySeries, searchAuthors,
} = FlibustaApi;
