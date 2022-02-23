import { AxiosInstance } from 'axios';
import { isNil } from 'lodash';

import { Nullable } from '@localTypes/generals';

type ImageFileTypes = 'jpg' | 'png';

class GetCoverByBookId {
  public axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  private static generateCoverUrl(id: number, y: number, fileType: ImageFileTypes) {
    return `i/${y}/${id}/cover.${fileType}`;
  }

  private async fetchImageByTypeUrl(url: string): Promise<Nullable<File>> {
    return this.axiosInstance.get<File>(url, {})
      .then((response) => response.data)
      // eslint-disable-next-line unicorn/no-useless-undefined
      .catch(() => undefined);
  }

  private async fetchCoverByUrl(id: number): Promise<Nullable<File>> {
    const idAsString = id.toString();
    const yAsString = idAsString.slice(4);
    const y = Number.parseInt(yAsString, 10);
    const jpgImageUrl = GetCoverByBookId.generateCoverUrl(id, y, 'jpg');
    const jpgImage = await this.fetchImageByTypeUrl(jpgImageUrl);

    if (!isNil(jpgImage)) {
      return jpgImage;
    }

    const pngImageUrl = GetCoverByBookId.generateCoverUrl(id, y, 'png');
    const pngImage = await this.fetchImageByTypeUrl(pngImageUrl);

    if (!isNil(pngImage)) {
      return pngImage;
    }

    return undefined;
  }

  public async getCoverByBookId(id: number) {
    return this.fetchCoverByUrl(id);
  }
}

export default GetCoverByBookId;
