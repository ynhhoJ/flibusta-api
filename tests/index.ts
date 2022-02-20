/* eslint-disable */
import 'mocha';
import { expect, should } from 'chai';
import { isNil, isNumber, isString } from 'lodash';

import FlibustaAPI from '@src/index';
import { SearchBooksByNameOpdsResult } from '@localTypes/searchBooksByNameOpdsResult';
import { PaginatedSearchResult } from '@localTypes/paginatedSearchResult';
import {Genres} from "@localTypes/genres";

should();

describe('FlibustaAPI', () => {
  const flibustaApi = new FlibustaAPI();

  describe('getAuthors', () => {
    const authorName = 'Артур Конан Дойль';
    const unexistAuthorName = 'Арт$ур Ко@$!12на312 Дой%#@ль';

    describe('getAuthors()', () => {
      it('should get authors by name', async () => {
        const authorsResultList = await flibustaApi.getAuthors(authorName);

        return expect(authorsResultList).to.be.deep.equal([{
          id: 6116,
          name: authorName,
          books: 584,
          translations: undefined,
        }]);
      });

      it('should get authors by name empty result', async () => {
        const authorsResultList = await flibustaApi.getAuthors(unexistAuthorName);

        return expect(authorsResultList).to.be.deep.equal([]);
      });
    });

    describe('getAuthorsPaginated()', () => {
      it('should get authors paginated by name', async () => {
        const authorsResultListPaginated = await flibustaApi.getAuthorsPaginated(
          authorName,
          0,
          1,
        );

        return expect(authorsResultListPaginated).to.be.deep.equal({
          items: [{
            id: 6116,
            name: authorName,
            books: 584,
            translations: undefined,
          }],
          currentPage: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCountItems: 1,
          totalPages: 1,
        });
      });

      it('should get authors by name empty result', async () => {
        const authorsResultListPaginated = await flibustaApi.getAuthorsPaginated(unexistAuthorName, 0, 1);

        return expect(authorsResultListPaginated).to.be.deep.equal({
          items: [],
          currentPage: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCountItems: undefined,
          totalPages: 1,
        });
      });
    });
  });

  describe('getBooksByName', () => {
    const bookName = 'Этюд в багровых тонах; Знак четырех: Повести; Приключения Шерлока Холмса: Рассказы';
    const expectedItem = [{
      authors: [
        {
          id: 6116,
          name: 'Артур Конан Дойль',
        },
      ],
      book: {
        id: 577_484,
        name: bookName,
      },
    }];

    describe('getBooksByName()', () => {
      it('should get books by name', async () => {
        const authorsResultList = await flibustaApi.getBooksByName(bookName);

        return expect(authorsResultList).to.be.deep.equal(expectedItem);
      });
    });

    describe('getBooksByNamePaginated()', () => {
      it('should get books by name paginated', async () => {
        const authorsResultList = await flibustaApi.getBooksByNamePaginated(bookName);

        return expect(authorsResultList).to.be.deep.equal({
          items: expectedItem,
          currentPage: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCountItems: 1,
          totalPages: 1,
        });
      });
    });
  });

  describe('getBooksByNameOpds', () => {
    describe('getBooksByNameFromOpds()', () => {
      it('should return correct books parsed by name from opds', async () => {
        const name = 'Шерлок';
        const booksByNameFromOpds = await flibustaApi.getBooksByNameFromOpds(name);

        if (isNil(booksByNameFromOpds)) {
          return;
        }

        booksByNameFromOpds.forEach((booksItem) => {
          expect(booksItem.author).to.satisfy(
            (item: SearchBooksByNameOpdsResult['author']) => item.every(
              (authorItem) => isString(authorItem.name) && isString(authorItem.uri),
            ),
          );
          expect(booksItem.title).to.satisfy((item: SearchBooksByNameOpdsResult['title']) => isString(item));
          expect(booksItem.updated).to.satisfy((item: SearchBooksByNameOpdsResult['updated']) => isString(item));
          expect(booksItem.categories).to.satisfy((item: SearchBooksByNameOpdsResult['categories']) => item.every(
            (categoriesItem) => isString(categoriesItem),
          ));
          expect(booksItem.cover).to.satisfy(
            (item: SearchBooksByNameOpdsResult['cover']) => isNil(item) || isString(item),
          );
          expect(booksItem.downloads).to.satisfy(
            (item: SearchBooksByNameOpdsResult['downloads']) => item.every(
              (downloadItems) => isString(downloadItems.link) && isString(downloadItems.type),
            ),
          );
          expect(booksItem.description).to.satisfy(
            (item: SearchBooksByNameOpdsResult['description']) => isString(item),
          );
        });
      });

      it('books parsed by name from opds should be undefined', async () => {
        const name = 'undLas,nm412-e32uj';
        const booksByNameFromOpds = await flibustaApi.getBooksByNameFromOpds(name);

        expect(booksByNameFromOpds).to.be.equal(undefined);
      });
    });

    describe('getBooksByNameFromOpdsPaginated()', () => {
      it('should return correct paginated books parsed by name from opds', async () => {
        const name = 'Шерлок';
        const booksByNameFromOpdsPaginated = await flibustaApi.getBooksByNameFromOpdsPaginated(name);

        if (isNil(booksByNameFromOpdsPaginated)) {
          return;
        }

        booksByNameFromOpdsPaginated.items.forEach((booksItem) => {
          expect(booksItem.author).to.satisfy(
            (item: SearchBooksByNameOpdsResult['author']) => item.every(
              (authorItem) => isString(authorItem.name) && isString(authorItem.uri),
            ),
          );
          expect(booksItem.title).to.satisfy((item: SearchBooksByNameOpdsResult['title']) => isString(item));
          expect(booksItem.updated).to.satisfy((item: SearchBooksByNameOpdsResult['updated']) => isString(item));
          expect(booksItem.categories).to.satisfy((item: SearchBooksByNameOpdsResult['categories']) => item.every(
            (categoriesItem) => isString(categoriesItem),
          ));
          expect(booksItem.cover).to.satisfy(
            (item: SearchBooksByNameOpdsResult['cover']) => isNil(item) || isString(item),
          );
          expect(booksItem.downloads).to.satisfy(
            (item: SearchBooksByNameOpdsResult['downloads']) => item.every(
              (downloadItems) => isString(downloadItems.link) && isString(downloadItems.type),
            ),
          );
          expect(booksItem.description).to.satisfy((item: SearchBooksByNameOpdsResult['description']) => isString(item));
        });

        expect(booksByNameFromOpdsPaginated.hasNextPage).to.be.equal(true);
        expect(booksByNameFromOpdsPaginated.hasPreviousPage).to.be.equal(false);
        expect(booksByNameFromOpdsPaginated.totalPages).to.satisfy(
          (item: PaginatedSearchResult<Array<SearchBooksByNameOpdsResult>>['totalPages']) => isNumber(item),
        );
        expect(booksByNameFromOpdsPaginated.totalCountItems).to.satisfy(
          (
            item: PaginatedSearchResult<Array<SearchBooksByNameOpdsResult>>['totalCountItems'],
          ) => isNil(item) || isNumber(item),
        );
        expect(booksByNameFromOpdsPaginated.currentPage).to.satisfy(
          (item: PaginatedSearchResult<Array<SearchBooksByNameOpdsResult>>['currentPage']) => isNumber(item),
        );
      });
    });
  });

  describe('getBooksBySeries', () => {
    describe('getBooksBySeries()', async () => {
      it('should return books by series', async () => {
        const name = 'Ведьмак. Последнее желание';
        const booksSeriesResultList = await flibustaApi.getBooksBySeries(name);

        return expect(booksSeriesResultList).to.be.deep.equal([{
          books: 5,
          id: 49_672,
          name,
        }]);
      });
    });

    describe('getBooksBySeriesPaginated()', async () => {
      it('should return paginated books by series', async () => {
        const name = 'Ведьмак. Последнее желание';
        const booksSeriesResultList = await flibustaApi.getBooksBySeriesPaginated(name);

        return expect(booksSeriesResultList).to.be.deep.equal({
          items: [{
            books: 5,
            id: 49_672,
            name,
          }],
          currentPage: 0,
          totalCountItems: 1,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        });
      });
    });
  });

  describe('getGenres', () => {
    describe('getGenres()', async () => {
      it('should return genres', async () => {
        const name = 'Роман';
        const genresResultList = await flibustaApi.getGenres(name);

        if (isNil(genresResultList)) {
          return;
        }

        genresResultList.forEach((genre) => {
          expect(genre.name).to.satisfy(
              (item: Genres['name']) => isString(item),
          );
          expect(genre.id).to.satisfy(
              (item: Genres['id']) => isString(item),
          );
        });
      });

      it('should return empty genres', async () => {
        const name = 'undefined';
        const genresResultList = await flibustaApi.getGenres(name);

        expect(genresResultList).to.be.deep.equal([]);
      });
    });

    describe('getGenresPaginated()', async () => {
      it('should return paginated books series', async () => {
        const name = 'Роман';
        const genresResultList = await flibustaApi.getGenresPaginated(name);

        if (isNil(genresResultList)) {
          return;
        }

        genresResultList.items.forEach((genre) => {
          expect(genre.name).to.satisfy(
              (item: Genres['name']) => isString(item),
          );
          expect(genre.id).to.satisfy(
              (item: Genres['id']) => isString(item),
          );
        });
        expect(genresResultList.currentPage).to.be.equal(0)
        expect(genresResultList.totalCountItems).to.be.equal(12)
        expect(genresResultList.totalPages).to.be.equal(1)
        expect(genresResultList.hasPreviousPage).to.be.equal(false)
        expect(genresResultList.hasNextPage).to.be.equal(false)
      });

      it('should return paginated books series empty', async () => {
        const name = 'Р$ом@ан5';
        const genresResultList = await flibustaApi.getGenresPaginated(name);

        expect(genresResultList).to.be.deep.equal({
          items: [],
          currentPage: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCountItems: undefined,
          totalPages: 1,
        });
      });
    });
  });
});