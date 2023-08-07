import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, seriesName, pageNumber, itemsLimit] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const itemsLimitAsInt = Number.parseInt(itemsLimit ?? 50, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber ?? 0, 10);

  const searchBooksBySeriesPaginatedResult = await flibustaApi.getBooksBySeriesPaginated(
    seriesName,
    pageNumberAsInt,
    itemsLimitAsInt,
  );

  console.log(JSON.stringify(searchBooksBySeriesPaginatedResult, undefined, 2));
})();
