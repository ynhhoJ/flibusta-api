# Flibusta API

###  Unofficial Flibusta API based on website search engine.

<p align="center">
    <img src="images/bluebreeze_logo.png">
</p>

<hr/>

##Examples
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
