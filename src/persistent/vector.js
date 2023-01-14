/** @typedef {import('./types').VectorNode} VNode */
/** @typedef {import('./types').PersistentVector} PVector */

/** @type {() => VNode} */
const emptyNode = () => [];

/** @type {(node: VNode) => VNode} */
const copyNode = (node) => [...node];

/** @type {(level: number, node: VNode, i: number, val: any) => VNode} */
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

/** @type {(level: number, node: VNode) => VNode} */
const newPath = (level, node) => {
  if (level === 0) {
    return node;
  }
  const ret = emptyNode();
  ret[0] = newPath(level - 5, node);
  return ret;
};

/** @type {(level: number, parent: VNode, tailNode: VNode, count: number) => VNode} */
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

/** @type {(level: number, node: VNode, count: number) => ?VNode} */
const popTail = (level, node, count) => {
  const subidx = ((count - 2) >>> level) & 0x01f;
  if (level > 5) {
    const newchild = popTail(level - 5, node[subidx], count);
    if (newchild === null && subidx === 0) {
      return null;
    } else {
      const ret = copyNode(node);
      ret[subidx] = newchild;
      return ret;
    }
  } else if (subidx === 0) {
    return null;
  } else if (subidx === node.length - 1) {
    return node.slice(0, -1);
  } else {
    const ret = copyNode(node);
    ret.splice(subidx, 1);
    return ret;
  }
};

/** @type {PVector} */
export class PersistentVector {
  static EMPTY = new PersistentVector(0, 5, emptyNode(), emptyNode());

  count;
  shift;
  root;
  tail;

  /**
   * @param {number} count
   * @param {number} shift
   * @param {VNode} root
   * @param {VNode} tail
   * */
  constructor(count, shift, root, tail) {
    this.count = count;
    this.shift = shift;
    this.root = root;
    this.tail = tail;
  }

  #tailOffset() {
    if (this.count < 32) {
      return 0;
    } else {
      return ((this.count - 1) >>> 5) << 5;
    }
  }

  arrayFor(i) {
    if (i >= 0 && i < this.count) {
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

  // get
  nth(i) {
    if (i >= 0 && i < this.count) {
      const node = this.arrayFor(i);
      return node[i & 0x01f];// 31
    }
    return undefined;
  }

  // push
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
    if (newroot === null) {
      newroot = emptyNode();
    }
    if (this.shift > 5 && newroot[1] === null) {
      newroot = newroot[0];
      newshift -= 5;
    }
    return new PersistentVector(this.count - 1, newshift, newroot, newtail);
  }
}
