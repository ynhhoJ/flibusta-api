import AxiosController from './axiosController';
import { PagesInformation } from '../types/pagesInformation';
import { HTMLElement, parse, Node } from 'node-html-parser';
import { isEmpty, isNil } from 'lodash';
import Author from '../types/authors';
import Book from '../types/book';
import StringUtils from './utils/string';

abstract class FlibustaAPIHelper {
  public axiosController: AxiosController;

  public getAuthorBooksRegExp = /\d+ книг/g;

  protected constructor(axiosController: AxiosController) {
    this.axiosController = axiosController;
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

  public getFlibustaHTMLPage(url: string): Promise<HTMLElement | null> {
    return this.axiosController.instance().get<string>(url)
      .then((response) => parse(response.data).querySelector('#main'))
      .catch((error) => {
        console.log(`[API] ERROR: ${error}`);

        // eslint-disable-next-line unicorn/no-null
        return null;
      });
  }

  public getInformationOfBookOrAuthor(node: Node): Author;
  public getInformationOfBookOrAuthor(node: Node): Book {
    const nodeAsHTMl = node as HTMLElement;
    const idAsString = StringUtils.getNumbersFromString(nodeAsHTMl.attrs.href);
    const id = Number.parseInt(idAsString, 10);
    const name = node.childNodes.map((string) => string.text).join('');

    return {
      id,
      name,
    };
  }

  public getBooksOrTranslations(booksOrTranslations: Array<Node>, regexRule: RegExp): string {
    const booksOrTranslationsAsString = booksOrTranslations.toString();
    const stringMatch = StringUtils.getStringMatches(booksOrTranslationsAsString, regexRule);

    if (isNil(stringMatch)) {
      // TODO: Remove "magic"/"unknown" string
      return '0';
    }

    const firstStringMatch = stringMatch[0];
    console.log('firstStringMatch', stringMatch, firstStringMatch, StringUtils.getNumbersFromString(firstStringMatch));

    return StringUtils.getNumbersFromString(firstStringMatch);
  }

  public getTotalItemsCount(parsedHTMLData: HTMLElement): number {
    const elementWithInformation = parsedHTMLData.querySelector('h3');
    const informationText = elementWithInformation?.text;

    if (isNil(informationText)) {
      return 0;
    }

    const number = informationText.split('из');

    if (number.length === 1) {
      return 0;
    }

    // TODO: REWRITE
    const matchedResult = number[1].match(/\d+/);

    if (isNil(matchedResult)) {
      return 0;
    }

    return Number.parseInt(matchedResult[0], 10);
  }
}

export default FlibustaAPIHelper;
