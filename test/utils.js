export const roundDecimal = (number, decimals) =>
  Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
