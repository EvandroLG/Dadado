import LRUStorage from '../src/';

describe('lru', () => {
  it('should be able to set the storage capacity', () => {
    const storage = new LRUStorage(10);
    expect(storage.capacity).toBe(10);
  });

  it('should be able to set and get data', () => {
    const storage = new LRUStorage(3);

    expect(storage.setData('data-1', 'value-1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2')).toBeTruthy();
    expect(storage.setData('data-3', 'value-3')).toBeTruthy();

    expect(storage.getData('data-1')).toBe('value-1');
    expect(storage.getData('data-2')).toBe('value-2');
    expect(storage.getData('data-3')).toBe('value-3');
  });

  it('should remove least used item from cache', () => {
    const storage = new LRUStorage(3);

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
    const storage = new LRUStorage(5);

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
    const storage = new LRUStorage(3);

    expect(storage.setData('data-1', 'value-1')).toBeTruthy();
    expect(storage.setData('data-2', 'value-2')).toBeTruthy();

    storage.makePersistent('data-1');
    storage.makePersistent('data-2');

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
    const storage = new LRUStorage(5);

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
});
