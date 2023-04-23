declare const _default: {
    PersistentVector: typeof dataStructures.PersistentVector;
    partial: (fn: import("./sync/types.js").AnyFunc, ...args: any[]) => import("./sync/types.js").AnyFunc;
    partialOne: (fn: import("./sync/types.js").AnyFunc, arg: any) => import("./sync/types.js").AnyFunc;
    partialReverse: (fn: import("./sync/types.js").AnyFunc, ...args: any[]) => import("./sync/types.js").AnyFunc;
    partialReverseOne: (fn: import("./sync/types.js").AnyFunc, arg: any) => import("./sync/types.js").AnyFunc;
    partialObject: (fn: import("./sync/types.js").AnyFunc, props: any) => import("./sync/types.js").AnyFunc;
    partialObjectLast: (fn: import("./sync/types.js").AnyFunc, props: any) => import("./sync/types.js").AnyFunc;
    partialObjectFirst: (fn: import("./sync/types.js").AnyFunc, props: any) => import("./sync/types.js").AnyFunc;
    curry: (fn: import("./sync/types.js").AnyFunc) => import("./sync/types.js").AnyFunc;
    compose: (...fns: any[]) => (args?: any) => any;
    pipe: (...fns: any[]) => (args?: any) => any;
    async: typeof async;
};
export default _default;
import * as dataStructures from './persistent/index.js';
import * as async from './async/index.js';
