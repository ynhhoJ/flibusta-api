import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, genreName] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const searchGenreResult = await flibustaApi.getGenres(genreName);

  console.log(JSON.stringify(searchGenreResult, undefined, 2));
})();
