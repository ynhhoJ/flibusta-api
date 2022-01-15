import { searchBooksBySeries } from '../src';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, bookName, itemsLimit, pageNumber] = process.argv;

  const itemsLimitAsInt = Number.parseInt(itemsLimit, 10);
  const pageNumberAsInt = Number.parseInt(pageNumber, 10) ?? 0;

  const searchBooksByNameResult = await searchBooksBySeries(bookName, itemsLimitAsInt, pageNumberAsInt);

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
