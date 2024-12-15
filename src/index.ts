import { ListNode } from './ListNode';

type DataType<T> = {
  persistent: boolean;
  value: T;
};

/**
 * A generic cache class that automatically removes the least-recently-used items.
 *
 * This class provides a caching solution where the least recently used items are evicted
 * when the cache reaches its capacity. It supports operations to add, retrieve, and remove
 * items, as well as to mark items as persistent to prevent their eviction. The cache maintains
 * the order of usage, allowing efficient access and updates.
 *
 * @template T - The type of the keys and values stored in the cache.
 *
 * @constructor
 * @param {number} capacity - Defines the maximum number of items that can be in the cache. Must be a positive integer.
 *
 * @throws Will throw an error if the capacity is not a positive integer.
 */
export default class Dadado<T> {
  capacity: number;
  private cache: Map<T, DataType<T>>;
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private nodeMap: Map<T, ListNode<T>>;

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
    this.nodeMap = new Map();
  }

  private moveToHead(node: ListNode<T>) {
    if (node === this.head) return;

    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }

    if (node === this.tail) {
      this.tail = node.prev;
    }

    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    if (!this.tail) this.tail = node;
  }

  private removeTail() {
    if (!this.tail) {
      return;
    }

    const key = this.tail.key;
    this.cache.delete(key);
    this.nodeMap.delete(key);

    if (this.tail.prev) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      this.head = this.tail = null;
    }
  }

  /*
   * Returns the cache size.
   *
   * @returns {number}
   */
  size() {
    return this.cache.size;
  }

  /*
   * Removes all elements from the cache.
   *
   * @returns {void}
   */
  clear() {
    this.cache.clear();
  }

  /*
   * Checks if the given key exist within the cache.
   *
   * @param {T} key - The cache key
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
   * @param {T} key - The cache key
   * @param {T} value - The value associated with the key
   * @returns {boolean}
   */
  setItem(key: T, value: T) {
    if (this.cache.has(key)) {
      const data = this.cache.get(key) as DataType<T>;
      data.value = value;
      this.moveToHead(this.nodeMap.get(key) as ListNode<T>);
    } else {
      const newNode = new ListNode(key);
      const data: DataType<T> = { value, persistent: false };

      this.cache.set(key, data);
      this.nodeMap.set(key, newNode);
      this.moveToHead(newNode);

      while (this.cache.size > this.capacity) {
        const tailKey = this.tail?.key as T;
        const tailData = this.cache.get(tailKey) as DataType<T>;

        if (!tailData.persistent) {
          this.removeTail();
        } else {
          this.moveToHead(this.tail as ListNode<T>);
        }
      }
    }

    return this.cache.has(key);
  }

  /*
   * Retrieves the value associated with the given key.
   * If the key is not in the cache, it returns `undefined`.
   *
   * @param {T} key - The cache key
   * @returns {T}
   */
  getItem(key: T) {
    if (!this.cache.has(key)) {
      return;
    }

    const data = this.cache.get(key) as DataType<T>;
    this.moveToHead(this.nodeMap.get(key) as ListNode<T>);

    return data.value;
  }

  /*
   * Deletes item and returns true if the item existed in the storage.
   * Returns false if the element doesn't exist.
   *
   * @param {T} key - The cache key
   * @returns {boolean}
   */
  removeItem(key: T) {
    const node = this.nodeMap.get(key);

    if (node) {
      if (node.prev) {
        node.prev.next = node.next;
      }

      if (node.next) {
        node.next.prev = node.prev;
      }

      if (node === this.head) {
        this.head = node.next;
      }

      if (node === this.tail) {
        this.tail = node.prev;
      }

      this.nodeMap.delete(key);
    }

    return this.cache.delete(key);
  }

  /*
   * Makes item persistent, i.e the item can no longer be automatically evicted.
   *
   * @param {T} key - The cache key
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
   * @param {T} key - The cache key
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
   * @param {T} key - The cache key
   * @returns {void}
   */
  togglePersistent(key: T) {
    if (this.cache.has(key)) {
      const data = this.cache.get(key) as DataType<T>;
      data.persistent = !data.persistent;
    }
  }

  /*
   * Returns an Array based in the current cache with each key-value pair sorted by least-recently-used.
   *
   * @returns {T[][]}
   */
  toArray() {
    const result: T[][] = [];
    let current = this.tail;

    while (current) {
      const data = this.cache.get(current.key) as DataType<T>;
      result.push([current.key, data.value]);
      current = current.prev;
    }

    return result;
  }
}
