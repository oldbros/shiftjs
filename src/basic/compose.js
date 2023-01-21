/**
 * Compose - Right to Left function composition
 * @param  {object[]} fns
 * @returns {(args?: any) => any}
*/
export const compose = (...fns) => (args) => {
  if (fns.length === 0) return args;
  const fn = fns.pop();
  const res = fn(args);
  return compose(...fns)(res);
};
