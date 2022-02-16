import axios, { AxiosRequestConfig } from 'axios';
import GetAuthors from './api/getAuthors';
import GetBooksByName from './api/getBooksByName';
import GetBooksBySeries from './api/getBooksBySeries';

class FlibustaAPI {
  private readonly getAuthorsApi: GetAuthors;

  private readonly getBooksByNameApi: GetBooksByName;

  private readonly getBooksBySeriesApi: GetBooksBySeries;

  constructor(flibustaBaseURL = 'http://flibusta.is/', axiosConfig?: AxiosRequestConfig) {
    const axiosInstance = axios.create({
      baseURL: flibustaBaseURL,
      ...axiosConfig,
    });

    this.getAuthorsApi = new GetAuthors(axiosInstance);
    this.getBooksByNameApi = new GetBooksByName(axiosInstance);
    this.getBooksBySeriesApi = new GetBooksBySeries(axiosInstance);
  }

  getAuthors(name: string) {
    return this.getAuthorsApi.getAuthors(name);
  }

  getAuthorsPaginated(name: string, page = 0, limit = 50) {
    return this.getAuthorsApi.getAuthorsPaginated(name, page, limit);
  }

  getBooksByName(name: string) {
    return this.getBooksByNameApi.getBooksByName(name);
  }

  getBooksByNamePaginated(name: string, page = 0, limit = 50) {
    return this.getBooksByNameApi.getBooksByNamePaginated(name, page, limit);
  }

  getBooksBySeries(name: string) {
    return this.getBooksBySeriesApi.getBooksBySeries(name);
  }

  getBooksBySeriesPaginated(name: string, page = 0, limit = 50) {
    return this.getBooksBySeriesApi.getBooksBySeriesPaginated(name, page, limit);
  }
}

export default FlibustaAPI;
