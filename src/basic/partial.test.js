import { partial } from './partial.js';
import test from 'node:test';
import assert from 'node:assert';

test('partial', () => {
  /** @type {(a: number, b: number, c: number) => number} */
  const sumThree = (a, b, c) => a + b + c;

  /** @type {(a: number, b: number) => number} */
  const sumTwo = partial(sumThree, 10);
  assert.strictEqual(sumTwo.length, 2);
  assert.strictEqual(sumTwo(10, 10), 30);

  /** @type {(a: number) => number} */
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
