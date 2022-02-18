import { AxiosInstance } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { isArray, isNil, round } from 'lodash';

import { Nullable } from '@localTypes/generals';
// eslint-disable-next-line object-curly-newline
import {
  Author,
  Category,
  OpdsEntry,
  OpdsEntryAuthor,
  OpdsLinkType,
  OpdsSearchResult } from '@localTypes/opdsSearchResult';
import { Categories, Downloads, SearchBooksByNameOpdsResult } from '@localTypes/searchBooksByNameOpdsResult';
import { PagesInformation } from '@localTypes/pagesInformation';

class FlibustaOpdsApiHelper {
  private static ITEMS_PER_PAGE = 20;

  private static FlibustaFileMIMETypesToDownload = new Set([
    'application/epub',
    'application/fb2+zip',
    'application/html+zip',
    'application/pdf+rar',
    'application/rtf+zip',
    'application/txt+zip',
    'application/x-mobipocket-ebook',
  ]);

  private static getAuthorsFromOpdsEntry(authors: OpdsEntryAuthor): Array<Author> {
    if (!isArray(authors)) {
      return [authors];
    }

    return authors.map((author) => ({
      name: author.name,
      uri: author.uri,
    }));
  }

  private static getCategoriesFromOpdsEntry(categories: Array<Category> | Category): Array<Categories> {
    if (!isArray(categories)) {
      return [categories['@_label']];
    }

    return categories.map((category) => category['@_label']);
  }

  private static getCoverFromLink(links: Array<OpdsLinkType>): Nullable<string> {
    if (isNil(links)) {
      return undefined;
    }

    const result = links.find((link) => link['@_type'] === 'image/jpeg');

    if (isNil(result)) {
      return undefined;
    }

    return result['@_href'];
  }

  private static getDownloadsItemList(links: Array<OpdsLinkType>): Array<Downloads> {
    const { FlibustaFileMIMETypesToDownload } = FlibustaOpdsApiHelper;
    const result = links.filter((link) => FlibustaFileMIMETypesToDownload.has(link['@_type']));

    return result.map((item) => ({
      link: item['@_href'],
      type: item['@_type'],
    }));
  }

  public axiosInstance: AxiosInstance;

  protected constructor(axiosController: AxiosInstance) {
    this.axiosInstance = axiosController;
  }

  public prepareResponseFromOpdsEntry(entry: Array<OpdsEntry>): Array<SearchBooksByNameOpdsResult> {
    return entry.map((item) => {
      const {
        author, link, title, updated, content, category,
      } = item;

      return {
        author: FlibustaOpdsApiHelper.getAuthorsFromOpdsEntry(author),
        title,
        updated,
        categories: FlibustaOpdsApiHelper.getCategoriesFromOpdsEntry(category),
        cover: FlibustaOpdsApiHelper.getCoverFromLink(link),
        downloads: FlibustaOpdsApiHelper.getDownloadsItemList(link),
        description: content['#text'],
      };
    });
  }

  public getTotalPagesCount(totalResults: number, itemsPerPage: number): number {
    return round(totalResults / itemsPerPage, 0);
  }

  public hasNextPage(feed: OpdsSearchResult['feed']): boolean {
    const totalResults = feed['os:totalResults'];
    const currentPageIndex = feed['os:startIndex'];

    return (currentPageIndex + FlibustaOpdsApiHelper.ITEMS_PER_PAGE) < totalResults;
  }

  public hasPreviousPage(feed: OpdsSearchResult['feed']): boolean {
    const currentPageIndex = feed['os:startIndex'];

    return !!(currentPageIndex / FlibustaOpdsApiHelper.ITEMS_PER_PAGE);
  }

  public getCurrentOpdsPageInformation(feed: OpdsSearchResult['feed']): PagesInformation {
    const totalResults = feed['os:totalResults'];
    const itemsPerPage = feed['os:itemsPerPage'];
    const hasNextPage = this.hasNextPage(feed);
    const hasPreviousPage = this.hasPreviousPage(feed);
    const totalPages = this.getTotalPagesCount(totalResults, itemsPerPage);

    return {
      hasNextPage,
      hasPreviousPage,
      totalPages,
    };
  }

  public async getFlibustaOpdsEntry(url: string): Promise<Nullable<OpdsSearchResult>> {
    return this.axiosInstance.get<string>(url)
      .then((response) => {
        const parsingOptions = {
          ignoreAttributes: false,
          unpairedTags: ['hr', 'br', 'link', 'meta'],
          stopNodes: ['*.pre', '*.script'],
          processEntities: true,
          htmlEntities: true,
        };
        const parser = new XMLParser(parsingOptions);

        return parser.parse(response.data);
      })
      .catch((error) => {
        console.log(`[API] ERROR: ${error}`);

        // eslint-disable-next-line unicorn/no-null
        return null;
      });
  }
}

export default FlibustaOpdsApiHelper;
