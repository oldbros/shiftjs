export class PersistentVector {
    /** @type {PersistentVector} */
    static EMPTY: PersistentVector;
    /**
     * @param {number} count
     * @param {number} shift
     * @param {NodeArray32} root
     * @param {NodeArray32} tail
     * */
    constructor(count: number, shift: number, root: NodeArray32, tail: NodeArray32);
    [Symbol.iterator](): Iterator<any>;
    count: number;
    shift: number;
    root: NodeArray32;
    tail: NodeArray32;
    arrayFor(i: number): NodeArray32;
    nth(i: number): any;
    cons(val: any): PersistentVector;
    assocN(i: number, val: any): PersistentVector;
    pop(): PersistentVector;
    #private;
}
export type NodeArray32 = any[];
