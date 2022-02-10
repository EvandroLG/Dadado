# TheStorage &middot; [![build](https://img.shields.io/circleci/build/github/EvandroLG/TheStorage/main.svg?sanitize=true)](https://app.circleci.com/pipelines/github/EvandroLG/TheStorage?branch=main) [![npm](https://img.shields.io/npm/v/the-storage.svg?style=flat)](https://www.npmjs.com/package/the-storage) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

A storage that automatically removes the least-recently-used items.

## Features
- Fast LRU implementation
- Gzipped version has less than 400 bytes
- Minimalist API
- Support to both Node and Browser
- Supports to Types
- Zero-dependency

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

`TheStorage` is a cache class which is designed to keep storing just the most recently used items.
To ensure it, the class receives a `capacity`, that will be used to discard the least recently used items when the capacity is reached.

```js
import TheStorage from 'the-storage';

// `capacity` is required and it must to be a posite integer
const storage = new TheStorage(3);

storage.setData('key1', 'value1');
storage.setData('key2', 'value2');
storage.getData('key1'); // 'value1'
storage.setData('key3', 'value3');

// At this point, the item associeted with `key2` will be evicted.
// It happens because the capacity was reached and `key1` was used before `key2`.
storage.setData('key4', 'value4');

storage.size(); // 3
storage.contains('key2'); // false
storage.contains('key1'); // true
```

## Methods

***`contains(key: any): boolean`***<br>
Checks if the given key exist within the storage

***`setData(key: any, value: any): boolean`***<br>
Adds the key-value pair to the cache if the key is not in the cache yet.
Otherwise, if the key exists, updates the value of the key.
In case the current number of keys exceeds the `capacity`, then it evicts the least recently used key that is not marked as persistent.

***`getData(key: any): any`***<br>
Retrieves the value associeted with the given key if it exists in the cache.
If the key is not in the cache, it returns `undefined`.

***`removeData(key: any): boolean`***<br>
Deletes item and returns `true` if the item existed in the storage - persistent will be removed as well.
Returns `false` if the element doesn't exist in the storage.

***`setPersistent(key: any): void`***<br>
Makes item persistent, i.e the item can no longer be automatically evicted.
However, the item still will be removed when invoking `removeData` or `clear`.

```js
import TheStorage from 'the-storage';

const storage = new TheStorage(3);
storage.setData('key1', 'value1');
storage.setPersistent('key1');
storage.setData('key2', 'value2');
storage.setData('key3', 'value3');

// At this point the item associeted with `key2` will be evicted
// since the `key1` is marked as `persistent` and can not be evicted.
storage.setData('key4', 'value4');

storage.contains('key1'); // true
storage.contains('key2'); // false
```

***`removePersistent(key: any): void`***<br>
Makes item no longer a persistent item.

***`togglePersistent(key: any): void`***<br>
Makes item persistent if it was not yet, or otherwise undo the persistent flag.

***`size(): number`***<br>
Returns the storage size.

***`clear(): void`***<br>
Remove all items - even the persistent ones - from the cache.

## LICENSE
[MIT](./LICENSE)
