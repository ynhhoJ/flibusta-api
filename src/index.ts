import axios from 'axios';
import { HTMLElement, Node, parse } from 'node-html-parser';
import { isNil } from 'lodash';
import StringUtils from './utils/string';
import Lang from './utils/lang';
import Errors from './errors';

class FlibustaApi {
  public static flibustaOirigin = 'http://flibusta.is/';

  private static axiosInstance = axios.create({
    baseURL: FlibustaApi.flibustaOirigin,
  });

  private static getAuthorBooksRegExp = /\d книг/g;

  private static getAuthorTranslationsRegExp = /\d перевода|\d перевод/g;

  private static parsedHTMLData: HTMLElement;

  private static removePagerElement(): void {
    const { parsedHTMLData } = FlibustaApi;
    // NOTE: Remove List of items which contains page numbers
    const pagerElement = parsedHTMLData.querySelectorAll('div.item-list .pager');

    pagerElement.forEach((pager) => {
      pager.remove();
    });
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

    if (Lang.isNil(stringMatch)) {
      return '0';
    }

    const firstStringMatch = stringMatch[0];

    return StringUtils.getNumbersFromString(firstStringMatch);
  }

  public static async searchAuthors(author: string, limit = 50): Promise<Array<AuthorBooks>> {
    const searchResult = await FlibustaApi.axiosInstance.get(`booksearch?ask=${encodeURIComponent(author)}&cha=on`);
    const parsedHTMLFromSearchResult = parse(searchResult.data).querySelector('#main');

    FlibustaApi.removePagerElement();

    if (isNil(parsedHTMLFromSearchResult)) {
      const { searchAuthors } = FlibustaApi;
      const currentFunctionName = searchAuthors.name;

      throw new Error(`[${currentFunctionName}] ${Errors.PARSED_HTML_DATA_IS_NULL}`);
    }

    FlibustaApi.parsedHTMLData = parsedHTMLFromSearchResult;
    const authors = parsedHTMLFromSearchResult.querySelectorAll('ul li');

    return authors.map((item) => {
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
    }).slice(0, limit);
  }

  public static async searchBooksByName(name: string, limit = 50): Promise<Array<SearchBooksByNameResult>> {
    const searchResult = await FlibustaApi.axiosInstance.get(`booksearch?ask=${encodeURIComponent(name)}&chb=on`);
    const parsedHTMLFromSearchResult = parse(searchResult.data).querySelector('#main');

    FlibustaApi.removePagerElement();

    if (isNil(parsedHTMLFromSearchResult)) {
      const { searchBooksByName } = FlibustaApi;
      const currentFunctionName = searchBooksByName.name;

      throw new Error(`[${currentFunctionName}] ${Errors.PARSED_HTML_DATA_IS_NULL}`);
    }

    FlibustaApi.parsedHTMLData = parsedHTMLFromSearchResult;
    const books = parsedHTMLFromSearchResult.querySelectorAll('ul li');

    return books.map((book) => {
      const [resultBookName, /* divider */, ...resultBookAuthors] = book.childNodes;

      return {
        book: FlibustaApi.getInformationOfBookOrAuthor(resultBookName),
        authors: FlibustaApi.getBookAuthors(resultBookAuthors),
      };
    }).slice(0, limit);
  }

  public static async searchBooksBySeries(name: string, limit = 50): Promise<Array<BookSeries>> {
    const searchResult = await FlibustaApi.axiosInstance.get(`booksearch?ask=${encodeURIComponent(name)}&chs=on`);
    const parsedHTMLFromSearchResult = parse(searchResult.data).querySelector('#main');

    FlibustaApi.removePagerElement();

    if (isNil(parsedHTMLFromSearchResult)) {
      const { searchBooksBySeries } = FlibustaApi;
      const currentFunctionName = searchBooksBySeries.name;

      throw new Error(`[${currentFunctionName}] ${Errors.PARSED_HTML_DATA_IS_NULL}`);
    }

    FlibustaApi.parsedHTMLData = parsedHTMLFromSearchResult;
    const booksHTMLElement = parsedHTMLFromSearchResult.querySelectorAll('ul li');

    return booksHTMLElement.map((series) => {
      const [authorInformation, ...booksOrTranslations] = series.childNodes;
      const booksAsString = FlibustaApi.getBooksOrTranslations(booksOrTranslations, FlibustaApi.getAuthorBooksRegExp);
      const books = Number.parseInt(booksAsString, 10);

      return {
        ...FlibustaApi.getInformationOfBookOrAuthor(authorInformation),
        books,
      };
    }).slice(0, limit);
  }
}

export const {
  searchBooksByName, searchBooksBySeries, searchAuthors,
} = FlibustaApi;