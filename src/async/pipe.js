/**
 * @typedef {import('./types').AnyAsyncFn} AnyAsyncFn
 */
/**
 * Pipe for async functions
 * @param {AnyAsyncFn[]} fns
 * @returns {AnyAsyncFn} composed async function
 */
export const pipe = (...fns) =>
  (args) => fns.reduce(
    (chain, fn) => chain.then(fn), Promise.resolve(args),
  );
