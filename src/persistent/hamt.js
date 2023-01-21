// import { djb2 } from './jenknins.js';

// const arity = 32;
// const arityBits = 5;

// const defaultHash = (str) => {
//   if (typeof str === 'number') return str;
//   return djb2(str);
// };

// export class Entry {
//   key;
//   value;
//   constructor(key, value, hashFunction) {
//     this.hashFunction = hashFunction || defaultHash;
//     this.key = key;
//     this.value = value || key;
//     this.hash = this.hashFunction(this.key);
//     this.type = 'entry';
//   }

//   equal(entry) {
//     return entry.key === this.key;
//   }
// }

// class Bucket {
//   constructor(bucket) {
//     this.bucket = bucket ? [...bucket.bucket] : [];
//     this.type = 'node';
//   }

//   insert(entry) {
//     for (let i = 0; i < this.bucket.length; i++) {
//       const element = this.bucket[i];
//       if (entry.equal(element)) {
//         const newBucket = new Bucket(this);
//         newBucket[i] = entry;
//         return newBucket;
//       }
//     }
//     const nb = new Bucket(this);
//     nb.bucket.push(entry);
//     return nb;
//   }

//   find(entry) {
//     for (const actual of this.bucket) {
//       if (actual.equal(entry)) return actual;
//     }
//     return null;
//   }
// }

// export class Hamt {
//   constructor(level) {
//     this.level = level;
//     this.children = new Array(arity);
//     this.type = 'node';
//   }

//   calculateIndex(hash) {
//     return (hash >> arityBits * this.level) % arity;
//   }

//   setChild(index, child) {
//     const root = new Hamt(this.level);
//     root.children = [...this.children];
//     root.children[index] = child;
//     return root;
//   }

//   insert(entry) {
//     const index = this.calculateIndex(entry.hash);
//     let child;
//     const actual = this.children[index];
//     if (!actual) {
//       child = entry;
//     } else if (actual.type === 'entry') {
//       if (actual.equal(entry)) {
//         return this.setChild(index, entry);
//       }
//       const level = this.level + 1;
//       if (level * arityBits > arity) {
//         child = new Bucket().insert(actual).insert(entry);
//       } else {
//         child = new Hamt(level).insert(actual).insert(entry);
//       }
//     } else if (actual.type === 'node') {
//       child = actual.insert(entry);
//     }
//     return this.setChild(index, child);
//   }

//   find(entry) {
//     const index = this.calculateIndex(entry.hash);
//     const actual = this.children[index];
//     if (!actual) return null;
//     if (actual.type === 'entry') {
//       if (actual.equal(entry)) {
//         return actual;
//       }
//     } else if (actual.type === 'node') {
//       return actual.find(entry);
//     }
//     return null;
//   }
// }
