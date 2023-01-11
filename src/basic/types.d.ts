// AnyFunc - generic arrow-function type for js
type AnyFunc = (...args: any[]) => any;

export function partial(fn: AnyFunc, ...args: any[]): AnyFunc;
export function curry(fn: AnyFunc): AnyFunc;
