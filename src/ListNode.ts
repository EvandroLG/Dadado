export class ListNode<T> {
  key: T;
  prev: ListNode<T> | null = null;
  next: ListNode<T> | null = null;

  constructor(key: T) {
    this.key = key;
  }
}
