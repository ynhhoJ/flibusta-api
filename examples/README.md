### Search book by name
Commands:
```
yarn ts-node ./examples/searchBooksByName.ts [book name] [items to show]
```

## Examples
```
yarn ts-node ./examples/searchBooksByName.ts Шерлок 2 0
```
or
```angular2html
yarn search-book-by-name Шерлок 2 0
```
Result:
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
    },
    {
      "book": {
        "id": 402940,
        "name": "Шерлок Холмс против графа Дракулы (сборник) [= Шерлок Холмс и дело о папирусе (сборник)]"
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
  "totalCountItems": 227,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```
