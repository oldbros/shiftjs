import test from 'node:test';
import assert from 'node:assert';

import { compose } from './compose.js';

const superSaiyan = async (base) => base * 50;
const kaioken = async (form) => form * 2;
const kaiokenTimesTen = async (kaioken) => kaioken * 10;
const goku = async () => 100;

const one = async () => '1';
const two = async (acc) => acc + '2';
const three = async (acc) => acc + '3';

test('compose async function', async () => {
  /** @type {() => Promise<number>} */
  const gokuSsjKaiokenTimes20 = compose(kaiokenTimesTen, kaioken, superSaiyan, goku);
  assert.strictEqual(await gokuSsjKaiokenTimes20(), 100000);

  const nothingFn = compose();
  assert.strictEqual(await nothingFn(), undefined);

  const gokuKaioken = compose(kaioken, goku);
  assert.strictEqual(await gokuKaioken(), 200);

  const fn123 = compose(three, two, one);
  assert.strictEqual(await fn123(), '123');
});
