import FlibustaAPI from '../src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, bookName, pageNumber, itemsLimit] = process.argv;
  const flibustaApi = new FlibustaAPI('http://flibusta.is/');

  const itemsLimitAsInt = Number.parseInt(itemsLimit ?? 50, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber ?? 0, 10);

  const searchBooksByNamePaginatedResult = await flibustaApi.getBooksByNamePaginated(
    bookName,
    pageNumberAsInt,
    itemsLimitAsInt,
  );

  console.log(JSON.stringify(searchBooksByNamePaginatedResult, undefined, 2));
})();
