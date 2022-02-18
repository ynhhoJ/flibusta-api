import { AxiosInstance } from 'axios';
import { isNil } from 'lodash';

import FlibustaAPIHelper from '@src/flibustaApiHelper';
import { Nullable } from '@localTypes/generals';
import { SearchBooksByNameOpdsResult } from '@localTypes/searchBooksByNameOpdsResult';
import { OpdsSearchResult } from '@localTypes/opdsSearchResult';
import { PaginatedSearchResult } from '@localTypes/paginatedSearchResult';

class GetBooksByNameOpds extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetBooksByNameFromOpdsURL(name: string, page: number) {
    return `opds/opensearch?searchTerm=${encodeURIComponent(name)}&searchType=books&pageNumber=${page}`;
  }

  private async fetchBooksByNameFromOpds(
    name: string,
    page = 0,
  ): Promise<Nullable<OpdsSearchResult['feed']>> {
    const url = GetBooksByNameOpds.generateGetBooksByNameFromOpdsURL(name, page);
    const fetch = await this.getFlibustaOpdsEntry(url);

    if (isNil(fetch)) {
      return undefined;
    }

    const { feed } = fetch;

    return feed;
  }

  public async getBooksByNameFromOpds(name: string): Promise<Nullable<Array<SearchBooksByNameOpdsResult>>> {
    const feed = await this.fetchBooksByNameFromOpds(name);

    if (isNil(feed)) {
      return undefined;
    }

    const { entry } = feed;

    if (isNil(entry)) {
      return undefined;
    }

    return this.prepareResponseFromOpdsEntry(entry);
  }

  public async getBooksByNameFromOpdsPaginated(
    name: string,
    page = 0,
    limit = 20,
  ): Promise<Nullable<PaginatedSearchResult<Array<SearchBooksByNameOpdsResult>>>> {
    const feed = await this.fetchBooksByNameFromOpds(name, page);

    if (isNil(feed)) {
      return undefined;
    }

    const { entry } = feed;

    if (isNil(entry)) {
      return undefined;
    }

    const slicedEntryToLimit = entry.slice(0, limit);
    const items = this.prepareResponseFromOpdsEntry(slicedEntryToLimit);
    const pages = this.getCurrentOpdsPageInformation(feed);
    const totalCountItems = feed['os:totalResults'];

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pages,
    };
  }
}

export default GetBooksByNameOpds;
