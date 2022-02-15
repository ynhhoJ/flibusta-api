# Flibusta API

###  Unofficial Flibusta API based on website search engine.

<p align="center">
    <img src="images/bluebreeze_logo.png">
</p>

<hr/>

#### getBooksByName(name, page?, limit?)
Gets books by name from Flibusta's site.

* `name` - The name of searched books.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `50`.

##### Example
`getBooksByName('Шерлок', 0, 1)`
##### Response
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
<hr/>

#### getBooksBySeries(name, page?, limit?)
Gets books by name from Flibusta's site.

* `name` - The name of searched books series.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `50`.

##### Example
`getBooksBySeries('Шерлок', 0, 1)`
##### Response
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
<hr/>

#### getAuthors(name, page?, limit?)
Gets authors by name from Flibusta's site.

* `name` - The name of searched author.
* `page?` - Optional to get books by name for page. By default `0`.
* `limit?` - Optional. Limit rows count in `items`. By default `50`.

##### Example
`getBooksBySeries('конан', 0, 1)`
##### Response
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