/** @typedef {import('./.types').AnyFunc} AnyFunc*/

/**
 * Curry - high performant curry function
 * see https://en.wikipedia.org/wiki/Currying
 * @type {(fn: AnyFunc) => AnyFunc}
 * */
export const curry = (fn) => (...args) => {
  if (fn.length > args.length) {
    const f = fn.bind(null, ...args);
    return curry(f);
  } else {
    return fn(...args);
  }
};
