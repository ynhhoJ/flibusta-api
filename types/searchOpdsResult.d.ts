import { PaginatedSearchResult } from './paginatedSearchResult';
import { PagesInformation } from './pagesInformation';

export type SearchOpdsPagesInformation = Omit<PagesInformation, 'totalPages'>;
export type SearchOpdsPaginatedResult<T> = Omit<PaginatedSearchResult<T>, 'totalPages' | 'totalCountItems'>;
