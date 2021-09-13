import axios from 'axios';
import { HTMLElement, Node, parse } from 'node-html-parser';
import StringUtils from './utils/string';
import Lang from './utils/lang';

class FlibustaApi {
  public static flibustaOirigin = 'http://flibusta.is/';

  private static axiosInstance = axios.create({
    baseURL: this.flibustaOirigin,
  });

  private static getAuthorBooksRegExp = /\d книг/g;

  private static getAuthorTranslationsRegExp = /\d книг/g;

  private static parsedHTMLData: HTMLElement;

  private static removePagerElement(): void {
    // NOTE: Remove List of items which contains page numbers
    const pagerElement = this.parsedHTMLData.querySelectorAll('div.item-list .pager');

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
    const searchResult = await this.axiosInstance.get(`booksearch?ask=${encodeURIComponent(author)}&cha=on`);
    this.parsedHTMLData = parse(searchResult.data).querySelector('#main');

    this.removePagerElement();

    const authors = this.parsedHTMLData.querySelectorAll('ul li');

    return authors.map((item) => {
      const [authorInformation, ...booksOrTranslations] = item.childNodes;
      const booksAsString = this.getBooksOrTranslations(booksOrTranslations, this.getAuthorBooksRegExp);
      const translationsAsString = this.getBooksOrTranslations(booksOrTranslations, this.getAuthorTranslationsRegExp);
      const books = Number.parseInt(booksAsString, 10);
      const translations = Number.parseInt(translationsAsString, 10);

      return {
        ...this.getInformationOfBookOrAuthor(authorInformation),
        books,
        translations,
      };
    }).slice(0, limit);
  }

  public static async searchBooksByName(name: string, limit = 50): Promise<Array<SearchBooksByNameResult>> {
    const searchResult = await this.axiosInstance.get(`booksearch?ask=${encodeURIComponent(name)}&chb=on`);
    this.parsedHTMLData = parse(searchResult.data).querySelector('#main');

    this.removePagerElement();

    const books = this.parsedHTMLData.querySelectorAll('ul li');

    return books.map((book) => {
      const [resultBookName, /* divider */, ...resultBookAuthors] = book.childNodes;

      return {
        book: this.getInformationOfBookOrAuthor(resultBookName),
        authors: this.getBookAuthors(resultBookAuthors),
      };
    }).slice(0, limit);
  }
}

export const { searchBooksByName, searchAuthors } = FlibustaApi;
