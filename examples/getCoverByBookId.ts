import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, bookIdString] = process.argv;
  const flibustaApi = new FlibustaAPI();
  const bookId = Number.parseInt(bookIdString, 10);

  const bookCoverResult = await flibustaApi.getCoverByBookId(bookId);

  console.log(JSON.stringify(bookCoverResult, undefined, 2));
})();
