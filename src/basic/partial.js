/** @typedef {import('./.types').AnyFunc} AnyFunc*/

/**
 * partial - high performance partial application function
 * multiple arguments, left to right
 * Arguments length changes
 * see https://en.wikipedia.org/wiki/Partial_application
 * @type {(fn: AnyFunc, ...args: any[]) => AnyFunc}
 * */
export const partial = (fn, ...args) => fn.bind(null, ...args);

/**
 * partialOne - high performance partial application function
 * 1 argument, left to right
 * Arguments length changes
 * @type {(fn: AnyFunc, arg: any) => AnyFunc}
 * */
export const partialOne = (fn, arg) => fn.bind(null, arg);

/**
 * partialReverse - high performance application function
 * multiple arguments, right to left
 * No arguments length
 * @type {(fn: AnyFunc, ...args: any[]) => AnyFunc}
 * */
export const partialReverse = (fn, ...args) => (...left) => fn(...left, ...args.reverse());

/**
 * partialReverseOne - high performance partial application function
 * one argument, right to left
 * No arguments length
 * @type {(fn: AnyFunc, arg: any) => AnyFunc}
 * */
export const partialReverseOne = (fn, arg) => (...rest) => fn(...rest, arg);

/**
 * partialObject - high performance partial application function
 * all arguments must be an object, applies multiple propeties to arguments
 * Arguments length always 1
 * @type {(fn: AnyFunc, props: object) => AnyFunc}
 * */
export const partialObject = (fn, props) => (delta) => fn(Object.assign(props, delta));

/**
 * partialObjectLast - high performance partial application function
 * last element must be an object, applies any properties to the last argument
 * No arguments length
 * @type {(fn: AnyFunc, props: object) => AnyFunc}
 * */
export const partialObjectLast = (fn, props) =>
  (...args) => {
    const last = args[args.length - 1];
    Object.assign(last, props);
    return fn(...args);
  };

/**
 * partialObjectFirst - high performance partial application function
 * first element must be an object, applies any properties to the first argument
 * No arguments length
 * @type {(fn: AnyFunc, props: object) => AnyFunc}
 * */
export const partialObjectFirst = (fn, props) =>
  (...args) => {
    const first = args[0];
    Object.assign(first, props);
    return fn(...args);
  };
