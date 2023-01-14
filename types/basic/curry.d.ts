/** @typedef {import('./.types').AnyFunc} AnyFunc*/
/**
 * Curry - high performant curry function
 * see https://en.wikipedia.org/wiki/Currying
 * @type {(fn: AnyFunc) => AnyFunc}
 * */
export const curry: (fn: AnyFunc) => AnyFunc;
export type AnyFunc = import('./.types').AnyFunc;
