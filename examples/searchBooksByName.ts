import { searchBooksByName } from '../src';

(async () => {
  const bookName = process.argv[2];
  const itemsLimit = process.argv[3];
  const searchBooksByNameResult = await searchBooksByName(bookName, Number.parseInt(itemsLimit, 10));

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
