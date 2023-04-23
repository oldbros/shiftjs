import test from 'node:test';
import assert from 'node:assert';
import { performance } from 'node:perf_hooks';
import { pipe } from './pipe.js';
import { pipe as ramdaPipe } from 'ramda';

const testSubject = 'function:pipe';
const iterations = 10000000;
const superSaiyan = (base) => base * 50;
const kaioken = (form) => form * 2;
const kaiokenTimesTen = (kaioken) => kaioken * 10;
const goku = () => 100;

test('Pipe function', () => {
  /** @type {() => number} */
  const gokuSsjKaiokenTimes20 = pipe(goku, superSaiyan, kaioken, kaiokenTimesTen);
  assert.strictEqual(gokuSsjKaiokenTimes20(), 100000);

  const nothing = pipe();
  assert.strictEqual(nothing(), undefined);

  const gokuKaioken = pipe(goku, kaioken);
  assert.strictEqual(gokuKaioken(), 200);
});

test('Performance test oldbros vs ramda', () => {
  const oldbrosBench = () => {
    const before = performance.now();
    /** @type {() => number} */
    const gokuSsjKaiokenTimes20 = pipe(goku, superSaiyan, kaioken, kaiokenTimesTen);
    for (let i = 0; i < iterations; i++) {
      gokuSsjKaiokenTimes20();
    }
    const after = performance.now();
    return after - before;
  };

  const ramdaBench = () => {
    const before = performance.now();
    /** @type {() => number} */
    const gokuSsjKaiokenTimes20 = ramdaPipe(goku, superSaiyan, kaioken, kaiokenTimesTen);
    for (let i = 0; i < iterations; i++) {
      gokuSsjKaiokenTimes20();
    }
    const after = performance.now();
    return after - before;
  };

  const oldbrosTime = oldbrosBench();
  const ramdaTime = ramdaBench();
  const difference = ramdaTime - oldbrosTime;
  const ratio = ramdaTime / oldbrosTime;
  console.table([{ testSubject, iterations, ramdaTime, oldbrosTime, difference, ratio }]);
  assert.strictEqual(oldbrosTime < ramdaTime, true);
});
