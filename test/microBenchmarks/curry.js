import { curry as oldbrosCurry } from '../../src/shift.js';
import { curry as ramdaCurry } from 'ramda';
import test from 'node:test';
import { performance } from 'node:perf_hooks';
import { roundDecimal } from '../utils.js';

test('Curry microbenchmark: oldbros vs ramda', () => {
  const testSubject = 'function:curry';
  const iterations = 10000000;
  const sum = (a, b, c) => a + b + c;

  const oldbrosCurryBench = () => {
    const before = performance.now();
    const curried = oldbrosCurry(sum);
    for (let i = 0; i < iterations; i++) {
      curried(i)(i + 1)(i + 2);

    }
    const after = performance.now();
    return roundDecimal(after - before);
  };

  const ramdaCurryBench = () => {
    const before = performance.now();
    const curried = ramdaCurry(sum);
    for (let i = 0; i < iterations; i++) {
      curried(i)(i + 1)(i + 2);

    }
    const after = performance.now();
    return roundDecimal(after - before);
  };

  const oldbrosTime = oldbrosCurryBench();
  const ramdaTime = ramdaCurryBench();
  const difference = roundDecimal(ramdaTime - oldbrosTime);
  const ratio = roundDecimal(ramdaTime / oldbrosTime);
  console.table([{ testSubject, ramdaTime, oldbrosTime, difference, ratio }]);
});
