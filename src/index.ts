import axios, { AxiosRequestConfig } from 'axios';
import GetAuthors from './api/getAuthors';
import GetBooksByName from './api/getBooksByName';
import GetBooksBySeries from './api/getBooksBySeries';

class FlibustaAPI {
  private readonly apiGetBooksByName: GetBooksByName;

  private readonly apiGetBooksBySeries: GetBooksBySeries;

  private readonly apiGetAuthors: GetAuthors;

  constructor(flibustaBaseURL = 'http://flibusta.is/', axiosConfig?: AxiosRequestConfig) {
    const axiosInstance = axios.create({
      baseURL: flibustaBaseURL,
      ...axiosConfig,
    });

    this.apiGetBooksByName = new GetBooksByName(axiosInstance);
    this.apiGetBooksBySeries = new GetBooksBySeries(axiosInstance);
    this.apiGetAuthors = new GetAuthors(axiosInstance);
  }

  getBooksByName(name: string, page = 0, limit = 50) {
    return this.apiGetBooksByName.getBooksByName(name, page, limit);
  }

  getBooksBySeries(name: string, page = 0, limit = 50) {
    return this.apiGetBooksBySeries.getBooksBySeries(name, page, limit);
  }

  getAuthors(name: string, page = 0, limit = 50) {
    return this.apiGetAuthors.getAuthors(name, page, limit);
  }
}

export default FlibustaAPI;
