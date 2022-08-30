import { SocksProxyAgent } from 'socks-proxy-agent';

import FlibustaAPI from '../src/index';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, authorName] = process.argv;

  const flibustaApi = new FlibustaAPI(undefined, {
    httpAgent: new SocksProxyAgent('socks5h://127.0.0.1:9050'),
  }, true);

  const searchBooksByNameResult = await flibustaApi.getBooksByName(authorName);

  console.log(JSON.stringify(searchBooksByNameResult, undefined, 2));
})();
