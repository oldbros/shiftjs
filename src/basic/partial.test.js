import { partial } from './partial.js';
import { partial as rambdaPartial } from 'ramda';
import { performance } from 'node:perf_hooks';
import test from 'node:test';
import assert from 'node:assert';

test('partial', () => {
  /** @type {(a: number, b: number, c: number) => number} */
  const sumThree = (a, b, c) => a + b + c;

  /** @type {(b: number, c: number) => number} */
  const sumTwo = partial(sumThree, 10);
  assert.strictEqual(sumTwo.length, 2);
  assert.strictEqual(sumTwo(10, 10), 30);

  /** @type {(c: number) => number} */
  const sumOne = partial(sumTwo, 10);
  assert.strictEqual(sumOne.length, 1);
  assert.strictEqual(sumOne(10), 30);

  /** @type {() => number} */
  const sumZero = partial(sumOne, 10);
  assert.strictEqual(sumZero.length, 0);
  assert.strictEqual(sumZero(), 30);

  /** @type {() => number} */
  const sumAll = partial(sumThree, 10, 10, 10);
  assert.strictEqual(sumAll(), 30);
});

test('Partial microbenchmark: oldbros vs ramda', () => {
  const testSubject = 'function:partial';
  const iterations = 10000000;
  const sum = (a, b, c) => a + b + c;

  const oldbrosPartialBench = () => {
    const before = performance.now();
    const sumOne = partial(sum, 10);
    const sumTwo = partial(sumOne, 10);
    for (let i = 0; i < iterations; i++) {
      sumTwo(i);
    }
    const after = performance.now();
    return after - before;
  };

  const ramdaPartialBench = () => {
    const before = performance.now();
    const sumOne = rambdaPartial(sum, [10]);
    const sumTwo = rambdaPartial(sumOne, [10]);
    for (let i = 0; i < iterations; i++) {
      sumTwo(i);
    }
    const after = performance.now();
    return after - before;
  };

  const oldbrosTime = oldbrosPartialBench();
  const ramdaTime = ramdaPartialBench();
  const difference = ramdaTime - oldbrosTime;
  const ratio = ramdaTime / oldbrosTime;
  console.table([{ testSubject, iterations, ramdaTime, oldbrosTime, difference, ratio }]);
  assert.strictEqual(oldbrosTime < ramdaTime, true);
});
