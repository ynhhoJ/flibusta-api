import { AxiosInstance } from 'axios';
import { HTMLElement, parse, Node } from 'node-html-parser';
import { isEmpty, isNil } from 'lodash';

import Author from '@localTypes/authors';
import Book from '@localTypes/book';
import FlibustaOpdsApiHelper from '@src/flibustaOpdsApiHelper';
import String from '@utils/string';
import { PagesInformation } from '@localTypes/pagesInformation';
import { Nullable } from '@localTypes/generals';

abstract class FlibustaAPIHelper extends FlibustaOpdsApiHelper {
  public axiosInstance: AxiosInstance;

  public getAuthorBooksRegExp = /\d+ книг/g;

  public matchOnlyNumbersRegExp = /\d+/g;

  protected constructor(axiosController: AxiosInstance) {
    super(axiosController);

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
        throw error;
      });
  }

  public getInformationOfBookOrAuthor(node: HTMLElement): Author;
  public getInformationOfBookOrAuthor(node: HTMLElement): Book {
    const rawIdAsString = String.getNumbersFromString(node.attrs.href);
    const id = Number.parseInt(rawIdAsString, 10);

    const rawName = node.childNodes.map((string) => string.text);
    const name = String.concatenateString(rawName);

    return {
      id,
      name,
    };
  }

  public getBooksOrTranslations(booksOrTranslations: Array<Node>, regexRule: RegExp): Nullable<number> {
    const booksOrTranslationsAsString = booksOrTranslations.toString();
    const stringMatch = String.getStringMatches(booksOrTranslationsAsString, regexRule);

    if (isNil(stringMatch)) {
      return undefined;
    }

    const [booksItemsCountAsString] = stringMatch;
    const booksCountOnlyNumbers = String.getNumbersFromString(booksItemsCountAsString);

    return Number.parseInt(booksCountOnlyNumbers, 10);
  }

  public getTotalItemsCount(parsedHTMLData: HTMLElement): Nullable<number> {
    const rawFoundedHTMLInformation = parsedHTMLData.querySelector('h3');
    const foundedInformationText = rawFoundedHTMLInformation?.text;

    if (isNil(foundedInformationText)) {
      return undefined;
    }

    // NOTE: Flibusta search has on header information about founded result: "Найденные книги (1 - 50 из 228):"
    //       We should split string by "из" and get second number which contains all founded items count
    const [/* itemsShowedForCurrentPage */, foundedTotalItemsCount] = foundedInformationText.split('из');
    const totalItemsCountNumberMatch = foundedTotalItemsCount.match(this.matchOnlyNumbersRegExp);

    if (isNil(totalItemsCountNumberMatch)) {
      return undefined;
    }

    const [totalItemsCountNumberAsString] = totalItemsCountNumberMatch;

    return Number.parseInt(totalItemsCountNumberAsString, 10);
  }

  /**
   * Pager Elements a.k.a Pagination is created in flibusta using ul/ui and books/authors/series results are also
   * wrapped in ul/ui, pagination element may cause error at parsing those data and we need to remove it before parsing
   * starts.
   *
   * @param parsedHTMLData
   *
   * @return HTMLElement
   */
  public removePagerElements(parsedHTMLData: HTMLElement): HTMLElement {
    const pagerElement = parsedHTMLData.querySelectorAll('div.item-list .pager');

    if (isEmpty(pagerElement)) {
      return parsedHTMLData;
    }

    pagerElement.forEach((pager) => {
      pager.remove();
    });

    return parsedHTMLData;
  }
}

export default FlibustaAPIHelper;
