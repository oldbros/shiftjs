/** @typedef {import('./types').partial} Partial*/

/**
 * Partial - high performance one argument partial application function
 * multiple arguments significantly reduces performance
 * see https://en.wikipedia.org/wiki/Partial_application
 * @type {Partial}
 * */
export const partial = (fn, ...args) => fn.bind(null, ...args);
