# Flibusta API

###  Unofficial Flibusta API based on website search engine.

<p align="center">
    <img src="images/bluebreeze_logo.png">
</p>

<hr/>

## NPM
Flibsta API is available as a [npm packages](https://www.npmjs.com/package/flibusta)

Use `yarn add flibusta` or `npm install flibusta`

## Examples
1. Clone repository
2. Use `yarn install` or `npm install`
3. Use commands:

<details>
  <summary>For simple search</summary>

```sh
yarn example-search-book-by-name [book name]
```

```sh
yarn example-search-authors [author name]
```

```sh
yarn example-search-book-by-series [series name]
```
</details>

<details>
  <summary>For paginated search</summary>

```sh
yarn example-search-book-by-name-paginated [book name] [page number] [items limit count]
```

```sh
yarn example-search-authors-paginated [author name] [page number] [items limit count]
```

```sh
yarn example-search-book-by-series-paginated [series name] [page number] [items limit count]
```
</details>

<hr />

## API

### getBooksByAuthorOpds(id)
* `id` - The id of author

##### Example
`getBooksByAuthorOpds(6116)`

##### Response
<details>
  <summary>Response</summary>

```json
[
  {
    "author": [
      {
        "name": "Конан Дойль Артур",
        "uri": "/a/6116"
      }
    ],
    "title": "«Глория Скотт»",
    "updated": "2022-02-22T08:35:39+01:00",
    "categories": [
      "Классический детектив"
    ],
    "cover": "/i/0/214600/cover.jpg",
    "downloads": [
      {
        "link": "/b/214600/fb2",
        "type": "application/fb2+zip"
      },
      {
        "link": "/b/214600/html",
        "type": "application/html+zip"
      },
      {
        "link": "/b/214600/txt",
        "type": "application/txt+zip"
      },
      {
        "link": "/b/214600/rtf",
        "type": "application/rtf+zip"
      },
      {
        "link": "/b/214600/mobi",
        "type": "application/x-mobipocket-ebook"
      }
    ],
    "description": "<p class=book>Куда исчез фаворит предстоящих скачек жеребец Серебряный и кто убил его тренера? Кто пытается разлучить счастливых супругов Мунро и что за ужасное лицо появляется в окне соседнего дома? В какую аферу оказался вовлечен незадачливый биржевой маклер? И что делали таинственные гости из России в комнате пациента доктора Тревельяна? На эти вопросы берется ответить знаменитый Шерлок Холмс... </p>\n   <br/>Перевод: Любимова Галина<br/>Формат: fb2<br/>Язык: ru<br/>Размер: 62 Kb<br/>Скачиваний: 8387<br/>Серия: Рассказы о Шерлоке Холмсе — 2. Записки о Шерлоке Холмсе #4<br/>"
  },
  ...
]
```
</details>

### getBooksByAuthorOpdsPaginated(id)
* `id` - The id of author
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `20`.

##### Example
`getBooksByAuthorOpdsPaginated(6116)`

##### Response
<details>
  <summary>Response</summary>

```json
{
  "items": [
    {
      "author": [
        {
          "name": "Конан Дойль Артур",
          "uri": "/a/6116"
        }
      ],
      "title": "«Глория Скотт»",
      "updated": "2022-02-22T08:35:39+01:00",
      "categories": [
        "Классический детектив"
      ],
      "cover": "/i/0/214600/cover.jpg",
      "downloads": [
        {
          "link": "/b/214600/fb2",
          "type": "application/fb2+zip"
        },
        {
          "link": "/b/214600/html",
          "type": "application/html+zip"
        },
        {
          "link": "/b/214600/txt",
          "type": "application/txt+zip"
        },
        {
          "link": "/b/214600/rtf",
          "type": "application/rtf+zip"
        },
        {
          "link": "/b/214600/mobi",
          "type": "application/x-mobipocket-ebook"
        }
      ],
      "description": "<p class=book>Куда исчез фаворит предстоящих скачек жеребец Серебряный и кто убил его тренера? Кто пытается разлучить счастливых супругов Мунро и что за ужасное лицо появляется в окне соседнего дома? В какую аферу оказался вовлечен незадачливый биржевой маклер? И что делали таинственные гости из России в комнате пациента доктора Тревельяна? На эти вопросы берется ответить знаменитый Шерлок Холмс... </p>\n   <br/>Перевод: Любимова Галина<br/>Формат: fb2<br/>Язык: ru<br/>Размер: 62 Kb<br/>Скачиваний: 8387<br/>Серия: Рассказы о Шерлоке Холмсе — 2. Записки о Шерлоке Холмсе #4<br/>"
    },
    ...
  ],
  "currentPage": 0,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```
</details>

### getBooksByName(name)
* `name` - The name of searched books.

##### Example
`getBooksByName('Шерлок')`

##### Response
<details>
  <summary>Response</summary>

```json
[
  {
    "book": {
      "id": 402475,
      "name": "Шерлок Холмс и дело о папирусе (сборник) [= Шерлок Холмс против графа Дракулы (сборник)]"
    },
    "authors": [
      {
        "id": 33441,
        "name": "Дэвид Стюарт Дэвис"
      }
    ]
  },
  ...
]
```
</details>

<hr />

### getBooksByNameFromOpds(name)
* `name` - The name of searched books.

##### Example
`getBooksByNameFromOpds('Шерлок')`

##### Response
<details>
  <summary>Response</summary>

```json
[
  {
    "author": [
      {
        "name": "Талышханов Адиль",
        "uri": "/a/31745"
      }
    ],
    "title": "`Путь бесхвостой птички` или Иероглифика по методу Шерлока Холмса",
    "updated": "2022-02-18T07:21:09+01:00",
    "categories": [
      "Языкознание, иностранные языки"
    ],
    "downloads": [
      {
        "link": "/b/112478/download",
        "type": "application/pdf+rar"
      }
    ],
    "description": "Формат: pdf<br/>Язык: ru<br/>Размер: 564 Kb<br/>Скачиваний: 2632<br/>"
  },
  ...
]
```
</details>

<hr/>

### getBooksByNameFromOpdsPaginated(name, page?, limit?)
* `name` - The name of searched books.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `20`.

##### Example
`getBooksByNameFromOpdsPaginated('Шерлок', 0, 1)`

##### Response
<details>
  <summary>Response</summary>

```json
{
  "items": [
    {
      "author": [
        {
          "name": "Талышханов Адиль",
          "uri": "/a/31745"
        }
      ],
      "title": "`Путь бесхвостой птички` или Иероглифика по методу Шерлока Холмса",
      "updated": "2022-02-18T18:01:50+01:00",
      "categories": [
        "Языкознание, иностранные языки"
      ],
      "downloads": [
        {
          "link": "/b/112478/download",
          "type": "application/pdf+rar"
        }
      ],
      "description": "Формат: pdf<br/>Язык: ru<br/>Размер: 564 Kb<br/>Скачиваний: 2632<br/>"
    }
  ],
  "currentPage": 0,
  "totalCountItems": 228,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "totalPages": 11
}
```
</details>

<hr/>

### getBooksByNamePaginated(name, page?, limit?)
* `name` - The name of searched books.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `50`.

##### Example
`getBooksByNamePaginated('Шерлок', 0, 1)`

##### Response
<details>
  <summary>Response</summary>

```json
{
  "items": [
    {
      "book": {
        "id": 402475,
        "name": "Шерлок Холмс и дело о папирусе (сборник) [= Шерлок Холмс против графа Дракулы (сборник)]"
      },
      "authors": [
        {
          "id": 33441,
          "name": "Дэвид Стюарт Дэвис"
        }
      ]
    }
  ],
  "currentPage": 0,
  "totalCountItems": 228,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```
</details>

<hr/>

### getBooksBySeries(name, page?, limit?)
* `name` - The name of searched books series.

##### Example
`getBooksBySeries('Шерлок')`

##### Response
<details>
  <summary>Response</summary>

```json
[
  {
    "id": 242,
    "name": "Шерлок Холмс с иллюстрациями",
    "books": 11
  },
  {
    "id": 30097,
    "name": "Шерлок Холмс. Игра продолжается",
    "books": 61
  },
  {
    "id": 4154,
    "name": "Шерлок Холмс. Новые приключения",
    "books": 8
  },
  ...
]
```
</details>

<hr/>

### getBooksBySeriesPaginated(name, page?, limit?)
* `name` - The name of searched books series.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `50`.

##### Example
`getBooksBySeriesPaginated('Шерлок', 0, 1)`

##### Response
<details>
  <summary>Response</summary>

```json
{
  "items": [
    {
      "id": 242,
      "name": "Шерлок Холмс с иллюстрациями",
      "books": 11
    }
  ],
  "currentPage": 0,
  "totalCountItems": 39,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```
</details>

<hr/>

### getAuthors(name)
* `name` - The name of searched author.

##### Example
`getAuthors('конан')`

##### Response
<details>
    <summary>Response</summary>

```json
[
  {
    "id": 6116,
    "name": "Артур Конан Дойль",
    "books": 584,
    "translations": -1
  },
  {
    "id": 17933,
    "name": "Адриан Конан Дойл",
    "books": 37,
    "translations": -1
  },
  {
    "id": 147059,
    "name": "Андреас Конанос (архимандрит)",
    "books": 19,
    "translations": -1
  },
  {
    "id": 6118,
    "name": "Сьюзан Конант",
    "books": 4,
    "translations": -1
  },
  {
    "id": 58754,
    "name": "Александр Конаныхин",
    "books": -1,
    "translations": 1
  }
]
```
</details>

<hr />

### getAuthorsPaginated(name, page?, limit?)
* `name` - The name of searched author.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `50`.

##### Example
`getAuthorsPaginated('конан', 0, 1)`

##### Response
<details>
    <summary>Response</summary>

```json
{
  "items": [
    {
      "id": 6116,
      "name": "Артур Конан Дойль",
      "books": 584,
      "translations": -1
    }
  ],
  "currentPage": 0,
  "totalCountItems": 5,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```
</details>

<hr />

### getCoverByBookId(id)
* `id` - The book id

##### Example
`getCoverByBookId(226302)`

##### Response
<details>
    <summary>Response</summary>

```
File blob
```
</details>

<hr />

### getGenres(name)
* `name` - The name of searched genre.

##### Example
`getGenres('роман')`

##### Response
<details>
    <summary>Response</summary>

```json
[
  {
    "id": "det_irony",
    "name": "Иронический детектив, дамский детективный роман"
  },
  {
    "id": "love_contemporary",
    "name": "Современные любовные романы"
  },
  {
    "id": "love_history",
    "name": "Исторические любовные романы"
  },
  {
    "id": "love_detective",
    "name": "Остросюжетные любовные романы"
  },
  {
    "id": "love_short",
    "name": "Короткие любовные романы"
  },
  {
    "id": "love",
    "name": "Любовные романы"
  },
  {
    "id": "love_sf",
    "name": "Любовное фэнтези, любовно-фантастические романы "
  },
  {
    "id": "tale_chivalry",
    "name": "Рыцарский роман"
  },
  {
    "id": "adv_story",
    "name": "Авантюрный роман"
  },
  {
    "id": "gothic_novel",
    "name": "Готический роман"
  },
  {
    "id": "great_story",
    "name": "Роман, повесть"
  },
  {
    "id": "astrology",
    "name": "Астрология и хиромантия"
  }
]
```
</details>

<hr />

### getGenresPaginated(name, page?, limit?)
* `name` - The name of searched genre.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `50`.

##### Example
`getGenresPaginated('роман', 0, 2)`

##### Response
<details>
    <summary>Response</summary>

```json
{
  "items": [
    {
      "id": "det_irony",
      "name": "Иронический детектив, дамский детективный роман"
    },
    {
      "id": "love_contemporary",
      "name": "Современные любовные романы"
    }
  ],
  "currentPage": 0,
  "totalCountItems": 12,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```
</details>

## Onion Support

Thanks [antis11](https://github.com/antiss11) for an example

<details>
    <summary>Example</summary>

```js
import { SocksProxyAgent } from 'socks-proxy-agent';

import FlibustaAPI from 'flibusta';

(async () => {
  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  const [/* original value */, /* path to the file */, authorName] = process.argv;

  const flibustaApi = new FlibustaAPI('http://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion', {
    httpAgent: new SocksProxyAgent('socks5h://127.0.0.1:9050'),
  });

  const searchAuthorsResult = await flibustaApi.getAuthors(authorName);
  
  console.log(JSON.stringify(searchAuthorsResult, undefined, 2));
})();
```
</details>
