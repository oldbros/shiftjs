/** @typedef {import('./.types').AnyFunc} AnyFunc*/

/**
 * partial - high performance multiple arguments partial application function
 * see https://en.wikipedia.org/wiki/Partial_application
 * Arguments length changes
 * @type {(fn: AnyFunc, ...args: any[]) => AnyFunc}
 * */
export const partial = (fn, ...args) => fn.bind(null, ...args);

/**
 * partialObject - high performance object as argument partial application function
 * Arguments length always 1
 * @type {(fn: AnyFunc, args: object) => AnyFunc}
 * */
export const partialObject = (fn, args) => (delta) => fn(Object.assign(args, delta));
