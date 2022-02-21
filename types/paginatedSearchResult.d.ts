import { Nullable } from './generals';

export type PaginatedSearchResult<T> = {
  items: T;
  currentPage: number;
  totalCountItems: Nullable<number>;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
