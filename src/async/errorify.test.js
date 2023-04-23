import test from 'node:test';
import assert from 'node:assert';

import { errorify } from './errorify.js';

test('errorify', async () => {
  const testErr = new Error('Err');
  const failFn = errorify(async () => {
    throw testErr;
  });
  const [err1, res1] = await failFn();
  assert.strictEqual(err1, testErr);
  assert.strictEqual(res1, null);

  const successFn = errorify(async (a) => a);
  const [err2, res2] = await successFn(true);
  assert.strictEqual(err2, null);
  assert.strictEqual(res2, true);
});
