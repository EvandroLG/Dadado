import Storage from '../src/';

describe('lru', () => {
  it('should be able to set the storage capacity', () => {
    const storage = new Storage(10);
    expect(storage.capacity).toBe(10);
  });

  it('should be able to set and get data', () => {
    const storage = new Storage(3);

    expect(storage.setData('data-1', 'value-1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2')).toBeTruthy();
    expect(storage.setData('data-3', 'value-3')).toBeTruthy();

    expect(storage.getData('data-1')).toBe('value-1');
    expect(storage.getData('data-2')).toBe('value-2');
    expect(storage.getData('data-3')).toBe('value-3');
  });

  it('should remove least used item from cache', () => {
    const storage = new Storage(3);

    expect(storage.setData('data-1', 'value-1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2')).toBeTruthy();
    expect(storage.setData('data-3', 'value-3')).toBeTruthy();
    expect(storage.setData('data-4', 'value-4')).toBeTruthy();
    expect(storage.setData('data-5', 'value-5')).toBeTruthy();

    expect(storage.getData('data-1')).toBeUndefined();
    expect(storage.getData('data-2')).toBeUndefined();
    expect(storage.getData('data-3')).toBe('value-3');
    expect(storage.getData('data-4')).toBe('value-4');
    expect(storage.getData('data-5')).toBe('value-5');
  });

  it('should remove data', () => {
    const storage = new Storage(5);

    expect(storage.setData('data-1', 'value-1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2')).toBeTruthy();
    expect(storage.setData('data-3', 'value-3')).toBeTruthy();
    expect(storage.setData('data-4', 'value-4')).toBeTruthy();
    expect(storage.setData('data-5', 'value-5')).toBeTruthy();

    expect(storage.removeData('data-1')).toBeTruthy();
    expect(storage.removeData('data-6')).toBeFalsy();
    expect(storage.removeData('data-4')).toBeTruthy();

    expect(storage.getData('data-1')).toBeUndefined();
    expect(storage.getData('data-2')).toBe('value-2');
    expect(storage.getData('data-3')).toBe('value-3');
    expect(storage.getData('data-4')).toBeUndefined();
    expect(storage.getData('data-5')).toBe('value-5');
  });

  it('should not remove items that marked as persistent', () => {
    const storage = new Storage(3);

    expect(storage.setData('data-1', 'value-1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2')).toBeTruthy();

    storage.setPersistent('data-1');
    storage.setPersistent('data-2');

    expect(storage.setData('data-3', 'value-3')).toBeTruthy();
    expect(storage.setData('data-4', 'value-4')).toBeTruthy();
    expect(storage.setData('data-5', 'value-5')).toBeTruthy();

    expect(storage.getData('data-1')).toBe('value-1');
    expect(storage.getData('data-2')).toBe('value-2');
    expect(storage.getData('data-3')).toBeUndefined();
    expect(storage.getData('data-4')).toBeUndefined();
    expect(storage.getData('data-5')).toBe('value-5');
  });

  it('should return current cache size', () => {
    const storage = new Storage(5);

    expect(storage.size()).toBe(0);
    storage.setData('data-1', 'value-1');
    expect(storage.size()).toBe(1);
    storage.setData('data-2', 'value-2');
    expect(storage.size()).toBe(2);
    storage.setData('data-3', 'value-3');
    expect(storage.size()).toBe(3);
    storage.setData('data-4', 'value-4');
    expect(storage.size()).toBe(4);
    storage.setData('data-5', 'value-5');
    expect(storage.size()).toBe(5);
    storage.setData('data-6', 'value-6');
    expect(storage.size()).toBe(5);
    storage.removeData('data-2');
    expect(storage.size()).toBe(4);
    storage.removeData('data-6');
    expect(storage.size()).toBe(3);
  });

  it('should be able to set new values for existing keys', () => {
    const storage = new Storage(3);

    expect(storage.setData('data-1', 'value-1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2')).toBeTruthy();
    expect(storage.setData('data-3', 'value-3')).toBeTruthy();
    expect(storage.setData('data-1', 'value-1.1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2.1')).toBeTruthy();

    expect(storage.getData('data-1')).toBe('value-1.1');
    expect(storage.getData('data-2')).toBe('value-2.1');
    expect(storage.getData('data-3')).toBe('value-3');

    expect(storage.setData('data-3', 'value-3.1')).toBeTruthy();
    expect(storage.setData('data-1', 'value-1.2')).toBeTruthy();

    expect(storage.getData('data-1')).toBe('value-1.2');
    expect(storage.getData('data-2')).toBe('value-2.1');
    expect(storage.getData('data-3')).toBe('value-3.1');

    expect(storage.size()).toBe(3);
  });

  it('should return false in case of it is not possible to add new item within the storage', () => {
    const storage = new Storage(3);

    expect(storage.setData('data-1', 'value-1'));
    expect(storage.setData('data-2', 'value-2'));
    expect(storage.setData('data-3', 'value-3'));

    storage.setPersistent('data-1');
    storage.setPersistent('data-2');
    storage.setPersistent('data-3');

    expect(storage.setData('data-4', 'value-4')).toBeFalsy();

    expect(storage.size()).toBe(3);
  });

  it('should support any type as key and value', () => {
    const storage = new Storage(7);
    const obj = {};
    const arr: any = [];
    const fn = function () {};

    expect(storage.setData(1, 'value-1')).toBeTruthy();
    expect(storage.setData(obj, 200)).toBeTruthy();
    expect(storage.setData(null, obj)).toBeTruthy();
    expect(storage.setData(arr, null)).toBeTruthy();
    expect(storage.setData(undefined, arr)).toBeTruthy();
    expect(storage.setData(fn, undefined)).toBeTruthy();
    expect(storage.setData(10, fn)).toBeTruthy();

    expect(storage.getData(1)).toBe('value-1');
    expect(storage.getData(obj)).toBe(200);
    expect(storage.getData(null)).toBe(obj);
    expect(storage.getData(arr)).toBe(null);
    expect(storage.getData(undefined)).toBe(arr);
    expect(storage.getData(fn)).toBe(undefined);
    expect(storage.getData(10)).toBe(fn);
  });

  it('should check if item is or not in the storage', () => {
    const storage = new Storage(3);
    storage.setData(1, 'value-1')
    storage.setData('key-2', [1, 2, 3]);
    storage.setData(null, [1, 2, 3]);

    expect(storage.contains(1)).toBeTruthy();
    expect(storage.contains('key-2')).toBeTruthy();
    expect(storage.contains(null)).toBeTruthy();

    storage.removeData('key-2');
    expect(storage.contains('key-2')).toBeFalsy();

    storage.removeData(null);
    expect(storage.contains(null)).toBeFalsy();

    expect(storage.contains(1)).toBeTruthy();
  });

  it('should remove all items from the storage', () => {
    const storage = new Storage(3);
    const obj = {};

    storage.setData('data-1', 'value-1');
    storage.setData(obj, [1, 2, 3]);
    storage.setData(123, 'value-3');
    storage.clear();

    expect(storage.size()).toBe(0);
    expect(storage.getData('data-1')).toBeUndefined();
    expect(storage.getData(obj)).toBeUndefined();
    expect(storage.getData(123)).toBeUndefined();
  });
});
