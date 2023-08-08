import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, bookName, pageNumber, itemsLimit] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const itemsLimitAsInt = Number.parseInt(itemsLimit ?? 20, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber ?? 0, 10);

  const searchBooksByNameResult = await flibustaApi.getBooksByNameFromOpdsPaginated(
    bookName,
    pageNumberAsInt,
    itemsLimitAsInt,
  );

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
