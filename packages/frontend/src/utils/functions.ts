export const numbersEqualInRange = (
  firstNumber: number,
  secondNumber: number,
  range: number,
) => {
  return Math.abs(firstNumber - secondNumber) <= range;
};
