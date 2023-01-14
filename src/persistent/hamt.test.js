// import fs from 'node:fs';
// import assert from 'node:assert';
// import { Hamt, Entry } from './hamt.js';

// let actual = new Hamt(0);
// let prev;

// fs.readFile('./src/persistent/data.txt', { encoding: 'utf-8' },
//   (_err, data) => {
//     const lines = data.split('\n');
//     const before = performance.now();
//     for (let i = 0; i < 20000; i++) {
//       const line = lines[i];
//       const [key, value] = line.split(' ');
//       const entry = new Entry(key, value);
//       prev = actual;
//       actual = actual.insert(entry);
//       const got = actual.find(entry);
//       if (got.key !== key) {
//         assert(false);
//       }
//       // assert.strictEqual(got.key, key);
//       // assert.strictEqual(got.value, value);
//     }
//     const after = performance.now();
//     console.dir({ delta: after - before });
//   });

