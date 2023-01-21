/** @typedef {import('./.types').AnyFunc} AnyFunc*/

/**
 * Partial - high performance one argument partial application function
 * multiple arguments significantly reduces performance
 * see https://en.wikipedia.org/wiki/Partial_application
 * No arguments length check
 * @type {(fn: AnyFunc, ...args: any[]) => AnyFunc}
 * */
export const partial = (fn, ...args) => fn.bind(null, ...args);
