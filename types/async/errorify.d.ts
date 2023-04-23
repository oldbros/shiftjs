export function errorify(fn: AnyAsyncFn): (...args: any[]) => Promise<any>;
export type AnyAsyncFn = import('./types').AnyAsyncFn;
