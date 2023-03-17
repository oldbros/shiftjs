"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/shift.js
var shift_exports = {};
__export(shift_exports, {
  PersistentVector: () => PersistentVector,
  compose: () => compose,
  curry: () => curry,
  partial: () => partial,
  partialObject: () => partialObject,
  partialObjectFirst: () => partialObjectFirst,
  partialObjectLast: () => partialObjectLast,
  partialOne: () => partialOne,
  partialReverse: () => partialReverse,
  partialReverseOne: () => partialReverseOne,
  pipe: () => pipe
});
module.exports = __toCommonJS(shift_exports);

// src/basic/partial.js
var partial = (fn, ...args) => fn.bind(null, ...args);
var partialOne = (fn, arg) => fn.bind(null, arg);
var partialReverse = (fn, ...args) => (...left) => fn(...left, ...args.reverse());
var partialReverseOne = (fn, arg) => (...rest) => fn(...rest, arg);
var partialObject = (fn, props) => (delta) => fn(Object.assign(props, delta));
var partialObjectLast = (fn, props) => (...args) => {
  const last = args[args.length - 1];
  Object.assign(last, props);
  return fn(...args);
};
var partialObjectFirst = (fn, props) => (...args) => {
  const first = args[0];
  Object.assign(first, props);
  return fn(...args);
};

// src/basic/curry.js
var curry = (fn) => (...args) => {
  if (fn.length > args.length) {
    const f = fn.bind(null, ...args);
    return curry(f);
  } else {
    return fn(...args);
  }
};

// src/basic/compose.js
var compose = (...fns) => (args) => {
  if (fns.length === 0)
    return args;
  const fn = fns.pop();
  const res = fn(args);
  return compose(...fns)(res);
};

// src/basic/pipe.js
var pipe = (...fns) => (args) => {
  if (fns.length === 0)
    return args;
  const fn = fns.shift();
  const res = fn(args);
  return pipe(...fns)(res);
};

// src/persistent/vector.js
var emptyNode = () => [];
var copyNode = (node) => [...node];
var doAssoc = (level, node, i, val) => {
  const ret = [...node];
  if (level === 0) {
    ret[i & 31] = val;
  } else {
    const subIndex = i >>> level & 31;
    ret[subIndex] = doAssoc(
      level - 5,
      node[subIndex],
      i,
      val
    );
  }
  return ret;
};
var newPath = (level, node) => {
  if (level === 0) {
    return node;
  }
  const ret = emptyNode();
  ret[0] = newPath(level - 5, node);
  return ret;
};
var pushTail = (level, parent, tailNode, count) => {
  const subIndex = count - 1 >>> level & 31;
  const ret = copyNode(parent);
  let nodeToInsert;
  if (level === 5) {
    nodeToInsert = tailNode;
  } else {
    const child = parent[subIndex];
    nodeToInsert = child ? pushTail(level - 5, child, tailNode, count) : newPath(level - 5, tailNode);
  }
  ret[subIndex] = nodeToInsert;
  return ret;
};
var popTail = (level, node, count) => {
  const subidx = count - 2 >>> level & 31;
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
var _tailOffset, tailOffset_fn;
var _PersistentVector = class {
  /**
   * @param {number} count
   * @param {number} shift
   * @param {NodeArray32} root
   * @param {NodeArray32} tail
   * */
  constructor(count, shift, root, tail) {
    /** @type {() => number} */
    __privateAdd(this, _tailOffset);
    this.count = count;
    this.shift = shift;
    this.root = root;
    this.tail = tail;
  }
  /** @type {(i: number) => NodeArray32} */
  arrayFor(i) {
    if (i >= 0 && i < this.count) {
      if (i >= __privateMethod(this, _tailOffset, tailOffset_fn).call(this))
        return this.tail;
      let node = this.root;
      for (let level = this.shift; level > 0; level -= 5) {
        const index = i >>> level & 31;
        const el = node[index];
        node = el;
      }
      return node;
    }
    throw new Error("Index out of bounds");
  }
  /**
   * get
   * @type {(i: number) => any}
   * */
  nth(i) {
    if (i >= 0 && i < this.count) {
      const node = this.arrayFor(i);
      return node[i & 31];
    }
    return void 0;
  }
  /**
   * push
   * @type {(val: number) => PersistentVector}
   * */
  cons(val) {
    if (this.count - __privateMethod(this, _tailOffset, tailOffset_fn).call(this) < 32) {
      const newTail = copyNode(this.tail);
      newTail[this.tail.length] = val;
      return new _PersistentVector(this.count + 1, this.shift, this.root, newTail);
    }
    let newRoot;
    const tailNode = copyNode(this.tail);
    let newShift = this.shift;
    if (this.count >>> 5 > 1 << this.shift) {
      newRoot = copyNode(this.root);
      newRoot[0] = this.root;
      newRoot[1] = newPath(this.shift, tailNode);
      newShift += 5;
    } else {
      newRoot = pushTail(this.shift, this.root, tailNode, this.count);
    }
    return new _PersistentVector(this.count + 1, newShift, newRoot, [val]);
  }
  /**
   * update
   * @type {(i: number, val: number) => PersistentVector}
   * */
  assocN(i, val) {
    if (i >= 0 && i < this.count) {
      if (i >= __privateMethod(this, _tailOffset, tailOffset_fn).call(this)) {
        const newTail = copyNode(this.tail);
        newTail[i & 31] = val;
        return new _PersistentVector(this.count, this.shift, this.root, newTail);
      } else {
        const newRoot = doAssoc(this.shift, this.root, i, val);
        return new _PersistentVector(this.count, this.shift, newRoot, this.tail);
      }
    }
    if (i === this.count) {
      return this.cons(val);
    }
    throw new Error("Index out of bounds");
  }
  /**
   * delete last
   * @type {() => PersistentVector}
   * */
  pop() {
    if (this.count === 0) {
      throw new Error("Can't pop empty vector");
    }
    if (this.count === 1) {
      return _PersistentVector.EMPTY;
    }
    if (this.count - __privateMethod(this, _tailOffset, tailOffset_fn).call(this) > 1) {
      const newTail = this.tail.slice(0, -1);
      return new _PersistentVector(this.count - 1, this.shift, this.root, newTail);
    }
    const newtail = this.arrayFor(this.count - 2);
    let newroot = popTail(this.shift, this.root, this.count);
    let newshift = this.shift;
    if (this.shift > 5 && newroot[1] === null) {
      newroot = newroot[0];
      newshift -= 5;
    }
    return new _PersistentVector(this.count - 1, newshift, newroot, newtail);
  }
};
var PersistentVector = _PersistentVector;
_tailOffset = new WeakSet();
tailOffset_fn = function() {
  if (this.count < 32) {
    return 0;
  } else {
    return this.count - 1 >>> 5 << 5;
  }
};
/** @type {PersistentVector} */
__publicField(PersistentVector, "EMPTY", new _PersistentVector(0, 5, emptyNode(), emptyNode()));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PersistentVector,
  compose,
  curry,
  partial,
  partialObject,
  partialObjectFirst,
  partialObjectLast,
  partialOne,
  partialReverse,
  partialReverseOne,
  pipe
});
