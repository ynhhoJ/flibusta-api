//
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class AxiosController {
  private readonly axiosInstance: AxiosInstance;

  constructor(axiosConfig: AxiosRequestConfig) {
    this.axiosInstance = axios.create(axiosConfig);
  }

  public instance(): AxiosInstance {
    return this.axiosInstance;
  }

  //
  public setBaseURL(flibustaBaseURL: string) {
    this.axiosInstance.defaults.baseURL = flibustaBaseURL;
  }
}

export default AxiosController;
