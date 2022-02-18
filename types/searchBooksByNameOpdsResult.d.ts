import { Author } from '@localTypes/opdsSearchResult';
import { Nullable } from '@localTypes/generals';

export type Categories = string;

export type Downloads = {
  link: string;
  type: string;
};

export type SearchBooksByNameOpdsResult = {
  author: Array<Author>;
  title: string;
  updated: string;
  categories: Array<Categories>;
  cover: Nullable<string>;
  downloads: Array<Downloads>;
  description: string;
};
