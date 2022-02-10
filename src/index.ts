type DataType<T> = {
  persistent: boolean,
  value: T,
};

export default class Storage<T> {
  capacity: number;
  private cache: Map<T, DataType<T>>;

  /*
   * @param {number} capacity - Defines the maximum of items that can be in the cache
  */
  constructor(capacity: number) {
    if (!Number.isInteger(capacity)) {
      throw Error('Expected an integer number');
    }

    if (Math.sign(capacity) <= 0) {
      throw Error('Expected a positive number greater or equal to 1');
    }

    this.capacity = capacity;
    this.cache = new Map();
  }

  /*
   * Returns the storage size.
   *
   * @returns {number}
  */
  size() {
    return this.cache.size;
  }

  /*
   * Removes all elements from the storage.
   *
   * @returns {void}
  */
  clear() {
    this.cache.clear();
  }

  /*
   * Checks if the given key exist within the storage.
   *
   * @param {T} key - The storage key
   * @returns {boolean}
  */
  contains(key: T) {
    return this.cache.has(key);
  }

  /*
   * Adds the key-value pair to the cache if the key is not in the cache yet.
   * Otherwise, if the key exists, updates the value of the key.
   * In case the current number of keys exceeds the `capacity`, then it evicts the least recently used key.
   *
   * @param {T} key - The storage key
   * @param {T} value - The value associated with the key
   * @returns {boolean}
  */
  setData(key: T, value: T) {
    if (this.cache.has(key)) {
      const data = this.cache.get(key) as DataType<T>;
      this.cache.delete(key);
      data.value = value;
      this.cache.set(key, data);
    } else {
      this.cache.set(key, {
        value,
        persistent: false
      });
    }

    const keys = Array.from(this.cache.keys());

    while (this.cache.size > this.capacity) {
      let wasDeleted = false;

      if (!this.cache.size) {
        return false;
      }

      while (!wasDeleted && this.cache.size) {
        const key = keys.shift();
        const item = this.cache.get(key as T) as DataType<T>;

        if (!item.persistent) {
          wasDeleted = true;
          this.cache.delete(key as T);
        }
      }
    }

    if (!this.cache.has(key)) {
      return false;
    }

    return true;
  }

  /*
   * Retrieves the value associated with the given key.
   * If the key is not in the cache, it returns `undefined`.
   *
   * @param {T} key - The storage key
   * @returns {T}
  */
  getData(key: T) {
    if (!this.cache.has(key)) {
      return;
    }

    const data = this.cache.get(key) as DataType<T>;
    this.cache.delete(key);
    this.cache.set(key, data);

    return data.value;
  }

  /*
   * Deletes item and returns true if the item existed in the storage.
   * Returns false if the element doesn't exist.
   *
   * @param {T} key - The storage key
   * @returns {boolean}
  */
  removeData(key: T) {
    return this.cache.delete(key);
  }

  /*
   * Makes item persistent, i.e the item can no longer be automatically evicted.
   *
   * @param {T} key - The storage key
   * @returns {void}
  */
  setPersistent(key: T) {
    if (this.cache.has(key)) {
      (this.cache.get(key) as DataType<T>).persistent = true;
    }
  }

  /*
   * Makes item no longer a persistent item if it was one.
   *
   * @param {T} key - The storage key
   * @returns {void}
  */
  removePersistent(key: T) {
    if (this.cache.has(key)) {
      (this.cache.get(key) as DataType<T>).persistent = false;
    }
  }

  /*
   * Makes item persistent if it was not yet, or otherwise undo the persistent flag.
   *
   * @param {T} key - The storage key
   * @returns {void}
  */
  togglePersistent(key: T) {
    if (this.cache.has(key)) {
      const data = this.cache.get(key) as DataType<T>;
      data.persistent = !data.persistent;
    }
  }
}
