import test from 'node:test';
import assert from 'node:assert';

import shift from './shift.js';

const basics = [
  'partial',
  'partialOne',
  'partialReverse',
  'partialReverseOne',
  'partialObject',
  'partialObjectLast',
  'partialObjectFirst',
  'curry',
  'compose',
  'pipe',
  'PersistentVector',
];

test('Check exports', () => {
  basics.forEach((k) => assert.ok(k in shift));
});
