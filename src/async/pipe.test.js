import test from 'node:test';
import assert from 'node:assert';

import { pipe } from './pipe.js';

const superSaiyan = async (base) => base * 50;
const kaioken = async (form) => form * 2;
const kaiokenTimesTen = async (kaioken) => kaioken * 10;
const goku = async () => 100;

const one = async () => '1';
const two = async (acc) => acc + '2';
const three = async (acc) => acc + '3';

test('Pipe async function', async () => {
  /** @type {() => Promise<number>} */
  const gokuSsjKaiokenTimes20 = pipe(goku, superSaiyan, kaioken, kaiokenTimesTen);
  assert.strictEqual(await gokuSsjKaiokenTimes20(), 100000);

  const nothingFn = pipe();
  assert.strictEqual(await nothingFn(), undefined);

  const gokuKaioken = pipe(goku, kaioken);
  assert.strictEqual(await gokuKaioken(), 200);

  const fn123 = pipe(one, two, three);
  assert.strictEqual(await fn123(), '123');
});
