import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, seriesName] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const searchBooksBySeriesResult = await flibustaApi.getBooksBySeries(seriesName);

  console.log(JSON.stringify(searchBooksBySeriesResult, undefined, 2));
})();
