import { searchBooksByName } from '../src';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, bookName, itemsLimit, pageNumber] = process.argv;

  const itemsLimitAsInt = Number.parseInt(itemsLimit, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber ?? 0, 10);

  const searchBooksByNameResult = await searchBooksByName(bookName, itemsLimitAsInt, pageNumberAsInt);

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
