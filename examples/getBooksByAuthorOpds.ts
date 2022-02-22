import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, authorIdString] = process.argv;
  const flibustaApi = new FlibustaAPI();
  const authorId = Number.parseInt(authorIdString, 10);

  const searchBooksByNameResult = await flibustaApi.getBooksByAuthorOpds(authorId);

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
