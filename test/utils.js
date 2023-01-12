export const roundDecimal = (number, decimals = 2) =>
  Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
