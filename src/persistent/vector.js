/** @typedef {any[]} NodeArray32 */

/** @type {() => NodeArray32} */
const emptyNode = () => [];

/** @type {(node: NodeArray32) => NodeArray32} */
const copyNode = (node) => [...node];

/** @type {(level: number, node: NodeArray32, i: number, val: any) => NodeArray32} */
const doAssoc = (level, node, i, val) => {
  const ret = [...node];
  if (level === 0) {
    ret[i & 0x01f] = val;
  } else {
    const subIndex = (i >>> level) & 0x01f;
    ret[subIndex] = doAssoc(
      level - 5, node[subIndex], i, val,
    );
  }
  return ret;
};

/** @type {(level: number, node: NodeArray32) => NodeArray32} */
const newPath = (level, node) => {
  if (level === 0) {
    return node;
  }
  const ret = emptyNode();
  ret[0] = newPath(level - 5, node);
  return ret;
};

/** @type {(level: number, parent: NodeArray32, tailNode: NodeArray32, count: number) => NodeArray32} */
const pushTail = (level, parent, tailNode, count) => {
  const subIndex = ((count - 1) >>> level) & 0x01f;
  const ret =  copyNode(parent);
  let nodeToInsert;
  if (level === 5) {
    nodeToInsert = tailNode;
  } else {
    const child = parent[subIndex];
    nodeToInsert = child
      ? pushTail(level - 5, child, tailNode, count)
      : newPath(level - 5, tailNode);
  }
  ret[subIndex] = nodeToInsert;
  return ret;
};

/** @type {(level: number, node: NodeArray32, count: number) => NodeArray32} */
const popTail = (level, node, count) => {
  const subidx = ((count - 2) >>> level) & 0x01f;
  if (level > 5) {
    const newchild = popTail(level - 5, node[subidx], count);
    if (newchild.length === 0 && subidx === 0) {
      return newchild;
    } else {
      const ret = copyNode(node);
      ret[subidx] = newchild;
      return ret;
    }
  } else if (subidx === 0) {
    return emptyNode();
  } else if (subidx === node.length - 1) {
    return node.slice(0, -1);
  } else {
    const ret = copyNode(node);
    ret.splice(subidx, 1);
    return ret;
  }
};

export class PersistentVector {
  /** @type {PersistentVector} */
  static EMPTY = new PersistentVector(0, 5, emptyNode(), emptyNode());

  /**
   * @param {number} count
   * @param {number} shift
   * @param {NodeArray32} root
   * @param {NodeArray32} tail
   * */
  constructor(count, shift, root, tail) {
    this.count = count;
    this.shift = shift;
    this.root = root;
    this.tail = tail;
  }

  [Symbol.iterator]() {
    let i = 0;

    return {
      next: () => {
        if (this.count === 0) {
          return {
            done: true,
          };
        }

        const node = this.arrayFor(i);
        const value = node[i & 0x01f];

        if (i === this.count) {
          return {
            done: true,
            value,
          };
        }
        i += 1;
        return {
          done: false,
          value,
        };
      },
    };
  }

  /** @type {() => number} */
  #tailOffset() {
    if (this.count < 32) {
      return 0;
    } else {
      return ((this.count - 1) >>> 5) << 5;
    }
  }

  /** @type {(i: number) => NodeArray32} */
  arrayFor(i) {
    if (i >= 0 && i <= this.count) {
      if (i >= this.#tailOffset()) return this.tail;
      let node = this.root;
      for (let level = this.shift; level > 0; level -= 5) {
        const index = (i >>> level) & 0x01f;
        const el = node[index];// 31
        node = el;
      }
      return node;
    }
    throw new Error('Index out of bounds');
  }

  /**
   * get
   * @type {(i: number) => any}
   * */
  nth(i) {
    if (i >= 0 && i < this.count) {
      const node = this.arrayFor(i);
      return node[i & 0x01f];// 31
    }
    return undefined;
  }

  /**
   * push
   * @type {(val: number) => PersistentVector}
   * */
  cons(val) {
    // room in tail?
    // tail.length < 32
    if ((this.count - this.#tailOffset()) < 32) {
      const newTail = copyNode(this.tail);
      newTail[this.tail.length] = val;
      return new PersistentVector(this.count + 1, this.shift, this.root, newTail);
    }
    // full tail, push into tree
    let newRoot;
    const tailNode = copyNode(this.tail);
    let newShift = this.shift;
    // overflow root?
    if ((this.count >>> 5) > (1 << this.shift)) {
      newRoot = copyNode(this.root);
      newRoot[0] = this.root;
      newRoot[1] = newPath(this.shift, tailNode);
      newShift += 5;
    } else {
      newRoot = pushTail(this.shift, this.root, tailNode, this.count);
    }
    return new PersistentVector(this.count + 1, newShift, newRoot, [val]);
  }

  /**
   * update
   * @type {(i: number, val: number) => PersistentVector}
   * */
  assocN(i, val) {
    if (i >= 0 && i < this.count) {
      if (i >= this.#tailOffset()) {
        const newTail = copyNode(this.tail);
        newTail[i & 0x01f] = val;
        return new PersistentVector(this.count, this.shift, this.root, newTail);
      } else {
        const newRoot = doAssoc(this.shift, this.root, i, val);
		    return new PersistentVector(this.count, this.shift, newRoot, this.tail);
      }
    }
    if (i === this.count) {
      return this.cons(val);
    }
    throw new Error('Index out of bounds');
  }

  /**
   * delete last
   * @type {() => PersistentVector}
   * */
  pop() {
    if (this.count === 0) {
      throw new Error('Can\'t pop empty vector');
    }
    if (this.count === 1) {
      return PersistentVector.EMPTY;
    }
    	//if(tail.length > 1)
    if ((this.count - this.#tailOffset()) > 1) {
      const newTail = this.tail.slice(0, -1);
      return new PersistentVector(this.count - 1, this.shift, this.root, newTail);
    }
    const newtail = this.arrayFor(this.count - 2);

    let newroot = popTail(this.shift, this.root, this.count);
    let newshift = this.shift;
    if (this.shift > 5 && newroot[1] === null) {
      newroot = newroot[0];
      newshift -= 5;
    }
    return new PersistentVector(this.count - 1, newshift, newroot, newtail);
  }
}
