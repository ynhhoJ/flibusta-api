import { Author } from './opdsSearchResult';
import { Nullable } from './generals';

export type Categories = string;

export type Downloads = {
  link: string;
  type: string;
};

// TODO: Rename to more common type
export type SearchBooksByNameOpdsResult = {
  author: Array<Author>;
  title: string;
  updated: string;
  categories: Array<Categories>;
  cover: Nullable<string>;
  downloads: Array<Downloads>;
  description: string;
};
