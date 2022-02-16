import FlibustaAPI from '../src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, authorName] = process.argv;
  const flibustaApi = new FlibustaAPI('http://flibusta.is/');

  const searchBooksBySeriesResult = await flibustaApi.getBooksBySeries(authorName);

  console.log(JSON.stringify(searchBooksBySeriesResult, undefined, 2));
})();
