/**
 * Pipe - Left to Right function composition
 * @param  {object[]} fns
 * @returns {(args?: any) => any}
*/
export const pipe = (...fns) => (args) => {
  if (fns.length === 0) return args;
  const fn = fns.shift();
  const res = fn(args);
  return pipe(...fns)(res);
};
