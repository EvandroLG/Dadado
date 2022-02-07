type DataType<T> = {
  persistent: boolean,
  value: T,
};

export default class LRUStorage<T> {
  capacity: number;
  private cache: Map<T, DataType<T>>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  size() {
    return this.cache.size;
  }

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

  getData(key: T) {
    if (!this.cache.has(key)) {
      return;
    }

    const data = this.cache.get(key) as DataType<T>;
    this.cache.delete(key);
    this.cache.set(key, data);

    return data.value;
  }

  removeData(key: T) {
    return this.cache.delete(key);
  }

  setPersistent(key: T) {
    if (this.cache.has(key)) {
      (this.cache.get(key) as DataType<T>).persistent = true;
    }
  }

  removePersistent(key: T) {
    if (this.cache.has(key)) {
      (this.cache.get(key) as DataType<T>).persistent = false;
    }
  }

  togglePersistent(key: T) {
    if (this.cache.has(key)) {
      const data = this.cache.get(key) as DataType<T>;
      data.persistent = !data.persistent;
    }
  }
}
