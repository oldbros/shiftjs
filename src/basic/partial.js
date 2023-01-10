/** @typedef {import('./types').AnyFunc} AnyFunc*/

/**
 * Partial - high performance one argument partial application function
 * multiple arguments significantly reduces performance
 * see https://en.wikipedia.org/wiki/Partial_application
 * @type {(fn: AnyFunc, arg: any) => AnyFunc}
 * */
export const partial =
  (fn, arg) =>
    (...args) =>
      fn(arg, ...args);
