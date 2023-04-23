import test from 'node:test';
import assert from 'node:assert';
import { performance } from 'node:perf_hooks';
import { compose } from './compose.js';
import { compose as ramdaCompose } from 'ramda';

const testSubject = 'function:compose';
const iterations = 10000000;
const superSaiyan = (base) => base * 50;
const kaioken = (form) => form * 2;
const kaiokenTimesTen = (kaioken) => kaioken * 10;
const goku = () => 100;

test('Compose function', () => {
  /** @type {() => number} */
  const gokuSsjKaiokenTimes20 = compose(kaiokenTimesTen, kaioken, superSaiyan, goku);
  assert.strictEqual(gokuSsjKaiokenTimes20(), 100000);

  const nothing = compose();
  assert.strictEqual(nothing(), undefined);

  const gokuKaioken = compose(kaioken, goku);
  assert.strictEqual(gokuKaioken(), 200);
});

test('Performance test oldbros vs ramda', () => {
  const oldbrosBench = () => {
    const before = performance.now();
    /** @type {() => number} */
    const gokuSsjKaiokenTimes20 = compose(kaiokenTimesTen, kaioken, superSaiyan, goku);
    for (let i = 0; i < iterations; i++) {
      gokuSsjKaiokenTimes20();
    }
    const after = performance.now();
    return after - before;
  };

  const ramdaBench = () => {
    const before = performance.now();
    /** @type {() => number} */
    const gokuSsjKaiokenTimes20 = ramdaCompose(kaiokenTimesTen, kaioken, superSaiyan, goku);
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
