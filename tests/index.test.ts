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
});
