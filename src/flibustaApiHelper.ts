import Author from '../types/authors';
import Book from '../types/book';
import StringUtils from './utils/string';
import { AxiosInstance } from 'axios';
import { HTMLElement, parse, Node } from 'node-html-parser';
import { PagesInformation } from '../types/pagesInformation';
import { isEmpty, isNil, parseInt } from 'lodash';

abstract class FlibustaAPIHelper {
  private static NIL_RESULT = -1;

  public axiosInstance: AxiosInstance;

  public getAuthorBooksRegExp = /\d+ книг/g;

  public matchOnlyNumbersRegExp = /\d+/g;

  protected constructor(axiosController: AxiosInstance) {
    this.axiosInstance = axiosController;
  }

  public getCurrentPageInformation(parsedHTMLData: HTMLElement): PagesInformation {
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

    return {
      totalPages: count.length,
      hasNextPage,
      hasPreviousPage,
    };
  }

  public async getFlibustaHTMLPage(url: string): Promise<HTMLElement | null> {
    return this.axiosInstance.get<string>(url)
      .then((response) => parse(response.data).querySelector('#main'))
      .catch((error) => {
        console.log(`[API] ERROR: ${error}`);

        // eslint-disable-next-line unicorn/no-null
        return null;
      });
  }

  public getInformationOfBookOrAuthor(node: HTMLElement): Author;
  public getInformationOfBookOrAuthor(node: HTMLElement): Book {
    const rawIdAsString = StringUtils.getNumbersFromString(node.attrs.href);
    const id = Number.parseInt(rawIdAsString, 10);

    const rawName = node.childNodes.map((string) => string.text);
    const name = StringUtils.concatenateString(rawName);

    return {
      id,
      name,
    };
  }

  public getBooksOrTranslations(booksOrTranslations: Array<Node>, regexRule: RegExp): number {
    const booksOrTranslationsAsString = booksOrTranslations.toString();
    const stringMatch = StringUtils.getStringMatches(booksOrTranslationsAsString, regexRule);

    if (isNil(stringMatch)) {
      return FlibustaAPIHelper.NIL_RESULT;
    }

    // NOTE:       584 книг
    const [booksItemsCountAsString] = stringMatch;
    const booksCountOnlyNumbers = StringUtils.getNumbersFromString(booksItemsCountAsString);

    return parseInt(booksCountOnlyNumbers, 10);
  }

  public getTotalItemsCount(parsedHTMLData: HTMLElement): number {
    const rawFoundedHTMLInformation = parsedHTMLData.querySelector('h3');
    const foundedInformationText = rawFoundedHTMLInformation?.text;

    if (isNil(foundedInformationText)) {
      return FlibustaAPIHelper.NIL_RESULT;
    }

    // NOTE: Flibusta search has on header information about founded result: "Найденные книги (1 - 50 из 228):"
    //       We should split string by "из" and get second number which contains all founded items count
    const [/* itemsShowedForCurrentPage */, foundedTotalItemsCount] = foundedInformationText.split('из');
    const totalItemsCountNumberMatch = foundedTotalItemsCount.match(this.matchOnlyNumbersRegExp);

    if (isNil(totalItemsCountNumberMatch)) {
      return FlibustaAPIHelper.NIL_RESULT;
    }

    const [totalItemsCountNumberAsString] = totalItemsCountNumberMatch;

    return Number.parseInt(totalItemsCountNumberAsString, 10);
  }
}

export default FlibustaAPIHelper;
