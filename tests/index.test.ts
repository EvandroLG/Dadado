import Dadado from '../src/';

describe('Dadado', () => {
  test('throws an error if `capacity` is not an integer or a positive number', () => {
    const errorIntegerNumber = 'Expected an integer number';
    const errorPositiveNumber =
      'Expected a positive number greater or equal to 1';

    expect(() => new Dadado(3.3)).toThrowError(errorIntegerNumber);
    expect(() => new Dadado(1222.23)).toThrowError(errorIntegerNumber);
    expect(() => new Dadado(0)).toThrowError(errorPositiveNumber);
    expect(() => new Dadado(-86)).toThrowError(errorPositiveNumber);
    expect(() => new Dadado(-1020)).toThrowError(errorPositiveNumber);
  });

  test('sets the cache capacity', () => {
    const cache = new Dadado(10);
    expect(cache.capacity).toBe(10);
  });

  test('sets and gets data', () => {
    const cache = new Dadado(3);

    expect(cache.setItem('data-1', 'value-1')).toBeTruthy();
    expect(cache.setItem('data-2', 'value-2')).toBeTruthy();
    expect(cache.setItem('data-3', 'value-3')).toBeTruthy();

    expect(cache.getItem('data-1')).toBe('value-1');
    expect(cache.getItem('data-2')).toBe('value-2');
    expect(cache.getItem('data-3')).toBe('value-3');
  });

  test('removes least used item from cache', () => {
    const cache = new Dadado(3);

    expect(cache.setItem('data-1', 'value-1')).toBeTruthy();
    expect(cache.setItem('data-2', 'value-2')).toBeTruthy();
    expect(cache.setItem('data-3', 'value-3')).toBeTruthy();
    expect(cache.setItem('data-4', 'value-4')).toBeTruthy();
    expect(cache.setItem('data-5', 'value-5')).toBeTruthy();

    expect(cache.getItem('data-1')).toBeUndefined();
    expect(cache.getItem('data-2')).toBeUndefined();
    expect(cache.getItem('data-3')).toBe('value-3');
    expect(cache.getItem('data-4')).toBe('value-4');
    expect(cache.getItem('data-5')).toBe('value-5');
  });

  test('removes data', () => {
    const cache = new Dadado(5);

    expect(cache.setItem('data-1', 'value-1')).toBeTruthy();
    expect(cache.setItem('data-2', 'value-2')).toBeTruthy();
    expect(cache.setItem('data-3', 'value-3')).toBeTruthy();
    expect(cache.setItem('data-4', 'value-4')).toBeTruthy();
    expect(cache.setItem('data-5', 'value-5')).toBeTruthy();

    expect(cache.removeItem('data-1')).toBeTruthy();
    expect(cache.removeItem('data-6')).toBeFalsy();
    expect(cache.removeItem('data-4')).toBeTruthy();

    expect(cache.getItem('data-1')).toBeUndefined();
    expect(cache.getItem('data-2')).toBe('value-2');
    expect(cache.getItem('data-3')).toBe('value-3');
    expect(cache.getItem('data-4')).toBeUndefined();
    expect(cache.getItem('data-5')).toBe('value-5');
  });

  test('ensures persistent items are not removed when cache exceeds capacity', () => {
    const cache = new Dadado(3);

    expect(cache.setItem('data-1', 'value-1')).toBeTruthy();
    expect(cache.setItem('data-2', 'value-2')).toBeTruthy();

    cache.setPersistent('data-1');
    cache.setPersistent('data-2');

    expect(cache.setItem('data-3', 'value-3')).toBeTruthy();
    expect(cache.setItem('data-4', 'value-4')).toBeTruthy();
    expect(cache.setItem('data-5', 'value-5')).toBeTruthy();

    expect(cache.getItem('data-1')).toBe('value-1');
    expect(cache.getItem('data-2')).toBe('value-2');
    expect(cache.getItem('data-3')).toBeUndefined();
    expect(cache.getItem('data-4')).toBeUndefined();
    expect(cache.getItem('data-5')).toBe('value-5');
  });

  test('returns current cache size', () => {
    const cache = new Dadado(5);

    expect(cache.size()).toBe(0);
    cache.setItem('data-1', 'value-1');
    expect(cache.size()).toBe(1);
    cache.setItem('data-2', 'value-2');
    expect(cache.size()).toBe(2);
    cache.setItem('data-3', 'value-3');
    expect(cache.size()).toBe(3);
    cache.setItem('data-4', 'value-4');
    expect(cache.size()).toBe(4);
    cache.setItem('data-5', 'value-5');
    expect(cache.size()).toBe(5);
    cache.setItem('data-6', 'value-6');
    expect(cache.size()).toBe(5);
    cache.removeItem('data-2');
    expect(cache.size()).toBe(4);
    cache.removeItem('data-6');
    expect(cache.size()).toBe(3);
  });

  test('sets new values for existing keys', () => {
    const cache = new Dadado(3);

    expect(cache.setItem('data-1', 'value-1')).toBeTruthy();
    expect(cache.setItem('data-2', 'value-2')).toBeTruthy();
    expect(cache.setItem('data-3', 'value-3')).toBeTruthy();
    expect(cache.setItem('data-1', 'value-1.1')).toBeTruthy();
    expect(cache.setItem('data-2', 'value-2.1')).toBeTruthy();

    expect(cache.getItem('data-1')).toBe('value-1.1');
    expect(cache.getItem('data-2')).toBe('value-2.1');
    expect(cache.getItem('data-3')).toBe('value-3');

    expect(cache.setItem('data-3', 'value-3.1')).toBeTruthy();
    expect(cache.setItem('data-1', 'value-1.2')).toBeTruthy();

    expect(cache.getItem('data-1')).toBe('value-1.2');
    expect(cache.getItem('data-2')).toBe('value-2.1');
    expect(cache.getItem('data-3')).toBe('value-3.1');

    expect(cache.size()).toBe(3);
  });

  test('returns false when unable to add a new item', () => {
    const cache = new Dadado(3);

    expect(cache.setItem('data-1', 'value-1'));
    expect(cache.setItem('data-2', 'value-2'));
    expect(cache.setItem('data-3', 'value-3'));

    cache.setPersistent('data-1');
    cache.setPersistent('data-2');
    cache.setPersistent('data-3');

    expect(cache.setItem('data-4', 'value-4')).toBeFalsy();

    expect(cache.size()).toBe(3);
  });

  test('verifies presence of items in cache', () => {
    const cache = new Dadado(3);
    cache.setItem(1, 'value-1');
    cache.setItem('key-2', [1, 2, 3]);
    cache.setItem(null, [1, 2, 3]);

    expect(cache.contains(1)).toBeTruthy();
    expect(cache.contains('key-2')).toBeTruthy();
    expect(cache.contains(null)).toBeTruthy();

    cache.removeItem('key-2');
    expect(cache.contains('key-2')).toBeFalsy();

    cache.removeItem(null);
    expect(cache.contains(null)).toBeFalsy();

    expect(cache.contains(1)).toBeTruthy();
  });

  test('removes all items from the cache', () => {
    const cache = new Dadado(3);
    const obj = {};

    cache.setItem('data-1', 'value-1');
    cache.setItem(obj, [1, 2, 3]);
    cache.setPersistent(obj);
    cache.setItem(123, 'value-3');
    cache.clear();

    expect(cache.size()).toBe(0);
    expect(cache.getItem('data-1')).toBeUndefined();
    expect(cache.getItem(obj)).toBeUndefined();
    expect(cache.getItem(123)).toBeUndefined();
  });

  test('returns array of items sorted by least-recently-used order', () => {
    const cache = new Dadado(5);
    const obj = {};
    const fn = function () {
      // Intentionally left empty
    };

    cache.setItem('data-1', 'value-1');
    cache.setItem('data-2', 'value-2');
    cache.setItem(3, 'value-3');
    cache.setItem(obj, 4);
    cache.setItem(5, fn);

    cache.getItem(3);
    cache.getItem('data-2');

    const expected = JSON.stringify([
      ['data-1', 'value-1'],
      [obj, 4],
      [5, fn],
      [3, 'value-3'],
      ['data-2', 'value-2'],
    ]);

    expect(JSON.stringify(cache.toArray())).toBe(expected);
  });
});
