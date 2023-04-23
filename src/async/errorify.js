/**
 * @typedef {import('./types').AnyAsyncFn} AnyAsyncFn
 */
/**
 * Wrappes async function into [err, res] contract
 * @param {AnyAsyncFn} fn
 * @returns {(...args: any[]) => Promise<[Error?, any]>}
 */
export const errorify = (fn) =>
  (...args) => new Promise(
    (resolve) =>
      fn(...args).catch((e) => resolve([e, null])).then((r) => resolve([null, r])),
  );
