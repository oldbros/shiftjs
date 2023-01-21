import test from 'node:test';
import assert from 'node:assert';
import { performance } from 'node:perf_hooks';
import { curry } from './curry.js';
import { curry as ramdaCurry } from 'ramda';

test('curry', () => {
  /** @type {(a: number, b: number, c: number) => number} */
  const sumThree = (a, b, c) => a + b + c;
  const carriedSum = curry(sumThree);
  assert.strictEqual(carriedSum(10, 10, 10), 30);
});

test('Curry microbenchmark: oldbros vs ramda', () => {
  const testSubject = 'function:curry';
  const iterations = 10000000;
  const sum = (a, b, c) => a + b + c;

  const oldbrosCurryBench = () => {
    const before = performance.now();
    const curried = curry(sum);
    for (let i = 0; i < iterations; i++) {
      curried(i)(i + 1)(i + 2);

    }
    const after = performance.now();
    return after - before;
  };

  const ramdaCurryBench = () => {
    const before = performance.now();
    const curried = ramdaCurry(sum);
    for (let i = 0; i < iterations; i++) {
      curried(i)(i + 1)(i + 2);

    }
    const after = performance.now();
    return after - before;
  };

  const oldbrosTime = oldbrosCurryBench();
  const ramdaTime = ramdaCurryBench();
  const difference = ramdaTime - oldbrosTime;
  const ratio = ramdaTime / oldbrosTime;
  console.table([{ testSubject, iterations, ramdaTime, oldbrosTime, difference, ratio }]);
  assert.strictEqual(oldbrosTime < ramdaTime, true);
});
