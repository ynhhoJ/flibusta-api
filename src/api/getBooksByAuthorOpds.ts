import { AxiosInstance } from 'axios';
import { isNil } from 'lodash';

import FlibustaAPIHelper from '@src/flibustaApiHelper';
import { Nullable } from '@localTypes/generals';
import { SearchBooksByNameOpdsResult } from '@localTypes/searchBooksByNameOpdsResult';
import { OpdsSearchResult } from '@localTypes/opdsSearchResult';
import { SearchOpdsPaginatedResult } from '@localTypes/searchOpdsResult';

class GetBooksByAuthorOpds extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetAuthorsFromOpdsURL(id: number, page: number) {
    return `opds/author/${id}/alphabet/${page}`;
  }

  private async fetchAuthorsFromOpds(
    id: number,
    page = 0,
  ): Promise<Nullable<OpdsSearchResult['feed']>> {
    const url = GetBooksByAuthorOpds.generateGetAuthorsFromOpdsURL(id, page);
    const fetch = await this.getFlibustaOpdsEntry(url);

    if (isNil(fetch)) {
      return undefined;
    }

    const { feed } = fetch;

    return feed;
  }

  public async getAuthorsFromOpds(id: number): Promise<Nullable<Array<SearchBooksByNameOpdsResult>>> {
    const feed = await this.fetchAuthorsFromOpds(id);

    if (isNil(feed)) {
      return undefined;
    }

    const { entry } = feed;

    if (isNil(entry)) {
      return undefined;
    }

    return this.prepareResponseFromOpdsEntry(entry);
  }

  public async getAuthorsFromOpdsPaginated(
    id: number,
    page = 0,
    limit = 20,
  ): Promise<Nullable<SearchOpdsPaginatedResult<Array<SearchBooksByNameOpdsResult>>>> {
    const feed = await this.fetchAuthorsFromOpds(id, page);

    if (isNil(feed)) {
      return undefined;
    }

    const { entry } = feed;

    if (isNil(entry)) {
      return undefined;
    }

    const slicedEntryToLimit = entry.slice(0, limit);
    const items = this.prepareResponseFromOpdsEntry(slicedEntryToLimit);
    const pages = this.getCurrentOpdsPageInformation(feed, page);

    return {
      items,
      currentPage: page,
      ...pages,
    };
  }
}

export default GetBooksByAuthorOpds;
