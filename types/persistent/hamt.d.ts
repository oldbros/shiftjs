export class Entry {
    constructor(key: any, value: any, hashFunction: any);
    key: any;
    value: any;
    hashFunction: any;
    hash: any;
    type: string;
    equal(entry: any): boolean;
}
export class Hamt {
    constructor(level: any);
    level: any;
    children: any[];
    type: string;
    calculateIndex(hash: any): number;
    setChild(index: any, child: any): Hamt;
    insert(entry: any): any;
    find(entry: any): any;
}
