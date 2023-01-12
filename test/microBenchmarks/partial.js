import { partial as rambdaPartial } from 'ramda';
import { partial as oldbrosPartial } from '../../src/shift.js';
import test from 'node:test';
import { performance } from 'node:perf_hooks';
import { roundDecimal } from '../utils.js';

test('Partial microbenchmark: oldbros vs ramda', () => {
  const testSubject = 'function:partial';
  const iterations = 10000000;
  const sum = (a, b, c) => a + b + c;

  const oldbrosPartialBench = () => {
    const before = performance.now();
    const sumOne = oldbrosPartial(sum, 10);
    const sumTwo = oldbrosPartial(sumOne, 10);
    for (let i = 0; i < iterations; i++) {
      sumTwo(i);
    }
    const after = performance.now();
    return roundDecimal(after - before, 3);
  };

  const ramdaPartialBench = () => {
    const before = performance.now();
    const sumOne = rambdaPartial(sum, [10]);
    const sumTwo = rambdaPartial(sumOne, [10]);
    for (let i = 0; i < iterations; i++) {
      sumTwo(i);
    }
    const after = performance.now();
    return roundDecimal(after - before, 3);
  };

  const oldbrosTime = oldbrosPartialBench();
  const ramdaTime = ramdaPartialBench();
  const difference = roundDecimal(ramdaTime - oldbrosTime, 3);
  const ratio = roundDecimal(ramdaTime / oldbrosTime, 3);
  console.table([{ testSubject, ramdaTime, oldbrosTime, difference, ratio }]);
});
