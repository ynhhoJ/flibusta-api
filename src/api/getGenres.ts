import { AxiosInstance } from 'axios';
import { HTMLElement } from 'node-html-parser';
import { isNil } from 'lodash';
import FlibustaAPIHelper from '@src/flibustaApiHelper';
import String from '@utils/string';
import { Genres } from '@localTypes/genres';
import { Nullable } from '@localTypes/generals';
import { SearchGenresResult } from '@localTypes/searchGenresResult';

class GetGenres extends FlibustaAPIHelper {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    super(axiosInstance);

    this.axiosInstance = axiosInstance;
  }

  private static generateGetGenresURL(name: string, page: number) {
    return `booksearch?ask=${encodeURIComponent(name)}&page=${page}&chg=on`;
  }

  private async fetchGenresFromFlibusta(name: string, page = 0): Promise<HTMLElement | null> {
    const url = GetGenres.generateGetGenresURL(name, page);

    return this.getFlibustaHTMLPage(url);
  }

  private static getInformationOfGenres(node: HTMLElement): Genres {
    const rawId = node.attrs.href;
    const id = rawId.replace('/g/', '');
    const rawName = node.childNodes.map((string) => string.text);
    const name = String.concatenateString(rawName);

    return {
      id,
      name,
    };
  }

  private generateGenresListResponse(genresHtmlList: Array<HTMLElement>): Array<Genres> {
    return genresHtmlList.map((genreHTMLElement) => {
      const [resultGenreName] = genreHTMLElement.childNodes;
      const resultGenreNameAsHTML = resultGenreName as HTMLElement;

      return GetGenres.getInformationOfGenres(resultGenreNameAsHTML);
    });
  }

  async getGenres(name: string): Promise<Nullable<Array<Genres>>> {
    const genresListResult = await this.fetchGenresFromFlibusta(name);

    if (isNil(genresListResult)) {
      return undefined;
    }

    const genresHtmlListWithoutPager = this.removePagerElements(genresListResult);
    const genresHtmlList = genresHtmlListWithoutPager.querySelectorAll('ul li');

    return this.generateGenresListResponse(genresHtmlList);
  }

  public async getGenresPaginated(
    name: string,
    page = 0,
    limit = 50,
  ): Promise<Nullable<SearchGenresResult>> {
    const genresListResult = await this.fetchGenresFromFlibusta(name, page);

    if (isNil(genresListResult)) {
      return undefined;
    }

    const pages = this.getCurrentPageInformation(genresListResult);

    const genresHtmlListWithoutPager = this.removePagerElements(genresListResult);
    const genres = genresHtmlListWithoutPager.querySelectorAll('ul li').slice(0, limit);

    const items = this.generateGenresListResponse(genres);

    const genresListResultAsHTML = genresListResult as HTMLElement;
    const totalCountItems = this.getTotalItemsCount(genresListResultAsHTML);

    return {
      items,
      currentPage: page,
      totalCountItems,
      ...pages,
    };
  }
}

export default GetGenres;
