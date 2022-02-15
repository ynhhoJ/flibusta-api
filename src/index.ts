import axios, { AxiosRequestConfig } from 'axios';
import GetAuthors from './api/getAuthors';
import GetBooksByName from './api/getBooksByName';
import GetBooksBySeries from './api/getBooksBySeries';

class FlibustaAPI {
  private readonly GetBooksByName: GetBooksByName;

  private readonly GetBooksBySeries: GetBooksBySeries;

  private readonly GetAuthors: GetAuthors;

  constructor(flibustaBaseURL: string, axiosConfig?: AxiosRequestConfig) {
    const axiosInstance = axios.create({
      baseURL: flibustaBaseURL,
      ...axiosConfig,
    });

    this.GetBooksByName = new GetBooksByName(axiosInstance);
    this.GetBooksBySeries = new GetBooksBySeries(axiosInstance);
    this.GetAuthors = new GetAuthors(axiosInstance);
  }

  getBooksByName(name: string, page = 0, limit = 50) {
    return this.GetBooksByName.getBooksByName(name, page, limit);
  }

  getBooksBySeries(name: string, page = 0, limit = 50) {
    return this.GetBooksBySeries.getBooksBySeries(name, page, limit);
  }

  getAuthors(name: string, page = 0, limit = 50) {
    return this.GetAuthors.getAuthors(name, page, limit);
  }
}

export default FlibustaAPI;
