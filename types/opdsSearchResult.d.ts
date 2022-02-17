import { Nullable } from '@localTypes/generals';

export interface OpdsLinkType {
  '@_href': string;
  '@_rel': string;
  '@_type': string;
}

interface OpdsEntryLink extends OpdsLinkType {
  '@_title': Nullable<string>;
}

export type Category = {
  '@_term': string;
  '@_label': string;
};

export type Author = {
  name: string;
  uri: string;
};

export type OpdsEntryAuthor = Array<Author> | Author;

export type OpdsEntry = {
  updated: string;
  title: string;
  author: OpdsEntryAuthor,
  link: Array<OpdsEntryLink>
  category: Array<Category> | Category,
  'dc:language': string;
  'dc:format': string;
  'dc:issued': Nullable<number>;
  content: {
    '#text': string;
    '@_type': string;
  },
  id: string;
};

export type OpdsSearchResult = {
  '?xml': {
    '@_version': string;
    '@_encoding': string;
  },
  feed: {
    id: string;
    title: string;
    updated: string;
    icon: string;
    link: Array<OpdsLinkType>;
    entry: Nullable<Array<OpdsEntry>>;
    'os:totalResults': number;
    'os:startIndex': number;
    'os:itemsPerPage': number;
    '@_xmlns': string;
    '@_xmlns:dc': string;
    '@_xmlns:os': string;
    '@_xmlns:opds': string;
  },
};
