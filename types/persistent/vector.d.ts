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
    count: number;
    shift: number;
    root: NodeArray32;
    tail: NodeArray32;
    arrayFor(i: number): NodeArray32;
    nth(i: number): any;
    cons(val: number): PersistentVector;
    assocN(i: number, val: number): PersistentVector;
    pop(): PersistentVector;
    #private;
}
export type NodeArray32 = any[];
