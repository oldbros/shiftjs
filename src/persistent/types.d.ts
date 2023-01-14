export type VectorNode = any[];

export class PersistentVector {
  static EMPTY: PersistentVector;

  constructor(count: number, shift: number, root: VectorNode, tail: VectorNode);

  count: number;
  shift: number;
  root: VectorNode;
  tail: VectorNode;

  #tailOffset(): number;
  arrayFor(i: number): VectorNode;
  nth(i: number): any;
  cons(val: any): PersistentVector;
  assocN(i: number, val: any): PersistentVector;
  pop(): PersistentVector;
}
