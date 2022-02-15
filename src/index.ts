//
import AxiosController from './axiosController';
import { AxiosRequestConfig } from 'axios';
import GetBooksByName from './api/getBooksByName';
import GetBooksBySeries from './api/getBooksBySeries';
import GetAuthors from './api/getAuthors';

class FlibustaAPI {
  private readonly GetBooksByName: GetBooksByName; //

  private readonly GetBooksBySeries: GetBooksBySeries; //

  private readonly GetAuthors: GetAuthors; //

  constructor(flibustaBaseURL: string, axiosConfig?: AxiosRequestConfig) { //
    const axiosController = new AxiosController({
      baseURL: flibustaBaseURL,
      ...axiosConfig,
    });

    this.GetBooksByName = new GetBooksByName(axiosController);
    this.GetBooksBySeries = new GetBooksBySeries(axiosController);
    this.GetAuthors = new GetAuthors(axiosController);
  }

  //
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
