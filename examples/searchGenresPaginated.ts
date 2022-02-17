import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, genreName, pageNumber, itemsLimit] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const itemsLimitAsInt = Number.parseInt(itemsLimit ?? 50, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber ?? 0, 10);

  const searchGenresPaginatedResult = await flibustaApi.getGenresPaginated(
    genreName,
    pageNumberAsInt,
    itemsLimitAsInt,
  );

  console.log(JSON.stringify(searchGenresPaginatedResult, undefined, 2));
})();
