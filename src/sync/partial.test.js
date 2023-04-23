import test from 'node:test';
import assert from 'node:assert';
import { performance } from 'node:perf_hooks';
import {
  partial,
  partialOne,
  partialReverse,
  partialReverseOne,
  partialObject,
  partialObjectLast,
  partialObjectFirst,
} from './partial.js';
import { partial as ramdaPartial, partialObject as ramdaPartialObj } from 'ramda';

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

test('partialOne', () => {
  const sumThree = (a, b, c) => a + b + c;
  const sum = partialOne(sumThree, 10);
  assert.strictEqual(sum(10, 10), 30);
});

test('partialReverse', () => {
  const printABC = (a, b, c) => `a: ${a}, b: ${b}, c: ${c}`;
  const print = partialReverse(printABC, 'c', 'b', 'a');
  assert.strictEqual(print(), 'a: a, b: b, c: c');
});

test('partialReverseOne', () => {
  const printABC = (a, b, c) => `a: ${a}, b: ${b}, c: ${c}`;
  const print = partialReverseOne(printABC, 'c');
  assert.strictEqual(print('a', 'b'), 'a: a, b: b, c: c');
});

test('partialObject', () => {
  /** @type {({a, b, c}: {a: number, b: number, c: number}) => number} */
  const sumThree = ({ a, b, c }) => a + b + c;

  /** @type {({b, c}: {b: number, c: number}) => number} */
  const sumTwo = partialObject(sumThree, { a: 10 });
  assert.strictEqual(sumTwo.length, 1);
  assert.strictEqual(sumTwo({ b: 10, c: 10 }), 30);

  /** @type {({c}: {c: number}) => number} */
  const sumOne = partialObject(sumTwo, { b: 10 });
  assert.strictEqual(sumOne.length, 1);
  assert.strictEqual(sumOne({ c: 10 }), 30);

  /** @type {() => number} */
  const sumZero = partialObject(sumOne, { c: 10 });
  assert.strictEqual(sumZero.length, 1);
  assert.strictEqual(sumZero(), 30);

  /** @type {() => number} */
  const sumAll = partialObject(sumThree, { a: 10, b: 10, c: 10 });
  assert.strictEqual(sumAll(), 30);
});

test('partialObjectLast', () => {
  const noMeta = (a, b, { data, meta }) => data + meta;
  const injectedMeta = partialObjectLast(noMeta, { meta: 'meta' });
  assert.strictEqual(injectedMeta(null, null, { data: 'data+' }), 'data+meta');
});

test('partialObjectFirst', () => {
  const noMeta = ({ data, meta }, num) => data + meta + num;
  const injectedMeta = partialObjectFirst(noMeta, { meta: 'meta' });
  assert.strictEqual(injectedMeta({ data: 'data+' }, '=payload'), 'data+meta=payload');
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
    const sumOne = ramdaPartial(sum, [10]);
    const sumTwo = ramdaPartial(sumOne, [10]);
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

test('Partial microbenchmark: oldbros vs ramda', () => {
  const testSubject = 'function:partialObject';
  const iterations = 1000000;
  const sum = ({ a, b, c }) => a + b + c;

  const oldbrosPartialObjBench = () => {
    const before = performance.now();
    const sumOne = partialObject(sum, { a: 10 });
    const sumTwo = partialObject(sumOne, { b: 10 });
    for (let i = 0; i < iterations; i++) {
      sumTwo({ c: i });
    }
    const after = performance.now();
    return after - before;
  };

  const ramdaPartialObjBench = () => {
    const before = performance.now();
    const sumOne = ramdaPartialObj(sum, { a: 10 });
    const sumTwo = ramdaPartialObj(sumOne, { b: 10 });
    for (let i = 0; i < iterations; i++) {
      sumTwo({ c: i });
    }
    const after = performance.now();
    return after - before;
  };

  const oldbrosTime = oldbrosPartialObjBench();
  const ramdaTime = ramdaPartialObjBench();
  const difference = ramdaTime - oldbrosTime;
  const ratio = ramdaTime / oldbrosTime;
  console.table([{ testSubject, iterations, ramdaTime, oldbrosTime, difference, ratio }]);
  assert.strictEqual(oldbrosTime < ramdaTime, true);
});

