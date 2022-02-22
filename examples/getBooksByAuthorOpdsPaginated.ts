import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, authorIdString, pageNumber, itemsLimit] = process.argv;
  const flibustaApi = new FlibustaAPI();
  const authorId = Number.parseInt(authorIdString, 10);

  const itemsLimitAsInt = Number.parseInt(itemsLimit ?? 50, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber ?? 0, 10);
  const searchBooksByNameResult = await flibustaApi.getBooksByAuthorOpdsPaginated(
    authorId,
    pageNumberAsInt,
    itemsLimitAsInt,
  );

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
