/** @typedef {import('./types').curry} Curry*/

/**
 * Curry - high performant curry function
 * see https://en.wikipedia.org/wiki/Currying
 * @type {Curry}
 * */
export const curry = (fn) => (...args) => {
  if (fn.length > args.length) {
    const f = fn.bind(null, ...args);
    return curry.bind(null, f);
  } else {
    return fn(...args);
  }
};
