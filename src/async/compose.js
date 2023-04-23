/**
 * @typedef {import('./types').AnyAsyncFn} AnyAsyncFn
 */
/**
 * Compose for async functions
 * @param {AnyAsyncFn[]} fns
 * @returns {AnyAsyncFn} composed async function
 */
export const compose = (...fns) =>
  (args) => fns.reduceRight(
    (chain, fn) => chain.then(fn), Promise.resolve(args),
  );
