# TheStorage &middot; [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

A storage that automatically removes the least-recently-used items.

## Installation

To install `the-storage`, execute:

```sh
$ npm install the-storage
```

or

```sh
$ yarn add the-storage
```

## Quickstart

`TheStorage` is a cache class which is designed to keep storing just the most-recently-used items. To ensure it, the class receives a `capacity`, that will be used to discard the least recently used items when the capacity is reached.

```js
import TheStorage from 'the-storage';

// `capacity` is required
const storage = new TheStorage(3);

storage.setData('key1', 'value1');
storage.setData('key2', 'value2');
storage.getData('key1'); // 'value1'
storage.setData('key3', 'value3');

// At this point, the item associeted with `key2` will be evicted
// It happens because the capacity was reached and `key1` was used before `key2`
storage.setData('key4', 'value4');

storage.size(); // 3
storage.contains('key2'); // false
storage.contains('key1'); // true
```
