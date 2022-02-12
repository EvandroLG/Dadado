import Storage from '../src/';

describe('lru', () => {
  it('should throw an error if `capacity` is not an integer or a positive number', () => {
    const errorIntegerNumber = 'Expected an integer number';
    const errorPositiveNumber = 'Expected a positive number greater or equal to 1';

    expect(() => new Storage(3.3)).toThrowError(errorIntegerNumber);
    expect(() => new Storage(1222.23)).toThrowError(errorIntegerNumber);
    expect(() => new Storage(0)).toThrowError(errorPositiveNumber);
    expect(() => new Storage(-86)).toThrowError(errorPositiveNumber);
    expect(() => new Storage(-1020)).toThrowError(errorPositiveNumber);
  });

  it('should be able to set the storage capacity', () => {
    const storage = new Storage(10);
    expect(storage.capacity).toBe(10);
  });

  it('should be able to set and get data', () => {
    const storage = new Storage(3);

    expect(storage.setItem('data-1', 'value-1')).toBeTruthy();
    expect(storage.setItem('data-2', 'value-2')).toBeTruthy();
    expect(storage.setItem('data-3', 'value-3')).toBeTruthy();

    expect(storage.getItem('data-1')).toBe('value-1');
    expect(storage.getItem('data-2')).toBe('value-2');
    expect(storage.getItem('data-3')).toBe('value-3');
  });

  it('should remove least used item from cache', () => {
    const storage = new Storage(3);

    expect(storage.setItem('data-1', 'value-1')).toBeTruthy();
    expect(storage.setItem('data-2', 'value-2')).toBeTruthy();
    expect(storage.setItem('data-3', 'value-3')).toBeTruthy();
    expect(storage.setItem('data-4', 'value-4')).toBeTruthy();
    expect(storage.setItem('data-5', 'value-5')).toBeTruthy();

    expect(storage.getItem('data-1')).toBeUndefined();
    expect(storage.getItem('data-2')).toBeUndefined();
    expect(storage.getItem('data-3')).toBe('value-3');
    expect(storage.getItem('data-4')).toBe('value-4');
    expect(storage.getItem('data-5')).toBe('value-5');
  });

  it('should remove data', () => {
    const storage = new Storage(5);

    expect(storage.setItem('data-1', 'value-1')).toBeTruthy();
    expect(storage.setItem('data-2', 'value-2')).toBeTruthy();
    expect(storage.setItem('data-3', 'value-3')).toBeTruthy();
    expect(storage.setItem('data-4', 'value-4')).toBeTruthy();
    expect(storage.setItem('data-5', 'value-5')).toBeTruthy();

    expect(storage.removeItem('data-1')).toBeTruthy();
    expect(storage.removeItem('data-6')).toBeFalsy();
    expect(storage.removeItem('data-4')).toBeTruthy();

    expect(storage.getItem('data-1')).toBeUndefined();
    expect(storage.getItem('data-2')).toBe('value-2');
    expect(storage.getItem('data-3')).toBe('value-3');
    expect(storage.getItem('data-4')).toBeUndefined();
    expect(storage.getItem('data-5')).toBe('value-5');
  });

  it('should not remove items that marked as persistent', () => {
    const storage = new Storage(3);

    expect(storage.setItem('data-1', 'value-1')).toBeTruthy();
    expect(storage.setItem('data-2', 'value-2')).toBeTruthy();

    storage.setPersistent('data-1');
    storage.setPersistent('data-2');

    expect(storage.setItem('data-3', 'value-3')).toBeTruthy();
    expect(storage.setItem('data-4', 'value-4')).toBeTruthy();
    expect(storage.setItem('data-5', 'value-5')).toBeTruthy();

    expect(storage.getItem('data-1')).toBe('value-1');
    expect(storage.getItem('data-2')).toBe('value-2');
    expect(storage.getItem('data-3')).toBeUndefined();
    expect(storage.getItem('data-4')).toBeUndefined();
    expect(storage.getItem('data-5')).toBe('value-5');
  });

  it('should return current cache size', () => {
    const storage = new Storage(5);

    expect(storage.size()).toBe(0);
    storage.setItem('data-1', 'value-1');
    expect(storage.size()).toBe(1);
    storage.setItem('data-2', 'value-2');
    expect(storage.size()).toBe(2);
    storage.setItem('data-3', 'value-3');
    expect(storage.size()).toBe(3);
    storage.setItem('data-4', 'value-4');
    expect(storage.size()).toBe(4);
    storage.setItem('data-5', 'value-5');
    expect(storage.size()).toBe(5);
    storage.setItem('data-6', 'value-6');
    expect(storage.size()).toBe(5);
    storage.removeItem('data-2');
    expect(storage.size()).toBe(4);
    storage.removeItem('data-6');
    expect(storage.size()).toBe(3);
  });

  it('should be able to set new values for existing keys', () => {
    const storage = new Storage(3);

    expect(storage.setItem('data-1', 'value-1')).toBeTruthy();
    expect(storage.setItem('data-2', 'value-2')).toBeTruthy();
    expect(storage.setItem('data-3', 'value-3')).toBeTruthy();
    expect(storage.setItem('data-1', 'value-1.1')).toBeTruthy();
    expect(storage.setItem('data-2', 'value-2.1')).toBeTruthy();

    expect(storage.getItem('data-1')).toBe('value-1.1');
    expect(storage.getItem('data-2')).toBe('value-2.1');
    expect(storage.getItem('data-3')).toBe('value-3');

    expect(storage.setItem('data-3', 'value-3.1')).toBeTruthy();
    expect(storage.setItem('data-1', 'value-1.2')).toBeTruthy();

    expect(storage.getItem('data-1')).toBe('value-1.2');
    expect(storage.getItem('data-2')).toBe('value-2.1');
    expect(storage.getItem('data-3')).toBe('value-3.1');

    expect(storage.size()).toBe(3);
  });

  it('should return false in case of it is not possible to add new item within the storage', () => {
    const storage = new Storage(3);

    expect(storage.setItem('data-1', 'value-1'));
    expect(storage.setItem('data-2', 'value-2'));
    expect(storage.setItem('data-3', 'value-3'));

    storage.setPersistent('data-1');
    storage.setPersistent('data-2');
    storage.setPersistent('data-3');

    expect(storage.setItem('data-4', 'value-4')).toBeFalsy();

    expect(storage.size()).toBe(3);
  });

  it('should support any type as key and value', () => {
    const storage = new Storage(7);
    const obj = {};
    const arr: any = [];
    const fn = function () {};

    expect(storage.setItem(1, 'value-1')).toBeTruthy();
    expect(storage.setItem(obj, 200)).toBeTruthy();
    expect(storage.setItem(null, obj)).toBeTruthy();
    expect(storage.setItem(arr, null)).toBeTruthy();
    expect(storage.setItem(undefined, arr)).toBeTruthy();
    expect(storage.setItem(fn, undefined)).toBeTruthy();
    expect(storage.setItem(10, fn)).toBeTruthy();

    expect(storage.getItem(1)).toBe('value-1');
    expect(storage.getItem(obj)).toBe(200);
    expect(storage.getItem(null)).toBe(obj);
    expect(storage.getItem(arr)).toBe(null);
    expect(storage.getItem(undefined)).toBe(arr);
    expect(storage.getItem(fn)).toBe(undefined);
    expect(storage.getItem(10)).toBe(fn);
  });

  it('should check if item is or not in the storage', () => {
    const storage = new Storage(3);
    storage.setItem(1, 'value-1')
    storage.setItem('key-2', [1, 2, 3]);
    storage.setItem(null, [1, 2, 3]);

    expect(storage.contains(1)).toBeTruthy();
    expect(storage.contains('key-2')).toBeTruthy();
    expect(storage.contains(null)).toBeTruthy();

    storage.removeItem('key-2');
    expect(storage.contains('key-2')).toBeFalsy();

    storage.removeItem(null);
    expect(storage.contains(null)).toBeFalsy();

    expect(storage.contains(1)).toBeTruthy();
  });

  it('should remove all items from the storage', () => {
    const storage = new Storage(3);
    const obj = {};

    storage.setItem('data-1', 'value-1');
    storage.setItem(obj, [1, 2, 3]);
    storage.setPersistent(obj);
    storage.setItem(123, 'value-3');
    storage.clear();

    expect(storage.size()).toBe(0);
    expect(storage.getItem('data-1')).toBeUndefined();
    expect(storage.getItem(obj)).toBeUndefined();
    expect(storage.getItem(123)).toBeUndefined();
  });
});
