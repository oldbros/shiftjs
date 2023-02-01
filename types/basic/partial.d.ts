/** @typedef {import('./.types').AnyFunc} AnyFunc*/
/**
 * partial - high performance multiple arguments partial application function
 * see https://en.wikipedia.org/wiki/Partial_application
 * Arguments length changes
 * @type {(fn: AnyFunc, ...args: any[]) => AnyFunc}
 * */
export const partial: (fn: AnyFunc, ...args: any[]) => AnyFunc;
/**
 * partialObject - high performance object as argument partial application function
 * Arguments length always 1
 * @type {(fn: AnyFunc, args: object) => AnyFunc}
 * */
export const partialObject: (fn: AnyFunc, args: object) => AnyFunc;
export type AnyFunc = import('./.types').AnyFunc;
