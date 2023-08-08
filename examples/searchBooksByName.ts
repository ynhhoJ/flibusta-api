import FlibustaAPI from '@src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, bookName] = process.argv;
  const flibustaApi = new FlibustaAPI();

  const searchBooksByNameResult = await flibustaApi.getBooksByName(bookName);

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
