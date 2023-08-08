import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, authorName, pageNumber, itemsLimit] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const itemsLimitAsInt = Number.parseInt(itemsLimit ?? 50, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber ?? 0, 10);

  const searchAuthorsPaginatedResult = await flibustaApi.getAuthorsPaginated(
    authorName,
    pageNumberAsInt,
    itemsLimitAsInt,
  );

  console.log(JSON.stringify(searchAuthorsPaginatedResult, undefined, 2));
})();
