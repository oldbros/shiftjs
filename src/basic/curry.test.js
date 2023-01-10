import { curry } from './curry.js';
import test from 'node:test';
import assert from 'node:assert';

test('curry', () => {
  /** @type {(a: number, b: number, c: number) => number} */
  const sumThree = (a, b, c) => a + b + c;
  const carriedSum = curry(sumThree);
  assert.strictEqual(carriedSum(10, 10, 10), 30);
});
