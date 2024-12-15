/**
 * Represents a node in a doubly linked list.
 * @template T - The type of the key stored in the node.
 */
export class ListNode<T> {
  key: T;
  prev: ListNode<T> | null = null;
  next: ListNode<T> | null = null;

  constructor(key: T) {
    this.key = key;
  }
}
