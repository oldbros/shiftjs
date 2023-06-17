import { PersistentVector } from './vector.js';
import assert from 'node:assert';
import test from 'node:test';

test('Persistent vector', async (t) => {
  const benchmark = {
    iterations: 1000000,
    results: {},
  };

  await t.test('Init', () => {
    const vec = PersistentVector.EMPTY;
    assert.strictEqual(vec.count, 0);
    assert.strictEqual(vec.nth(0), undefined);
  });

  await t.test('Vector errors', () => {
    const vec = PersistentVector.EMPTY;
    assert.throws(() => vec.assocN(1, 2), { message: 'Index out of bounds' });
    assert.throws(() => vec.arrayFor(1), { message: 'Index out of bounds' });
    assert.throws(() => vec.pop(), { message: 'Can\'t pop empty vector' });
  });

  await t.test('Insert or cons & benchmark', async (t) => {
    let vec = PersistentVector.EMPTY;
    const before = performance.now();
    for (let i = 0; i < benchmark.iterations; i++) {
      vec = vec.cons(i);
    }
    const after = performance.now();
    benchmark.results.cons = after - before;
    assert.strictEqual(vec.count, benchmark.iterations);

    await t.test('Read & benchmark', () => {
      const before = performance.now();
      for (let i = 0; i < benchmark.iterations; i++) {
        assert.strictEqual(i, vec.nth(i));
      }
      const after = performance.now();
      benchmark.results.read = after - before;
    });

    await t.test('Remove and check', () => {
      let vec1 = vec;

      for (let i = 0; i < benchmark.iterations / 2; i++) {
        vec1 = vec1.pop();
      }

      for (let i = 0; i < benchmark.iterations / 2; i++) {
        assert.strictEqual(i, vec1.nth(i));
      }

      assert.strictEqual(vec1.count, benchmark.iterations / 2);
    });

    await t.test('Remove or pop & benchmark', () => {
      let newVec = vec;
      const before = performance.now();
      for (let i = 0; i < benchmark.iterations; i++) {
        newVec = newVec.pop();
      }
      const after = performance.now();
      benchmark.results.pop = after - before;
      assert.strictEqual(newVec.count, 0);
    });

    await t.test('Update or assocN', async (t) => {
      let newVec = vec;
      const before = performance.now();
      for (let i = 0; i < benchmark.iterations; i++) {
        newVec = newVec.assocN(i, i * 10);
      }
      const after = performance.now();
      benchmark.results.assocN = after - before;
      assert.strictEqual(newVec.count, benchmark.iterations);

      await t.test('Read after update', () => {
        for (let i = 0; i < benchmark.iterations; i++) {
          assert.strictEqual(i * 10, newVec.nth(i));
        }
      });
    });
  });

  await t.test('Iterate over vector', () => {
    let vec = PersistentVector.EMPTY;

    for (let i = 0; i < 1000; i++) {
      vec = vec.cons(i);
    }

    const arrayFromVec = [...vec];

    assert.strictEqual(arrayFromVec.length, 1000);
    assert.strictEqual(arrayFromVec[0], 0);
    assert.strictEqual(arrayFromVec[arrayFromVec.length - 1], 999);
  });

  const { results, iterations } = benchmark;
  console.table([{ testSubject: 'Persistent Vector', iterations, ...results }]);
});
