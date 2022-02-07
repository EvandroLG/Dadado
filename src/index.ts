export default class LRUStorage {
  capacity: number;
  private cache: any;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  size() {
    return this.cache.size;
  }

  setData(key: string, value: any) {
    if (this.cache.has(key)) {
      const data = this.cache.get(key);
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
        const item = this.cache.get(key);

        if (!item.persistent) {
          wasDeleted = true;
          this.cache.delete(key);
        }
      }
    }

    if (!this.cache.has(key)) {
      return false;
    }

    return true;
  }

  getData(key: string) {
    if (!this.cache.has(key)) {
      return;
    }

    const data = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, data);

    return data.value;
  }

  removeData(key: string) {
    return this.cache.delete(key);
  }

  setPersistent(key: string) {
    if (this.cache.has(key)) {
      this.cache.get(key).persistent = true;
    }
  }

  removePersistent(key: string) {
    if (this.cache.has(key)) {
      this.cache.get(key).persistent = false;
    }
  }

  togglePersistent(key: string) {
    if (this.cache.has(key)) {
      this.cache.get(key).persistent = !this.cache.get(key).persistent;
    }
  }
}
