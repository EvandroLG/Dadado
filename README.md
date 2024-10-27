# Dadado &middot; [![build](https://img.shields.io/circleci/build/github/EvandroLG/TheStorage/main.svg?sanitize=true)](https://app.circleci.com/pipelines/github/EvandroLG/TheStorage?branch=main) [![npm](https://img.shields.io/npm/v/the-storage.svg?style=flat)](https://www.npmjs.com/package/the-storage) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

A cache that automatically removes the least-recently-used items.

## Features

- Fast LRU implementation
- Gzipped version has less than 400 bytes
- Minimalist API
- Supports to both Node and Browser
- Supports to Types
- Zero-dependency

## Installation

To install `dadado`, execute:

```sh
npm install dadado
```

or

```sh
yarn add dadado
```

## Quickstart

`Dadado` is a cache class which is designed to keep storing just the most recently used items.
To ensure it, the class receives a `capacity`, that will be used to discard the least recently used items when the capacity is reached.

```js
import Dadado from 'dadado';

// `capacity` is required and it must to be a positive integer
const cache = new Dadado(3);

cache.setItem('key1', 'value1');
cache.setItem('key2', 'value2');
cache.getItem('key1'); // 'value1'
cache.setItem('key3', 'value3');

// At this point, the item associeted with `key2` will be evicted.
// It happens because the capacity was reached and `key1` was used before `key2`.
cache.setItem('key4', 'value4');

cache.size(); // 3
cache.contains('key2'); // false
cache.contains('key1'); // true
```

## Methods

***`contains(key: any): boolean`***

Checks if the given key exist within the cache

***`setItem(key: any, value: any): boolean`***

Adds the key-value pair to the cache if the key is not in the cache yet.
Otherwise, if the key exists, updates the value of the key.
In case the current number of keys exceeds the `capacity`, then it evicts the least recently used key that is not marked as persistent.

***`getItem(key: any): any`***

Retrieves the value associeted with the given key if it exists in the cache.
If the key is not in the cache, it returns `undefined`.

***`removeItem(key: any): boolean`***

Deletes item and returns `true` if the item existed in the cache - persistent will be removed as well.
Returns `false` if the element doesn't exist in the cache.

***`setPersistent(key: any): void`***

Makes item persistent, i.e the item can no longer be automatically evicted.
However, the item still will be removed when invoking `removeItem` or `clear`.

```js
import Dadado from 'dadado';

const cache = new Dadado(3);
cache.setItem('key1', 'value1');
cache.setPersistent('key1');
cache.setItem('key2', 'value2');
cache.setItem('key3', 'value3');

// At this point the item associeted with `key2` will be evicted
// since the `key1` is marked as `persistent` and can not be evicted.
cache.setItem('key4', 'value4');

cache.contains('key1'); // true
cache.contains('key2'); // false
```

***`removePersistent(key: any): void`***

Makes item no longer a persistent item.

***`togglePersistent(key: any): void`***

Makes item persistent if it was not yet, or otherwise undo the persistent flag.

***`toArray(): T[][]`***

Returns an Array based in the current cache with each key-value pair sorted by least-recently-used.

***`size(): number`***

Returns the cache size.

***`clear(): void`***

Remove all items - even the persistent ones - from the cache.

## LICENSE

[MIT](./LICENSE)
