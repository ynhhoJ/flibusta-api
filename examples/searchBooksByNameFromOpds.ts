import FlibustaAPI from '../src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, authorName] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const searchBooksByNameResult = await flibustaApi.getBooksByNameFromOpds(authorName);

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
