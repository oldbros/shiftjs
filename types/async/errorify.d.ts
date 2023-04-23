export function errorify(fn: AnyAsyncFn): (...args: any[]) => Promise<[Error?, any]>;
export type AnyAsyncFn = import('./types').AnyAsyncFn;
