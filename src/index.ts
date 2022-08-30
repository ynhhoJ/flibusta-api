import axios, { AxiosRequestConfig } from 'axios';

import GetAuthors from './api/getAuthors';
import GetBooksByAuthorOpds from './api/getBooksByAuthorOpds';
import GetBooksByName from './api/getBooksByName';
import GetBooksByNameOpds from './api/getBooksByNameOpds';
import GetBooksBySeries from './api/getBooksBySeries';
import GetCoverByBookId from '@src/api/getCoverByBookId';
import GetGenres from './api/getGenres';

class FlibustaAPI {
  private readonly getAuthorsApi: GetAuthors;

  private readonly getBooksByAuthorOpdsApi: GetBooksByAuthorOpds;

  private readonly getBooksByNameApi: GetBooksByName;

  private readonly getBooksByNameOpdsApi: GetBooksByNameOpds;

  private readonly getBooksBySeriesApi: GetBooksBySeries;

  private readonly getCoverByBookIdApi: GetCoverByBookId;

  private readonly getGenresApi: GetGenres;

  constructor(flibustaBaseURL = 'http://flibusta.is', axiosConfig?: AxiosRequestConfig, isOnion?: boolean) {
    flibustaBaseURL = isOnion ? 'http://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion'
      : flibustaBaseURL;

    const axiosInstance = axios.create({
      baseURL: flibustaBaseURL,
      ...axiosConfig,
    });

    this.getAuthorsApi = new GetAuthors(axiosInstance);
    this.getBooksByAuthorOpdsApi = new GetBooksByAuthorOpds(axiosInstance);
    this.getBooksByNameApi = new GetBooksByName(axiosInstance);
    this.getBooksByNameOpdsApi = new GetBooksByNameOpds(axiosInstance);
    this.getBooksBySeriesApi = new GetBooksBySeries(axiosInstance);
    this.getCoverByBookIdApi = new GetCoverByBookId(axiosInstance);
    this.getGenresApi = new GetGenres(axiosInstance);
  }

  async getAuthors(name: string) {
    return this.getAuthorsApi.getAuthors(name);
  }

  async getBooksByAuthorOpds(id: number) {
    return this.getBooksByAuthorOpdsApi.getAuthorsFromOpds(id);
  }

  async getBooksByAuthorOpdsPaginated(id: number, page = 0, limit = 50) {
    return this.getBooksByAuthorOpdsApi.getAuthorsFromOpdsPaginated(id, page, limit);
  }

  async getAuthorsPaginated(name: string, page = 0, limit = 50) {
    return this.getAuthorsApi.getAuthorsPaginated(name, page, limit);
  }

  async getBooksByName(name: string) {
    return this.getBooksByNameApi.getBooksByName(name);
  }

  async getBooksByNameFromOpds(name: string) {
    return this.getBooksByNameOpdsApi.getBooksByNameFromOpds(name);
  }

  async getBooksByNameFromOpdsPaginated(name: string, page = 0, limit = 20) {
    return this.getBooksByNameOpdsApi.getBooksByNameFromOpdsPaginated(name, page, limit);
  }

  async getBooksByNamePaginated(name: string, page = 0, limit = 50) {
    return this.getBooksByNameApi.getBooksByNamePaginated(name, page, limit);
  }

  async getBooksBySeries(name: string) {
    return this.getBooksBySeriesApi.getBooksBySeries(name);
  }

  async getBooksBySeriesPaginated(name: string, page = 0, limit = 50) {
    return this.getBooksBySeriesApi.getBooksBySeriesPaginated(name, page, limit);
  }

  async getCoverByBookId(id: number) {
    return this.getCoverByBookIdApi.getCoverByBookId(id);
  }

  async getGenres(name: string) {
    return this.getGenresApi.getGenres(name);
  }

  async getGenresPaginated(name: string, page = 0, limit = 50) {
    return this.getGenresApi.getGenresPaginated(name, page, limit);
  }
}

export default FlibustaAPI;
